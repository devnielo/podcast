import type { ReactNode } from 'react'

import { Header } from '@/app/layout/Header'

interface AppLayoutProps {
  header?: ReactNode
  sidebar?: ReactNode
  player?: ReactNode
  children: ReactNode
}

export function AppLayout({ header, sidebar, player, children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-dark-bg text-dark-text-primary">
      {header ?? <Header />}

      <div className="mx-auto flex w-full max-w-screen-2xl flex-1 gap-8 px-6 py-8">
        {sidebar && <aside className="w-72 shrink-0">{sidebar}</aside>}

        <main className="flex-1">
          <div className="min-h-full rounded-3xl border border-dark-border/40 bg-dark-card/60 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
            {children}
          </div>
        </main>
      </div>

      {player && <div className="border-t border-dark-border/50 bg-dark-surface/95 px-6 py-5">{player}</div>}
    </div>
  )
}
