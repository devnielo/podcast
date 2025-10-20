import { X } from 'lucide-react'
import type { ReactNode } from 'react'

export type ToastTone = 'info' | 'success' | 'warning' | 'error'

export interface ToastProps {
  title?: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  tone?: ToastTone
  onDismiss?: () => void
  dismissLabel?: string
}

const TONE_STYLES: Record<ToastTone, { container: string; accent: string }> = {
  info: {
    container: 'bg-dark-card/95 text-dark-text-primary border-white/10',
    accent: 'from-brand-500/70 to-brand-400/40',
  },
  success: {
    container: 'bg-emerald-600/15 text-emerald-50 border-emerald-400/30',
    accent: 'from-emerald-400/80 to-emerald-300/40',
  },
  warning: {
    container: 'bg-amber-600/15 text-amber-50 border-amber-400/30',
    accent: 'from-amber-400/80 to-amber-300/40',
  },
  error: {
    container: 'bg-rose-600/15 text-rose-50 border-rose-400/30',
    accent: 'from-rose-500/80 to-rose-400/40',
  },
}

export function Toast({
  title,
  description,
  icon,
  action,
  tone = 'info',
  onDismiss,
  dismissLabel = 'Cerrar notificación',
}: ToastProps) {
  const toneClasses = TONE_STYLES[tone]

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto relative flex w-full min-w-[280px] max-w-sm items-start gap-4 overflow-hidden rounded-2xl border px-5 py-4 text-sm shadow-[0_20px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl transition` +
        ` ${toneClasses.container}`}
    >
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${toneClasses.accent}`}
      />
      {icon && (
        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/90">
          {icon}
        </div>
      )}
      <div className="flex-1 space-y-1">
        {title && <p className="font-semibold tracking-tight">{title}</p>}
        {description && <p className="text-[13px] leading-relaxed opacity-80">{description}</p>}
        {action}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-1 mt-1 rounded-full p-1 text-current transition hover:bg-white/10"
          aria-label={dismissLabel}
        >
          <X className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      )}
    </div>
  )
}
