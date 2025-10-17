import { Loader2 } from 'lucide-react'
import { useNavigationStore } from '@store/navigationStore'

export const LoadingIndicator = () => {
  const isLoading = useNavigationStore((state) => state.isLoading)

  if (!isLoading) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-full p-3 shadow-lg">
        <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
      </div>
    </div>
  )
}
