import { prisma } from "@proptruth/db"
import { aiQueue } from "../queues"
import type { CreateReportInput } from "@proptruth/shared"

export class ReportService {

  async createReport(tenantId: string, input: CreateReportInput) {
    const publishAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    const report = await prisma.report.create({
      data: {
        propertyId:   input.propertyId,
        tenantId,
        moveInDate:   new Date(input.moveInDate),
        moveOutDate:  new Date(input.moveOutDate),
        agreementUrl: input.agreementUrl,
        tenantNotes:  input.tenantNotes,
        photoUrls:    input.photoUrls,
        publishAt,
      },
    })

    await aiQueue.add("analyze-report", { reportId: report.id })

    return report
  }

  async getById(id: string) {
    return prisma.report.findUnique({
      where:   { id },
      include: { ownerResponse: true },
    })
  }

  async getStatus(id: string) {
    return prisma.report.findUnique({
      where:  { id },
      select: {
        id:           true,
        aiStatus:     true,
        anchorStatus: true,
        publishAt:    true,
        publishedAt:  true,
      },
    })
  }
}