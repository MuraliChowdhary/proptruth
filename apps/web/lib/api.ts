const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

async function request<T>(
  path:    string,
  options: RequestInit = {},
  token?:  string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }))
    throw new Error(error.error ?? "Request failed")
  }

  return res.json()
}

export const api = {
  properties: {
    search: (query: string) =>
      request<any[]>(`/api/properties/search?q=${encodeURIComponent(query)}`),

    getById: (id: string) =>
      request<any>(`/api/properties/${id}`),

    getReports: (id: string) =>
      request<any[]>(`/api/properties/${id}/reports`),
  },

  reports: {
    create: (data: any, token: string) =>
      request<any>("/api/reports", {
        method: "POST",
        body:   JSON.stringify(data),
      }, token),

    getStatus: (id: string, token: string) =>
      request<any>(`/api/reports/${id}/status`, {}, token),
  },

  owner: {
    getProperties: (token: string) =>
      request<any[]>("/api/owner/properties", {}, token),

    respond: (data: any, token: string) =>
      request<any>("/api/owner/respond", {
        method: "POST",
        body:   JSON.stringify(data),
      }, token),
  },
}