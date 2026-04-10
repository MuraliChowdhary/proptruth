import type { Context } from "hono"
import { ReportService } from "../services/report.service"
import { CreateReportSchema } from "@proptruth/shared"

const service = new ReportService()

export class ReportController {

  async create(c: Context) {
    const tenantId = c.get("userId") as string
    const body     = await c.req.json()

    const parsed = CreateReportSchema.safeParse(body)
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400)

    const report = await service.createReport(tenantId, parsed.data)
    return c.json(report, 201)
  }

  async getById(c: Context) {
    const id     = c.req.param("id")
    if(!id){
        return c.json({ error: "ID required" }, 400)
    }
    const report = await service.getById(id)
    if (!report) return c.json({ error: "Not found" }, 404)
    return c.json(report)
  }

  async getStatus(c: Context) {
    const id     = c.req.param("id")
    if(!id){
        return c.json({ error: "ID required" }, 400)
    }
    const status = await service.getStatus(id)
    if (!status) return c.json({ error: "Not found" }, 404)
    return c.json(status)
  }
}