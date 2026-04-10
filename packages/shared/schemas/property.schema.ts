import { z } from "zod"

export const CreatePropertySchema = z.object({
  googlePlaceId: z.string().min(1),
  address:       z.string().min(1),
  city:          z.string().min(1),
  state:         z.string().min(1),
  pincode:       z.string().length(6),
})

export const PropertySearchSchema = z.object({
  query: z.string().min(3),
})

export type CreatePropertyInput = z.infer<typeof CreatePropertySchema>
export type PropertySearchInput = z.infer<typeof PropertySearchSchema>