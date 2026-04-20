import { formatDate } from "@/lib/utils"
import { ExternalLink } from "lucide-react"

interface OwnerResponseCardProps {
  response: {
    notes:       string
    evidenceUrl: string | null
    createdAt:   string
  }
}

export function OwnerResponseCard({ response }: OwnerResponseCardProps) {
  return (
    <div className="border-l-2 border-accent/30 pl-4 py-1">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 rounded-full bg-accent-subtle flex items-center justify-center">
          <span className="text-accent text-xs font-bold">O</span>
        </div>
        <span className="text-text-secondary text-xs font-medium">
          Owner responded · {formatDate(response.createdAt)}
        </span>
      </div>
      <p className="text-text-secondary text-sm leading-relaxed">
        {response.notes}
      </p>
      {response.evidenceUrl && (
        
          <a href={response.evidenceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 mt-2 text-accent text-xs hover:underline"
        >
          <ExternalLink size={10} />
          View evidence
        </a>
      )}
    </div>
  )
}