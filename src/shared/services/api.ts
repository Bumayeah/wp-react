const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/wp-json'

let unauthorizedHandler: (() => void) | null = null

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler
}

function getAuthHeaders(withContentType = true): Record<string, string> {
  const token = localStorage.getItem('swg-token')
  const headers: Record<string, string> = withContentType ? { 'Content-Type': 'application/json' } : {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

function handleResponse(res: Response) {
  if (res.status === 401) {
    unauthorizedHandler?.()
    throw new Error('Unauthorized')
  }
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`)
}

export async function apiGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    const { mockGet } = await import('./mock-api')
    return mockGet<T>(path, params)
  }
  const url = new URL(`${BASE_URL}${path}`)
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), { headers: getAuthHeaders() })
  handleResponse(res)
  return res.json() as Promise<T>
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    const { mockPost } = await import('./mock-api')
    return mockPost<T>(path, body)
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  })
  handleResponse(res)
  return res.json() as Promise<T>
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    const { mockPatch } = await import('./mock-api')
    return mockPatch<T>(path, body)
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  })
  handleResponse(res)
  return res.json() as Promise<T>
}

export async function apiDelete(path: string): Promise<void> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    const { mockDelete } = await import('./mock-api')
    mockDelete(path)
    return
  }
  const res = await fetch(`${BASE_URL}${path}`, { method: 'DELETE', headers: getAuthHeaders(false) })
  handleResponse(res)
}
