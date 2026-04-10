import { Worker } from "bullmq"
import { redis } from "../lib/redis"
import { prisma  } from "@proptruth/db"
import { AIService } from "../services/ai.service"
import { chainQueue } from "../queues"

const aiService = new AIService()

export const aiWorker = new Worker(
  "ai-analysis",
  async (job) => {
    const { reportId } = job.data

    await prisma.report.update({
      where: { id: reportId },
      data:  { aiStatus: "PROCESSING" },
    })

    const report = await prisma.report.findUnique({
      where: { id: reportId },
    })

    if (!report) throw new Error("Report not found")

    const result = await aiService.analyzePhotos(
      report.photoUrls,
      report.tenantNotes
    )

    const avgConfidence =
      result.findings.reduce((s, f) => s + f.confidence, 0) /
      (result.findings.length || 1)

    await prisma.report.update({
      where: { id: reportId },
      data: {
        aiStatus:       "COMPLETE",
        aiFindings:     result.findings,
        aiConfidence:   avgConfidence,
        aiMismatchFlag: result.mismatchFlag,
      },
    })

    await chainQueue.add("anchor-report", { reportId })
  },
  { connection: redis }
)