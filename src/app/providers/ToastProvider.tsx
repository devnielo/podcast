import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode, MouseEvent } from 'react'
import { createPortal } from 'react-dom'

import { Toast } from '@/shared/components/Toast'
import type { ToastTone } from '@/shared/components/Toast'

interface ToastProviderProps {
  children: ReactNode
}

interface ToastAction {
  label: string
  onClick: () => void
}

interface ToastOptions {
  id?: string
  title?: string
  description?: string
  tone?: ToastTone
  icon?: ReactNode
  durationMs?: number
  action?: ToastAction
}

interface ToastEntry extends ToastOptions {
  id: string
}

interface ToastContextValue {
  pushToast: (options: ToastOptions) => string
  dismissToast: (id: string) => void
  clearToasts: () => void
}

const DEFAULT_DURATION = 4000

function generateToastId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastEntry[]>([])
  const timers = useRef<Map<string, number>>(new Map())
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => {
      timers.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId)
      })
      timers.current.clear()
    }
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timeoutId = timers.current.get(id)
    if (timeoutId) {
      window.clearTimeout(timeoutId)
      timers.current.delete(id)
    }
  }, [])

  const clearToasts = useCallback(() => {
    setToasts([])
    timers.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    timers.current.clear()
  }, [])

  const pushToast = useCallback(
    ({ id: providedId, durationMs = DEFAULT_DURATION, ...options }: ToastOptions) => {
      const id = providedId ?? generateToastId()

      setToasts((current) => {
        const next: ToastEntry[] = [...current.filter((toast) => toast.id !== id), { ...options, id }]
        return next
      })

      if (durationMs > 0) {
        const timeoutId = window.setTimeout(() => {
          dismissToast(id)
        }, durationMs)
        timers.current.set(id, timeoutId)
      }

      return id
    },
    [dismissToast],
  )

  const contextValue = useMemo<ToastContextValue>(
    () => ({
      pushToast,
      dismissToast,
      clearToasts,
    }),
    [pushToast, dismissToast, clearToasts],
  )

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {isMounted
        ? createPortal(
            <div className="pointer-events-none fixed inset-x-0 top-6 z-[1000] flex justify-center px-4 sm:justify-end sm:px-6">
              <div className="flex w-full max-w-sm flex-col gap-3 pointer-events-auto">
                {toasts.map((toast) => (
                  <Toast
                    key={toast.id}
                    title={toast.title}
                    description={toast.description}
                    tone={toast.tone}
                    icon={toast.icon}
                    action={
                      toast.action ? (
                        <button
                          type="button"
                          onClick={(event: MouseEvent<HTMLButtonElement>) => {
                            event.stopPropagation()
                            toast.action?.onClick()
                          }}
                          className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/15"
                        >
                          {toast.action.label}
                        </button>
                      ) : undefined
                    }
                    onDismiss={() => dismissToast(toast.id)}
                  />
                ))}
              </div>
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  return context
}
