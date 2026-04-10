import { ethers } from "ethers"
import { signer } from "../lib/ethers"

const ABI = [
    "function anchorReport(bytes32 propertyId, string ipfsCid, uint8 aiConfidence, bool mismatchFlag) external",
    "function getReports(bytes32 propertyId) external view returns (tuple(string ipfsCid, address submitter, uint256 timestamp, uint8 aiConfidence, bool mismatchFlag)[])",
    "function getReportCount(bytes32 propertyId) external view returns (uint256)",
]

export class ChainService {

    private contract: ethers.Contract

    constructor() {
        this.contract = new ethers.Contract(
            process.env.CONTRACT_ADDRESS!,
            ABI,
            signer
        )
    }

    async anchorReport(
        propertyAddress: string,
        ipfsCid: string,
        aiConfidence: number,
        mismatchFlag: boolean
    ) {
        if (!this.contract) {
            throw new Error("Contract not initialized")
        }

        const propertyId = ethers.keccak256(
            ethers.toUtf8Bytes(propertyAddress.toLowerCase().trim())
        )

        const tx = await this.contract!.anchorReport(
            propertyId,
            ipfsCid,
            Math.round(aiConfidence * 100),
            mismatchFlag
        )

        const receipt = await tx.wait()
        return receipt?.hash as string
    }

    async getReports(propertyAddress: string) {
        const propertyId = ethers.keccak256(
            ethers.toUtf8Bytes(propertyAddress.toLowerCase().trim())
        )
        return this.contract.getReports(propertyId)
    }
}