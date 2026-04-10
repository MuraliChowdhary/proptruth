import { prisma  } from "@proptruth/db"
import type { CreatePropertyInput } from "@proptruth/shared"

export class PropertyService {

  async search(query: string) {
    return prisma.property.findMany({
      where: {
        OR: [
          { address: { contains: query, mode: "insensitive" } },
          { city:    { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: {
        id:           true,
        address:      true,
        city:         true,
        state:        true,
        propScore:    true,
        reportCount:  true,
        lastReportAt: true,
      },
    })
  }

  async getById(id: string) {
    return prisma.property.findUnique({
      where: { id },
      include: {
        _count: { select: { reports: true } },
      },
    })
  }

  async getReports(propertyId: string) {
    return prisma.report.findMany({
      where: {
        propertyId,
        publishedAt: { not: null },
        aiStatus:    "COMPLETE",
      },
      include: { ownerResponse: true },
      orderBy: { publishedAt: "desc" },
    })
  }

  async create(data: CreatePropertyInput) {
    return prisma.property.upsert({
      where:  { googlePlaceId: data.googlePlaceId },
      update: {},
      create: data,
    })
  }

  async updatePropScore(propertyId: string) {
    const reports = await prisma.report.findMany({
      where: {
        propertyId,
        aiStatus:    "COMPLETE",
        publishedAt: { not: null },
      },
      select: {
        aiConfidence:   true,
        aiMismatchFlag: true,
        publishedAt:    true,
      },
    })

    if (reports.length === 0) return

    const avgConfidence =
      reports.reduce((sum, r) => sum + (r.aiConfidence ?? 0), 0) / reports.length

    const mismatchPenalty =
      reports.filter(r => r.aiMismatchFlag).length * 5

    const score = Math.min(100, avgConfidence * 100 + mismatchPenalty)

    await prisma.property.update({
      where: { id: propertyId },
      data: {
        propScore:    score,
        reportCount:  reports.length,
        lastReportAt: new Date(),
      },
    })
  }
}