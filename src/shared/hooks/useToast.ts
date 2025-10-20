import { useToastContext } from '@/app/providers/ToastProvider'

export function useToast() {
  const toastContext = useToastContext()

  return {
    pushToast: toastContext.pushToast,
    dismissToast: toastContext.dismissToast,
    clearToasts: toastContext.clearToasts,
  }
}
