import { ExternalLink, Shield } from "lucide-react"
import { formatTxHash } from "@/lib/utils"

interface ChainVerifyBadgeProps {
  txHash:  string
  ipfsCid: string
}

export function ChainVerifyBadge({ txHash, ipfsCid }: ChainVerifyBadgeProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 mb-1">
        <Shield size={12} className="text-accent" />
        <span className="text-xs font-medium text-accent">
          Blockchain verified
        </span>
      </div>

      
       <a href={`https://sepolia.etherscan.io/tx/${txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2 hover:border-accent/40 transition-colors group"
      >
        <span className="text-text-muted text-xs">TX</span>
        <span className="font-mono text-xs text-text-secondary group-hover:text-text-primary transition-colors">
          {formatTxHash(txHash)}
        </span>
        <ExternalLink size={10} className="text-text-muted ml-auto" />
      </a>

      
        <a href={`https://gateway.pinata.cloud/ipfs/${ipfsCid}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2 hover:border-accent/40 transition-colors group"
        >
        <span className="text-text-muted text-xs">IPFS</span>
        <span className="font-mono text-xs text-text-secondary group-hover:text-text-primary transition-colors">
          {formatTxHash(ipfsCid)}
        </span>
        <ExternalLink size={10} className="text-text-muted ml-auto" />
      </a>
    </div>
  )
}