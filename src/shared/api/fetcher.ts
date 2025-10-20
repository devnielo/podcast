export function buildProxiedUrl(url: string, corsProxy = true, proxyBase = import.meta.env.VITE_CORS_PROXY_URL || undefined) {
  if (!corsProxy) return url
  const base = proxyBase ?? 'https://api.allorigins.win/raw?url='
  return `${base}${encodeURIComponent(url)}`
}

export async function fetchJson<T>(url: string, init?: RequestInit, corsProxy = true): Promise<T> {
  const target = buildProxiedUrl(url, corsProxy)
  const res = await fetch(target, {
    ...init,
    headers: {
      Accept: 'application/json, text/plain, */*',
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Request failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ''}`)
  }
  return (await res.json()) as T
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label = 'request'): Promise<T> {
  if (!timeoutMs) return promise
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(`${label}: timeout`), timeoutMs)
  return promise.finally(() => clearTimeout(timer))
}

async function tryFetchJson<T>(url: string, init: RequestInit | undefined, timeoutMs: number, parser?: (r: Response) => Promise<T>): Promise<T> {
  const res = await withTimeout(fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json, text/plain, */*',
      ...(init?.headers ?? {}),
    },
  }), timeoutMs)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Request failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ''}`)
  }
  if (parser) return parser(res)
  return (await res.json()) as T
}

export interface FetchJsonSmartOptions {
  timeoutDirectMs?: number
  timeoutProxyMs?: number
  proxies?: string[]
  tryDirectFirst?: boolean
}

// Tries direct iTunes URL quickly, then races multiple proxies to reduce tail latency.
export async function fetchJsonSmart<T>(url: string, init?: RequestInit, opts: FetchJsonSmartOptions = {}): Promise<T> {
  const {
    timeoutDirectMs = 2000,
    timeoutProxyMs = 8000,
    tryDirectFirst = true,
    proxies = [
      // AllOrigins RAW
      'https://api.allorigins.win/raw?url=',
      // Isomorphic-git CORS proxy
      'https://cors.isomorphic-git.org/',
    ],
  } = opts

  // 1) Try direct (fast timeout) to leverage CORS if allowed or CDN warm cache
  if (tryDirectFirst) {
    try {
      return await tryFetchJson<T>(url, init, timeoutDirectMs)
    } catch {}
  }

  // 2) Race proxies to minimize slow proxy tail latencies
  const proxyPromises = proxies.map((base) => {
    // Special case: AllOrigins /get returns wrapper JSON
    const isAllOriginsGet = base.endsWith('/get?url=')
    const target = `${base}${encodeURIComponent(url)}`
    if (isAllOriginsGet) {
      return tryFetchJson<{ contents: string }>(target, init, timeoutProxyMs).then((data) => JSON.parse(data.contents) as T)
    }
    return tryFetchJson<T>(target, init, timeoutProxyMs)
  })

  // Prefer the first fulfilled result
  return await Promise.any(proxyPromises)
}
