import { create } from 'zustand'

interface NavigationState {
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  isLoading: false,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}))
