"use client"

import { useState } from "react"
import { Upload, FileText, X } from "lucide-react"

interface TenureData {
  propertySearch: string
  propertyId:     string
  moveInDate:     string
  moveOutDate:    string
  agreementUrl:   string
}

interface TenureStepProps {
  data:     TenureData
  onChange: (data: Partial<TenureData>) => void
}

export function TenureStep({ data, onChange }: TenureStepProps) {
  const [searching,  setSearching]  = useState(false)
  const [results,    setResults]    = useState<any[]>([])
  const [uploading,  setUploading]  = useState(false)
  const [fileName,   setFileName]   = useState("")

  async function searchProperty(query: string) {
    onChange({ propertySearch: query, propertyId: "" })
    if (query.length < 3) { setResults([]); return }

    setSearching(true)
    try {
      const res  = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/properties/search?q=${encodeURIComponent(query)}`
      )
      const data = await res.json()
      setResults(data)
    } finally {
      setSearching(false)
    }
  }

  async function uploadAgreement(file: File) {
    setUploading(true)
    setFileName(file.name)

    try {
      const formData = new FormData()
      formData.append("file",   file)
      formData.append("upload_preset", "proptruth_agreements")

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
        { method: "POST", body: formData }
      )
      const data = await res.json()
      onChange({ agreementUrl: data.secure_url })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-text-primary font-medium mb-1">
          Property address
        </p>
        <p className="text-text-muted text-sm mb-3">
          Search for the property you lived in
        </p>

        <div className="relative">
          <input
            type="text"
            className="input"
            placeholder="Search by address or area..."
            value={data.propertySearch}
            onChange={e => searchProperty(e.target.value)}
          />

          {results.length > 0 && !data.propertyId && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-lg overflow-hidden z-50">
              {results.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    onChange({
                      propertyId:     p.id,
                      propertySearch: p.address,
                    })
                    setResults([])
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-surface border-b border-border last:border-0 transition-colors"
                >
                  <p className="text-text-primary text-sm">{p.address}</p>
                  <p className="text-text-muted text-xs">
                    {p.city}, {p.state}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {data.propertyId && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-success" />
            <span className="text-success text-xs">Property selected</span>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-text-primary font-medium mb-1 text-sm">
            Move-in date
          </p>
          <input
            type="date"
            className="input"
            value={data.moveInDate}
            onChange={e => onChange({ moveInDate: e.target.value })}
          />
        </div>
        <div>
          <p className="text-text-primary font-medium mb-1 text-sm">
            Move-out date
          </p>
          <input
            type="date"
            className="input"
            value={data.moveOutDate}
            onChange={e => onChange({ moveOutDate: e.target.value })}
          />
        </div>
      </div>

      <div>
        <p className="text-text-primary font-medium mb-1">
          Rental agreement
        </p>
        <p className="text-text-muted text-sm mb-3">
          Upload your agreement to verify your tenancy. PDF only.
        </p>

        {data.agreementUrl ? (
          <div className="flex items-center gap-3 p-4 bg-surface border border-border rounded-xl">
            <FileText size={16} className="text-accent shrink-0" />
            <span className="text-text-primary text-sm flex-1 truncate">
              {fileName}
            </span>
            <button
              onClick={() => {
                onChange({ agreementUrl: "" })
                setFileName("")
              }}
              className="text-text-muted hover:text-danger transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-accent/40 hover:bg-accent-subtle/30 transition-all">
            <Upload size={20} className="text-text-muted" />
            <div className="text-center">
              <p className="text-text-secondary text-sm">
                {uploading ? "Uploading..." : "Click to upload agreement"}
              </p>
              <p className="text-text-muted text-xs mt-1">PDF up to 10MB</p>
            </div>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              disabled={uploading}
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) uploadAgreement(file)
              }}
            />
          </label>
        )}
      </div>
    </div>
  )
}