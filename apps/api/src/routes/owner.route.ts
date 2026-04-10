import { Hono } from "hono"
import { authMiddleware } from "../middleware/auth.middleware"
import { OwnerController } from "../controllers/owner.controller"

const controller = new OwnerController()
export const ownerRoute = new Hono()

ownerRoute.post("/respond",   authMiddleware, (c) => controller.respond(c))
ownerRoute.get("/properties", authMiddleware, (c) => controller.getProperties(c))