import { useToastContext } from '@/app/providers/useToastHook'

export function useToast() {
  const toastContext = useToastContext()

  return {
    pushToast: toastContext.pushToast,
    dismissToast: toastContext.dismissToast,
    clearToasts: toastContext.clearToasts,
  }
}
