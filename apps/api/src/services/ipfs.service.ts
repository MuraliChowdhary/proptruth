import PinataSDK from "@pinata/sdk"

const pinata = new PinataSDK(
  process.env.PINATA_API_KEY!,
  process.env.PINATA_SECRET_KEY!
)

export class IPFSService {

  async pinReport(reportData: object): Promise<string> {
    const result = await pinata.pinJSONToIPFS(reportData, {
      pinataMetadata: { name: `proptruth-report-${Date.now()}` },
    })
    return result.IpfsHash
  }
}