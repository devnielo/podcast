import { Chrome, Download, Home, LogIn, Search, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import logoUrl from '@/assets/logo.svg'
import { Button } from '@/shared/components/Button'
import { Input } from '@/shared/components/Input'

interface HeaderProps {
  showIndicator?: boolean
}

export function Header({ showIndicator = false }: HeaderProps) {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-dark-border/40 bg-dark-surface/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-8 px-6 py-4">
          <NavLink to="/" className="flex items-center">
            <span className="text-4xl uppercase font-semibold tracking-tight text-dark-text-primary">Podcas</span>
            <img src={logoUrl} alt="Podcaster" className="h-12 w-auto" />
            <span className="text-4xl uppercase font-semibold tracking-tight text-dark-text-primary">er</span>
          </NavLink>

          <div className="flex flex-1 items-center justify-center gap-4">
            <NavLink
              to="/"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-dark-card text-dark-text-primary transition hover:bg-dark-hover"
              aria-label="Inicio"
            >
              <Home className="h-5 w-5" />
            </NavLink>
            <div className="relative w-full max-w-md">
              <Input
                type="search"
                placeholder="¿Qué quieres reproducir?"
                size="lg"
                leftIcon={<Search className="h-4 w-4" strokeWidth={1.5} />}
                className="text-base"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<Download className="h-5 w-5" />}
              className="hidden lg:inline-flex"
              type="button"
            >
              Instalar app
            </Button>

            {showIndicator && (
              <div className="flex items-center gap-2 rounded-full bg-brand-500/10 px-3 py-1.5 text-xs font-medium text-brand-400">
                <span className="flex h-2 w-2 items-center justify-center">
                  <span className="inline-flex h-full w-full animate-ping rounded-full bg-brand-500" />
                </span>
                <span>Cargando</span>
              </div>
            )}

            <Button
              type="button"
              onClick={() => setShowLogin(true)}
              aria-label="Cuenta"
              size="md"
              leftIcon={<LogIn className="h-5 w-5" strokeWidth={1.75} />}
            >
              Iniciar sesión
            </Button>
          </div>
        </div>
      </header>

      {showLogin && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/65 backdrop-blur-md"
          onClick={() => setShowLogin(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-dark-surface/95 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowLogin(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-dark-text-secondary transition hover:bg-white/10 hover:text-dark-text-primary"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>

            <div className="mb-6 space-y-2 text-center">
              <h2 className="text-4xl font-semibold text-white">Inicia sesión en Podcaster</h2>
              <p className="text-base text-white/70">Accede a playlists personalizadas y sincroniza tus podcasts favoritos.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-white/70">Correo electrónico</label>
                <Input
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  size="md"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-white/70">Contraseña</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  size="md"
                />
              </div>
              <div className="flex flex-row gap-2 items-center">
                <Button type="button" variant="primary" size="md">
                  Iniciar sesión
                </Button>
                <Button type="button" variant="secondary" size="md" leftIcon={<Chrome className="h-4 w-4" />}>
                  Continuar con Google
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

