import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

import { Header } from '@/app/layout/Header'

interface AppLayoutProps {
  header?: ReactNode
  sidebar?: ReactNode
  player?: ReactNode
  children: ReactNode
}

export function AppLayout({ header, sidebar, player, children }: AppLayoutProps) {
  const location = useLocation()
  
  // Detect if we're on a detail page (podcast or episode)
  const isDetailPage = location.pathname.includes('/podcast/') && 
    (location.pathname.includes('/episode/') || !location.pathname.endsWith('/'))
  
  return (
    <div className="flex h-screen flex-col bg-dark-bg text-dark-text-primary">
      {header ?? <Header />}

      <div className={`mx-auto flex w-full max-w-screen-2xl gap-8 px-6 py-8 ${
        isDetailPage 
          ? 'flex-1 overflow-hidden min-h-0' 
          : 'w-full overflow-y-auto'
      }`}>
        {sidebar && <aside className="w-72 shrink-0 overflow-y-auto">{sidebar}</aside>}

        <main className={`${
          isDetailPage 
            ? 'flex-1 overflow-hidden min-h-0 flex flex-col' 
            : 'w-full'
        }`}>
          <div className={`${
            isDetailPage
              ? 'h-full rounded-3xl border border-dark-border/40 bg-dark-card/60 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] overflow-hidden flex flex-col'
              : ''
          }`}>
            {children}
          </div>
        </main>
      </div>

      {player && <div className="border-t border-dark-border/50 bg-dark-surface/95 px-6 py-5 shrink-0">{player}</div>}
    </div>
  )
}
