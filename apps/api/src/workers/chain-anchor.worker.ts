import { Worker } from "bullmq"
import { redis } from "../lib/redis"
import { prisma } from "@proptruth/db"
import { IPFSService } from "../services/ipfs.service"
import { ChainService } from "../services/chain.service"
import { PropertyService } from "../services/property.service"

const ipfsService     = new IPFSService()
const chainService    = new ChainService()
const propertyService = new PropertyService()

export const chainWorker = new Worker(
  "chain-anchor",
  async (job) => {
    const { reportId } = job.data

    const report = await prisma.report.findUnique({
      where:   { id: reportId },
      include: { property: true },
    })

    if (!report) throw new Error("Report not found")

    const cid = await ipfsService.pinReport({
      reportId:    report.id,
      propertyId:  report.propertyId,
      address:     report.property.address,
      findings:    report.aiFindings,
      confidence:  report.aiConfidence,
      mismatch:    report.aiMismatchFlag,
      timestamp:   new Date().toISOString(),
    })

    const txHash = await chainService.anchorReport(
      report.property.address,
      cid,
      report.aiConfidence ?? 0,
      report.aiMismatchFlag
    )

    await prisma.report.update({
      where: { id: reportId },
      data: {
        ipfsCid:      cid,
        txHash,
        anchorStatus: "ANCHORED",
        publishedAt:  new Date(),
      },
    })

    await propertyService.updatePropScore(report.propertyId)
  },
  { connection: redis }
)