import { createContext } from 'react'

export type ToastTone = 'success' | 'error' | 'info' | 'warning'

export interface ToastOptions {
  title: string
  description?: string
  tone?: ToastTone
  icon?: React.ReactNode
  duration?: number
}

export interface ToastContextValue {
  pushToast: (options: ToastOptions) => string
  dismissToast: (id: string) => void
  clearToasts: () => void
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined)
