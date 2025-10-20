# 🎙️ Podcast Player - ZARA Front-End Test

Single Page Application (SPA) para escuchar podcasts musicales. Aplicación desarrollada con React, TypeScript, Vite y TailwindCSS.

## Requisitos Cumplidos

**3 Vistas Implementadas:**
- Vista principal: Top 100 podcasts con filtro reactivo
- Detalle de podcast: Sidebar + lista de episodios
- Detalle de episodio: Reproductor HTML5 nativo + descripción sanitizada

**Características Técnicas:**
- URLs limpias (sin hash #)
- SPA con navegación en cliente
- Caché local 24h con React Query
- Assets sin minificar en development
- Assets minificados en production
- Indicador visual de navegación en esquina superior derecha
- HTML sanitizado con DOMPurify
- Tema oscuro inspirado en Spotify

---

## Instalación

### Requisitos Previos
- Node.js 18+ 
- npm o yarn
- Git
- Docker (opcional, para despliegue en contenedor)

### Pasos de Instalación

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd podcast

# 2. Instalar dependencias
npm install
```

---

## Modo Development Recomendado

**Assets sin minificar, con Hot Module Replacement (HMR)**

```bash
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:5173`

**Características:**
- Recarga en caliente (HMR)
- Source maps para debugging
- Assets sin minificar (legibles en DevTools)
- Logs detallados en consola
- Validación de tipos en tiempo real

---

## Modo Production

**Assets concatenados y minificados**

### Build

```bash
npm run build
```

Esto genera:
- Archivos minificados en `dist/`
- Assets optimizados y concatenados
- Source maps opcionales

### Servir Localmente

```bash
npm run preview
```

La aplicación estará disponible en `http://localhost:4173`

---

## Docker (Producción)

### Con docker-compose (Recomendado)

```bash
docker-compose up --build
```

### O manualmente

```bash
docker build -t podcast-web:latest .
docker run --rm -p 4173:4173 podcast-web:latest
```

La aplicación estará disponible en `http://localhost:4173`

### Características Docker
- Node.js 24 (compatible con Vite)
- Build con `npm install` + `npm run build`
- Ejecuta `npm run preview --host` para servir assets
- Accesible desde host con `--host`
- Imagen optimizada (~500MB)
- Perfecto para testing y desarrollo

---

## Scripts npm

```bash
npm run dev          # Modo development con HMR
npm run build        # Build para producción (minificado)
npm run preview      # Preview local de la build
npm run lint         # ESLint + Prettier check
npm run typecheck    # TypeScript type checking
npm run test         # Tests con Vitest
npm run test:ui      # UI dashboard de tests
npm run test:coverage # Reporte de cobertura
```

---

## Arquitectura

```
src/
├── app/
│   ├── layout/          # Layout base y cabecera
│   ├── providers/       # Context providers (React Query, Player, etc.)
│   └── routes/          # Configuración de rutas
├── pages/
│   ├── home/            # Vista principal (Top 100)
│   ├── podcast/         # Detalle de podcast
│   └── episode/         # Detalle de episodio
├── features/
│   └── podcasts/        # Componentes y hooks del dominio
├── entities/
│   ├── podcast/         # Tipos y mappers
│   └── episode/         # Tipos y mappers
├── shared/
│   ├── api/             # Fetcher, adapters, CORS proxy
│   ├── components/      # UI genérica
│   ├── hooks/           # Hooks reutilizables
│   └── utils/           # Helpers
└── index.css            # Estilos globales
```

---

## APIs Utilizadas

- **Top 100 Podcasts:** `https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json`
- **Detalle Podcast:** `https://itunes.apple.com/lookup?id={podcastId}`
- **CORS Proxy:** `https://cors-anywhere.herokuapp.com/`

---

## Caché Local (24h)

La aplicación implementa caché local de 24 horas usando React Query:

- **Top 100 podcasts:** Se cachea la primera solicitud
- **Detalles de podcast:** Se cachea por podcast
- **Episodios:** Se cachea por podcast

Si pasan 24h, la aplicación solicita datos frescos automáticamente.

---

## Tecnologías

- **Framework:** React 18+
- **Lenguaje:** TypeScript (strict mode)
- **Build Tool:** Vite
- **Estilos:** TailwindCSS
- **State Management:** React Query (server state)
- **Routing:** React Router v6+ (URLs limpias)
- **Sanitización:** DOMPurify
- **Iconos:** Lucide Icons
- **Fuente:** Monument Grotesk

---

## Testing

```bash
# Tests unitarios y de componentes
npm run test

# Con UI dashboard
npm run test:ui

# Reporte de cobertura
npm run test:coverage
```

---

## 📝 Commits y Versiones

El proyecto utiliza Conventional Commits y semantic versioning:

- `v0.1.0-init` - Scaffold inicial
- `v0.2.0-home` - Vista principal
- `v0.3.0-podcast-detail` - Detalle de podcast
- `v0.4.0-episode-detail` - Detalle de episodio
- `v0.5.0-sanitization` - Sanitización de HTML
- `v0.6.0+` - Optimizaciones y mejoras

---

## 🔍 Debugging

### En Development

1. Abre DevTools (F12)
2. Ve a la pestaña **Console** para ver logs
3. Usa **Network** para inspeccionar requests
4. **Sources** muestra código sin minificar con source maps

### En Production

- Los errores se muestran en consola del navegador
- No hay logs innecesarios
- Assets minificados para mejor rendimiento

---

## 📄 Licencia

Propiedad de ZARA - Prueba Front-End

---

## 👨‍💻 Autor

Desarrollado como prueba técnica front-end para ZARA
