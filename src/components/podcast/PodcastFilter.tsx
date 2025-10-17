import { Search } from 'lucide-react'
import { useFilterStore } from '@store/filterStore'
import { DEBOUNCE_DELAY } from '@utils'

export const PodcastFilter = () => {
  const { searchTerm, setSearchTerm } = useFilterStore()

  return (
    <div className="mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar por título o autor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
      </div>
      {searchTerm && (
        <p className="text-sm text-gray-600 mt-2">
          Mostrando resultados para: <span className="font-semibold">{searchTerm}</span>
        </p>
      )}
    </div>
  )
}
