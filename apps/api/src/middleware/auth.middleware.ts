import { verifyToken } from "@clerk/backend"
import type { Context, Next } from "hono"

export async function authMiddleware(c: Context, next: Next) {
    const authHeader = c.req.header("Authorization")

    if (!authHeader?.startsWith("Bearer ")) {
        return c.json({ error: "Unauthorized" }, 401)
    }

    const token = authHeader.split(" ")[1]

    if(!token) {
        return c.json({ error: "Unauthorized" }, 401)
    }

    try {
        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        })
        c.set("userId", payload.sub)
        await next()
    } catch {
        return c.json({ error: "Invalid token" }, 401)
    }
}