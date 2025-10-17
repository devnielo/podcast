# Podcast App

Aplicación web moderna para descubrir y escuchar podcasts musicales. Desarrollada con React 19, Vite y TailwindCSS.

## Características

- **Top 100 Podcasts**: Acceso a los podcasts más populares de Apple
- **Búsqueda en Tiempo Real**: Filtra podcasts por título o autor
- **Reproductor de Audio**: Reproductor HTML5 nativo integrado
- **Caché Inteligente**: Los datos se cachean por 24 horas
- **SPA sin Hash**: Navegación limpia sin URLs con hash
- **Diseño Responsivo**: Interfaz moderna con TailwindCSS

## Requisitos Previos

- Node.js 20+
- pnpm 8+

## Instalación

```bash
make install
# o
pnpm install
```

## Desarrollo

```bash
make dev
# o
pnpm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:5173`

## Producción

### Build

```bash
make build
# o
pnpm run build
```

### Preview

```bash
make start
# o
pnpm run preview
```

## Docker

### Build de la imagen

```bash
make docker-build
```

### Ejecutar contenedor

```bash
make docker-run
```

La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
src/
├── components/
│   ├── common/          # Componentes compartidos
│   ├── layout/          # Layouts
│   ├── podcast/         # Componentes de podcast
│   └── episode/         # Componentes de episodio
├── pages/               # Páginas principales
├── services/            # Servicios de API y caché
├── hooks/               # Custom hooks
├── store/               # Estado global (Zustand)
├── types/               # Tipos TypeScript
├── utils/               # Utilidades
├── App.tsx              # Componente raíz
├── routes.tsx           # Configuración de rutas
└── main.tsx             # Punto de entrada
```

## Rutas

- `/` - Página principal con listado de podcasts
- `/podcast/:podcastId` - Detalle del podcast y episodios
- `/podcast/:podcastId/episode/:episodeId` - Detalle del episodio con reproductor

## Tecnologías

- **React 19** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool moderno
- **React Router v7** - Enrutamiento SPA
- **TanStack Query** - Gestión de datos y caché
- **Zustand** - State management
- **TailwindCSS** - Estilos
- **Lucide React** - Iconos
- **Axios** - Cliente HTTP

## Principios de Arquitectura

- **SOLID** - Principios de diseño orientado a objetos
- **DRY** - Don't Repeat Yourself
- **KISS** - Keep It Simple, Stupid
- **Separation of Concerns** - Separación de responsabilidades
- **Composition over Inheritance** - Composición sobre herencia

## Versionado

Este proyecto sigue [Conventional Commits](https://www.conventionalcommits.org/)

## Licencia

MIT
