import {prisma} from "@proptruth/db"
import type { OwnerResponseInput } from "@proptruth/shared"

export class OwnerService {

  async respond(ownerId: string, input: OwnerResponseInput) {
    const report = await prisma.report.findUnique({
      where:   { id: input.reportId },
      include: { property: true },
    })

    if (!report) throw new Error("Report not found")

    if (report.property.ownerId !== ownerId) {
      throw new Error("Unauthorized")
    }

    return prisma.ownerResponse.create({
      data: {
        reportId:    input.reportId,
        notes:       input.notes,
        evidenceUrl: input.evidenceUrl,
      },
    })
  }

  async getOwnerProperties(ownerId: string) {
    return prisma.property.findMany({
      where: { ownerId },
      include: {
        reports: {
          where:   { publishedAt: { not: null } },
          orderBy: { publishedAt: "desc" },
          take:    5,
        },
      },
    })
  }
}