import { create } from 'zustand'

interface FilterState {
  searchTerm: string
  setSearchTerm: (term: string) => void
  clearSearch: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  searchTerm: '',
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  clearSearch: () => set({ searchTerm: '' }),
}))
