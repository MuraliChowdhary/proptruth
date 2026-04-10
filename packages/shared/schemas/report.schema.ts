import { z } from "zod"

export const CreateReportSchema = z.object({
  propertyId:   z.string().cuid(),
  moveInDate:   z.string().datetime(),
  moveOutDate:  z.string().datetime(),
  agreementUrl: z.string().url(),
  tenantNotes:  z.string().max(1000).optional(),
  photoUrls:    z.array(z.string().url()).min(1).max(10),
})

export const OwnerResponseSchema = z.object({
  reportId:    z.string().cuid(),
  notes:       z.string().min(1).max(1000),
  evidenceUrl: z.string().url().optional(),
})

export type CreateReportInput  = z.infer<typeof CreateReportSchema>
export type OwnerResponseInput = z.infer<typeof OwnerResponseSchema>