import { ethers } from "ethers"

export const provider = new ethers.JsonRpcProvider(
  process.env.SEPOLIA_RPC_URL
)

export const signer = new ethers.Wallet(
  process.env.DEPLOYER_PRIVATE_KEY!,
  provider
)