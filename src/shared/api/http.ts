import { CORS_PROXY_URL } from '@/shared/config/api'

async function request<TResponse>(url: string, init?: RequestInit): Promise<TResponse> {
  const response = await fetch(url, init)

  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`)
    console.error('[http] request error', { url, status: response.status })
    throw error
  }

  return (await response.json()) as TResponse
}

export async function fetchJson<TResponse>(url: string, init?: RequestInit): Promise<TResponse> {
  if (typeof window === 'undefined') {
    return request<TResponse>(url, init)
  }

  try {
    return await request<TResponse>(url, init)
  } catch (error) {
    const proxiedUrl = `${CORS_PROXY_URL}${encodeURIComponent(url)}`
    return request<TResponse>(proxiedUrl, init)
  }
}
