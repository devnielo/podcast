import { NavLink, Outlet } from 'react-router-dom'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <NavLink to="/" className="text-xl font-semibold text-slate-900">
            Podcast Hub
          </NavLink>

          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${isActive ? 'text-brand-600' : 'hover:text-brand-500 transition-colors'}`
              }
              end
            >
              Home
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}
