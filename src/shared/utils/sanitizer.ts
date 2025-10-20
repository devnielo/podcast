import DOMPurify from 'dompurify'

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - Raw HTML string to sanitize
 * @returns Sanitized HTML string safe for dangerouslySetInnerHTML
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''
  return DOMPurify.sanitize(html)
}

/**
 * Sanitizes plain text content (removes any HTML tags)
 * @param text - Text that might contain HTML
 * @returns Plain text without HTML
 */
export function sanitizeText(text: string): string {
  if (!text) return ''
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] })
}
