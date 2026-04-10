import dotenv from "dotenv"
dotenv.config();
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

if (process.env.NODE_ENV !== "production") {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set!")
  }
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });