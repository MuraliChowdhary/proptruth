import type { Context } from "hono"
import { PropertyService } from "../services/property.service"
import { CreatePropertySchema, PropertySearchSchema } from "@proptruth/shared"

const service = new PropertyService()

export class PropertyController {

  async search(c: Context) {
    const query = c.req.query("q")
    if (!query) return c.json({ error: "Query required" }, 400)

    const parsed = PropertySearchSchema.safeParse({ query })
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400)

    const results = await service.search(query)
    return c.json(results)
  }

  async getById(c: Context) {
    const id = c.req.param("id")
    if(!id) {
        return c.json({ error: "ID required" }, 400)
    }
    const property = await service.getById(id)
    if (!property) return c.json({ error: "Not found" }, 404)
    return c.json(property)
  }

  async getReports(c: Context) {
    const id = c.req.param("id")
    if(!id) {
        return c.json({ error: "ID required" }, 400)
    }
    const reports = await service.getReports(id)
    return c.json(reports)
  }

  async create(c: Context) {
    const body = await c.req.json()
    const parsed = CreatePropertySchema.safeParse(body)
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400)

    const property = await service.create(parsed.data)
    return c.json(property, 201)
  }
}