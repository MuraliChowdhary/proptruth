import { z } from "zod"

export const TenureVerificationSchema = z.object({
  tenantName:   z.string().min(1),
  address:      z.string().min(1),
  moveInDate:   z.string().datetime(),
  moveOutDate:  z.string().datetime(),
  confidence:   z.number().min(0).max(1),
})

export type TenureVerificationResult = z.infer<typeof TenureVerificationSchema>