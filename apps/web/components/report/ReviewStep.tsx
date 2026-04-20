import { formatDate } from "@/lib/utils"
import { FileText, Image, Calendar } from "lucide-react"

interface ReviewStepProps {
  data: {
    propertySearch: string
    moveInDate:     string
    moveOutDate:    string
    agreementUrl:   string
    photoUrls:      string[]
    tenantNotes:    string
  }
}

export function ReviewStep({ data }: ReviewStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="card">
        <p className="text-text-muted text-xs uppercase tracking-wide mb-4">
          Property
        </p>
        <p className="text-text-primary font-medium">{data.propertySearch}</p>
        <div className="flex items-center gap-2 mt-2">
          <Calendar size={13} className="text-text-muted" />
          <span className="text-text-secondary text-sm">
            {data.moveInDate
              ? formatDate(data.moveInDate)
              : "—"}{" "}
            → {data.moveOutDate ? formatDate(data.moveOutDate) : "—"}
          </span>
        </div>
      </div>

      <div className="card">
        <p className="text-text-muted text-xs uppercase tracking-wide mb-4">
          Documents
        </p>
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-accent" />
          <span className="text-text-secondary text-sm">
            Rental agreement uploaded
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Image size={14} className="text-accent" />
          <span className="text-text-secondary text-sm">
            {data.photoUrls.length} photos uploaded
          </span>
        </div>
      </div>

      {data.photoUrls.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {data.photoUrls.slice(0, 8).map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Photo ${i + 1}`}
              className="aspect-square object-cover rounded-lg border border-border"
            />
          ))}
        </div>
      )}

      {data.tenantNotes && (
        <div className="card">
          <p className="text-text-muted text-xs uppercase tracking-wide mb-3">
            Your notes
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {data.tenantNotes}
          </p>
        </div>
      )}

      <div className="bg-accent-subtle border border-accent/20 rounded-xl p-4">
        <p className="text-accent text-sm font-medium mb-1">
          Before you submit
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          Your report will be analyzed by AI and anchored permanently on the blockchain after a 7-day review period. This cannot be undone.
        </p>
      </div>
    </div>
  )
}