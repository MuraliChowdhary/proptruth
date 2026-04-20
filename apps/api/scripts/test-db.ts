import "dotenv/config"
import { prisma as db } from "@proptruth/db"

async function testDB() {
  console.log("Testing DB connection...")

  // Test 1 — Create a user
  const user = await db.user.create({
    data: {
      clerkId: "test_clerk_123",
      name:    "Test Tenant",
      email:   "test@proptruth.dev",
      role:    "TENANT",
    },
  })
  console.log("✓ User created:", user.id)

  // Test 2 — Create a property
  const property = await db.property.create({
    data: {
      googlePlaceId: "test_place_123",
      address:       "123 MG Road",
      city:          "Bangalore",
      state:         "Karnataka",
      pincode:       "560001",
    },
  })
  console.log("✓ Property created:", property.id)

  // Test 3 — Read it back
  const found = await db.property.findUnique({
    where: { id: property.id },
  })
  console.log("✓ Property fetched:", found?.address)

  // Test 4 — Clean up test data
  await db.property.delete({ where: { id: property.id } })
  await db.user.delete({ where: { id: user.id } })
  console.log("✓ Cleanup done")

  console.log("\n✅ DB connection working perfectly")
}

testDB()
  .catch(console.error)
  .finally(() => db.$disconnect())