import { notFound } from "next/navigation"
import { MapPin, Calendar, FileText } from "lucide-react"
import { PropScoreRing } from "@/components/property/PropScoreRing"
import { ReportTimeline } from "@/components/property/ReportTimeline"
import { formatDate } from "@/lib/utils"

async function getProperty(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/properties/${id}`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function getReports(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/properties/${id}/reports`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [property, reports] = await Promise.all([
    getProperty(id),
    getReports(id),
  ])

  if (!property) notFound()

  return (
    <div className="section">
      <div className="grid lg:grid-cols-3 gap-12">

        {/* Left — Score + Meta */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 flex flex-col gap-6">

            <div className="card flex flex-col items-center py-8">
              <PropScoreRing
                score={property.propScore ?? 0}
                reportCount={property.reportCount}
              />
            </div>

            <div className="card flex flex-col gap-4">
              <h1 className="font-display text-xl text-text-primary leading-snug">
                {property.address}
              </h1>

              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-text-muted mt-0.5 shrink-0" />
                  <span className="text-text-secondary text-sm">
                    {property.city}, {property.state} — {property.pincode}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-text-muted shrink-0" />
                  <span className="text-text-secondary text-sm">
                    {property.reportCount} verified{" "}
                    {property.reportCount === 1 ? "report" : "reports"}
                  </span>
                </div>

                {property.lastReportAt && (
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-text-muted shrink-0" />
                    <span className="text-text-secondary text-sm">
                      Last reported {formatDate(property.lastReportAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <a href="/report/submit" className="btn-primary text-center text-sm">
              Submit a report for this property
            </a>

          </div>
        </div>

        {/* Right — Report Timeline */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl text-text-primary">
              Condition history
            </h2>
            <span className="text-text-muted text-sm">
              {reports.length} {reports.length === 1 ? "report" : "reports"}
            </span>
          </div>

          <ReportTimeline reports={reports} />
        </div>

      </div>
    </div>
  )
}