"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { StepIndicator }   from "@/components/report/StepIndicator"
import { TenureStep }      from "@/components/report/TenureStep"
import { PhotoStep }       from "@/components/report/PhotoStep"
import { ReviewStep }      from "@/components/report/ReviewStep"
import { AnalysisProgress } from "@/components/report/AnalysisProgress"

const STEPS = ["Tenancy details", "Photos & notes", "Review & submit"]

interface FormData {
  propertySearch: string
  propertyId:     string
  moveInDate:     string
  moveOutDate:    string
  agreementUrl:   string
  photoUrls:      string[]
  tenantNotes:    string
}

const INITIAL: FormData = {
  propertySearch: "",
  propertyId:     "",
  moveInDate:     "",
  moveOutDate:    "",
  agreementUrl:   "",
  photoUrls:      [],
  tenantNotes:    "",
}

export default function SubmitReportPage() {
  const router          = useRouter()
  const { getToken }    = useAuth()
  const [step,     setStep]     = useState(0)
  const [formData, setFormData] = useState<FormData>(INITIAL)
  const [submitting, setSubmitting] = useState(false)
  const [reportId,   setReportId]   = useState<string | null>(null)

  function updateForm(data: Partial<FormData>) {
    setFormData(prev => ({ ...prev, ...data }))
  }

  function canProceed(): boolean {
    if (step === 0) {
      return !!(
        formData.propertyId &&
        formData.moveInDate &&
        formData.moveOutDate &&
        formData.agreementUrl
      )
    }
    if (step === 1) {
      return formData.photoUrls.length >= 3
    }
    return true
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
        
      const token = await getToken()
      const res   = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reports`,
        {
          method:  "POST",
          headers: {
            "Content-Type":  "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            propertyId:   formData.propertyId,
            moveInDate:   new Date(formData.moveInDate).toISOString(),
            moveOutDate:  new Date(formData.moveOutDate).toISOString(),
            agreementUrl: formData.agreementUrl,
            tenantNotes:  formData.tenantNotes,
            photoUrls:    formData.photoUrls,
          }),
        }
      )

      const data = await res.json()
      setReportId(data.id)
      setStep(3)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  // Processing state
  if (step === 3 && reportId) {
    return (
      <div className="section max-w-lg mx-auto">
        <AnalysisProgress
          reportId={reportId}
          onComplete={() => router.push(`/property/${formData.propertyId}`)}
        />
      </div>
    )
  }

  return (
    <div className="section max-w-2xl mx-auto">

      <div className="text-center mb-10">
        <h1 className="font-display text-4xl text-text-primary mb-3">
          Submit a report
        </h1>
        <p className="text-text-secondary">
          Document the truth. Help the next tenant.
        </p>
      </div>

      <div className="mb-10">
        <StepIndicator steps={STEPS} currentStep={step} />
      </div>

      <div className="card min-h-[400px]">
        {step === 0 && (
          <TenureStep
            data={formData}
            onChange={updateForm}
          />
        )}
        {step === 1 && (
          <PhotoStep
            photoUrls={formData.photoUrls}
            tenantNotes={formData.tenantNotes}
            onPhotosChange={urls => updateForm({ photoUrls: urls })}
            onNotesChange={notes => updateForm({ tenantNotes: notes })}
          />
        )}
        {step === 2 && (
          <ReviewStep data={formData} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setStep(s => s - 1)}
          disabled={step === 0}
          className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Back
        </button>

        {step < 2 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canProceed()}
            className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary disabled:opacity-40"
          >
            {submitting ? "Submitting..." : "Submit report"}
          </button>
        )}
      </div>

    </div>
  )
}