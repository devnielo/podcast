import { Link } from 'react-router-dom'
import { Radio } from 'lucide-react'
import { APP_NAME } from '@utils'

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Radio className="w-8 h-8" />
          <h1 className="text-2xl font-bold">{APP_NAME}</h1>
        </Link>
      </div>
    </header>
  )
}
