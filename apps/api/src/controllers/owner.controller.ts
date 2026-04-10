import type { Context } from "hono"
import { OwnerService } from "../services/owner.service"
import { OwnerResponseSchema } from "@proptruth/shared"

const service = new OwnerService()

export class OwnerController {

  async respond(c: Context) {
    const ownerId = c.get("userId") as string
    const body    = await c.req.json()

    const parsed = OwnerResponseSchema.safeParse(body)
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400)

    const response = await service.respond(ownerId, parsed.data)
    return c.json(response, 201)
  }

  async getProperties(c: Context) {
    const ownerId    = c.get("userId") as string
    const properties = await service.getOwnerProperties(ownerId)
    return c.json(properties)
  }
}