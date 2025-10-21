/**
 * CORS Proxy fallback system
 * Tries multiple strategies to load audio/resources that have CORS restrictions
 */

export const CORS_PROXIES = [
  // Strategy 1: Direct URL (some servers allow CORS)
  (url: string) => url,
  
  // Strategy 2: cors-anywhere.herokuapp.com (requires activation)
  (url: string) => `https://cors-anywhere.herokuapp.com/${url}`,
]

export function getCorsProxyUrl(url: string, proxyIndex: number = 0): string {
  if (proxyIndex >= CORS_PROXIES.length) {
    return url // Fallback to direct URL if all proxies fail
  }
  return CORS_PROXIES[proxyIndex](url)
}
