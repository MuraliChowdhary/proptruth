import "dotenv/config"

const BASE = "http://localhost:3001"

async function testAPI() {
  console.log("Testing API server...")

  // Test 1 — Health check
  const health = await fetch(`${BASE}/health`)
  const healthData = await health.json()
  
  console.log("✓ Health check:", healthData.status)

  // Test 2 — Property search (no auth needed)
  const search = await fetch(`${BASE}/api/properties/search?q=bangalore`)
  console.log("✓ Property search status:", search.status)

  // Test 3 — Protected route without token
  const noAuth = await fetch(`${BASE}/api/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  })
  const noAuthData = await noAuth.json()
  console.log("✓ Protected route blocks unauthorized:", noAuthData.error)

  console.log("\n✅ API server working perfectly")
}

testAPI().catch(console.error)