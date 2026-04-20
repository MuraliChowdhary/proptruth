"use client"

import { useState, useCallback } from "react"
import { Upload, X, ImageIcon } from "lucide-react"

interface PhotoStepProps {
  photoUrls:    string[]
  tenantNotes:  string
  onPhotosChange: (urls: string[]) => void
  onNotesChange:  (notes: string) => void
}

export function PhotoStep({
  photoUrls,
  tenantNotes,
  onPhotosChange,
  onNotesChange,
}: PhotoStepProps) {
  const [uploading, setUploading] = useState(false)

  async function uploadPhoto(file: File): Promise<string> {
    const formData = new FormData()
    formData.append("file",           file)
    formData.append("upload_preset",  "proptruth_photos")

    const res  = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    )
    const data = await res.json()
    return data.secure_url as string
  }

  async function handleFiles(files: FileList) {
    if (photoUrls.length + files.length > 10) {
      alert("Maximum 10 photos allowed")
      return
    }

    setUploading(true)
    try {
      const uploaded = await Promise.all(
        Array.from(files).map(uploadPhoto)
      )
      onPhotosChange([...photoUrls, ...uploaded])
    } finally {
      setUploading(false)
    }
  }

  function removePhoto(index: number) {
    onPhotosChange(photoUrls.filter((_, i) => i !== index))
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }, [photoUrls])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-text-primary font-medium mb-1">
          Property photos
        </p>
        <p className="text-text-muted text-sm mb-3">
          Upload 3–10 clear photos. Include ceiling, walls, bathroom, kitchen, and any areas of concern.
        </p>

        {/* Upload zone */}
        <label
          className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-accent/40 hover:bg-accent-subtle/30 transition-all"
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
        >
          <div className="w-10 h-10 rounded-xl bg-accent-subtle flex items-center justify-center">
            <Upload size={18} className="text-accent" />
          </div>
          <div className="text-center">
            <p className="text-text-secondary text-sm">
              {uploading
                ? "Uploading photos..."
                : "Drag and drop or click to upload"}
            </p>
            <p className="text-text-muted text-xs mt-1">
              JPG, PNG up to 10MB each · {photoUrls.length}/10 uploaded
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={e => {
              if (e.target.files) handleFiles(e.target.files)
            }}
          />
        </label>

        {/* Minimum warning */}
        {photoUrls.length > 0 && photoUrls.length < 3 && (
          <p className="text-warning text-xs mt-2">
            Please upload at least 3 photos ({3 - photoUrls.length} more needed)
          </p>
        )}

        {/* Photo grid */}
        {photoUrls.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
            {photoUrls.map((url, i) => (
              <div key={url} className="relative group aspect-square">
                <img
                  src={url}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover rounded-xl border border-border"
                />
                <button
                  onClick={() => removePhoto(i)}
                  className="absolute top-1.5 right-1.5 w-5 h-5 bg-danger rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} className="text-white" />
                </button>
                <div className="absolute bottom-1.5 left-1.5 bg-black/40 rounded-md px-1.5 py-0.5">
                  <span className="text-white text-xs font-mono">{i + 1}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <p className="text-text-primary font-medium mb-1">
          Your observations
        </p>
        <p className="text-text-muted text-sm mb-3">
          Describe what you noticed during your tenancy. Be specific.
        </p>
        <textarea
          className="input resize-none"
          rows={4}
          placeholder="e.g. Water damage on bedroom ceiling, appeared after monsoon. Landlord was informed but never fixed it..."
          value={tenantNotes}
          onChange={e => onNotesChange(e.target.value)}
          maxLength={1000}
        />
        <p className="text-text-muted text-xs mt-1 text-right">
          {tenantNotes.length}/1000
        </p>
      </div>
    </div>
  )
}