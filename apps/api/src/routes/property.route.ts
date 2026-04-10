import { Hono } from "hono"
import { authMiddleware } from "../middleware/auth.middleware"
import { PropertyController } from "../controllers/property.controller"

const controller = new PropertyController()
export const propertyRoute = new Hono()

propertyRoute.get("/search",        (c) => controller.search(c))
propertyRoute.get("/:id",           (c) => controller.getById(c))
propertyRoute.get("/:id/reports",   (c) => controller.getReports(c))
propertyRoute.post("/",  authMiddleware, (c) => controller.create(c))