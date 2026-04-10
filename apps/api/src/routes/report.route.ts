import { Hono } from "hono"
import { authMiddleware } from "../middleware/auth.middleware"
import { ReportController } from "../controllers/report.controller"

const controller = new ReportController()
export const reportRoute = new Hono()

reportRoute.post("/",        authMiddleware, (c) => controller.create(c))
reportRoute.get("/:id",      authMiddleware, (c) => controller.getById(c))
reportRoute.get("/:id/status", authMiddleware, (c) => controller.getStatus(c))