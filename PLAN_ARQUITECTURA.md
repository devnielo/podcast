# Plan Arquitectónico - Aplicación de Podcasts en React

## 1. Visión General

Desarrollo de una Single Page Application (SPA) para consumo de podcasts musicales siguiendo principios de arquitectura senior, con énfasis en mantenibilidad, escalabilidad y calidad de código.

**Stack Tecnológico:**
- React 19+ con TypeScript
- Vite (build tool moderno)
- React Router v7 (routing sin hash)
- TanStack Query (gestión de datos y caché)
- Zustand (state management ligero)
- TailwindCSS + Shadcn/ui (UI components)
- Docker + Make (orquestación)
- Conventional Commits

---

## 2. Principios de Arquitectura Aplicados

### 2.1 SOLID

#### S - Single Responsibility Principle
- **Componentes**: Cada componente tiene una única responsabilidad
  - `PodcastCard.tsx` → Renderizar tarjeta de podcast
  - `PodcastFilter.tsx` → Gestionar filtrado
  - `AudioPlayer.tsx` → Reproducción de audio
  
- **Servicios**: Separación clara de responsabilidades
  - `podcastService.ts` → Lógica de podcasts
  - `episodeService.ts` → Lógica de episodios
  - `cacheService.ts` → Gestión de caché

#### O - Open/Closed Principle
- Componentes abiertos a extensión, cerrados a modificación
- Uso de composición y props para personalización
- Interfaces genéricas para servicios

#### L - Liskov Substitution Principle
- Implementación de interfaces consistentes
- Servicios intercambiables (mock services para testing)

#### I - Interface Segregation Principle
- Interfaces pequeñas y específicas
- Evitar interfaces "fat" con métodos innecesarios

#### D - Dependency Inversion Principle
- Inyección de dependencias mediante contexto de React
- Servicios desacoplados de componentes

### 2.2 DRY (Don't Repeat Yourself)
- **Custom Hooks**: Lógica reutilizable
  - `usePodcasts()` → Obtener y cachear podcasts
  - `useEpisodes()` → Obtener y cachear episodios
  - `useNavigation()` → Indicador de carga global
  
- **Utilidades compartidas**: Funciones comunes
  - `formatters.ts` → Formateo de fechas, duraciones
  - `validators.ts` → Validaciones
  - `constants.ts` → Valores constantes

### 2.3 KISS (Keep It Simple, Stupid)
- Evitar over-engineering
- Soluciones directas y claras
- Código legible antes que "clever"

### 2.4 Principios Adicionales

#### YAGNI (You Aren't Gonna Need It)
- Solo implementar lo requerido
- Evitar features "por si acaso"

#### Separation of Concerns
- Lógica de negocio separada de UI
- Servicios independientes de componentes

#### Composition over Inheritance
- Componentes funcionales con hooks
- Composición de componentes pequeños

---

## 3. Estructura de Carpetas

```
podcast-app/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── LoadingIndicator.tsx
│   │   │   └── Navigation.tsx
│   │   ├── podcast/
│   │   │   ├── PodcastCard.tsx
│   │   │   ├── PodcastList.tsx
│   │   │   ├── PodcastFilter.tsx
│   │   │   └── PodcastSidebar.tsx
│   │   ├── episode/
│   │   │   ├── EpisodeList.tsx
│   │   │   ├── EpisodeItem.tsx
│   │   │   └── AudioPlayer.tsx
│   │   └── layout/
│   │       └── MainLayout.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── PodcastDetailPage.tsx
│   │   └── EpisodeDetailPage.tsx
│   ├── services/
│   │   ├── api/
│   │   │   ├── podcastApi.ts
│   │   │   ├── episodeApi.ts
│   │   │   └── httpClient.ts
│   │   ├── cache/
│   │   │   ├── cacheService.ts
│   │   │   └── storageService.ts
│   │   └── index.ts
│   ├── hooks/
│   │   ├── usePodcasts.ts
│   │   ├── useEpisodes.ts
│   │   ├── useNavigation.ts
│   │   └── useDebounce.ts
│   ├── store/
│   │   ├── navigationStore.ts
│   │   └── filterStore.ts
│   ├── types/
│   │   ├── podcast.ts
│   │   ├── episode.ts
│   │   └── api.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   └── errorHandler.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── Dockerfile
├── Makefile
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## 4. Patrones de Diseño

### 4.1 Custom Hooks Pattern
```typescript
// Encapsular lógica de datos
const usePodcasts = () => {
  // Gestión de caché automática
  // Manejo de errores
  // Loading states
}
```

### 4.2 Compound Components Pattern
```typescript
// Componentes que trabajan juntos
<PodcastDetail>
  <PodcastDetail.Sidebar />
  <PodcastDetail.Content />
</PodcastDetail>
```

### 4.3 Container/Presentational Pattern
- **Containers**: Lógica, datos, estado
- **Presentational**: Solo UI, props-driven

### 4.4 Service Layer Pattern
- Servicios centralizados para API calls
- Fácil de testear y mockear

---

## 5. Gestión de Estado

### 5.1 TanStack Query (React Query)
**Responsabilidades:**
- Caché de datos del servidor
- Sincronización automática
- Manejo de loading/error states
- Revalidación inteligente

**Configuración:**
```typescript
// Cache de 24 horas para podcasts
// Cache de 24 horas para episodios
// Revalidación on window focus
```

### 5.2 Zustand
**Responsabilidades:**
- Estado de UI local (filtros, navegación)
- Indicador de carga global
- Estado de reproducción (opcional)

**Ventajas:**
- Ligero y simple
- Sin boilerplate
- Fácil de testear

---

## 6. Gestión de Caché

### 6.1 Estrategia de Caché

**Podcasts (100 populares):**
- TTL: 24 horas
- Storage: localStorage + memoria
- Revalidación: Manual o por TTL

**Episodios (por podcast):**
- TTL: 24 horas
- Storage: localStorage + memoria
- Key: `episodes_${podcastId}`

### 6.2 Implementación
```typescript
// cacheService.ts
- setCache(key, value, ttl)
- getCache(key)
- isExpired(key)
- clearCache(key)
- clearAllCache()
```

---

## 7. Routing (Sin Hash)

### 7.1 Configuración React Router v7
```typescript
// Usar createBrowserRouter
// Configurar basename si es necesario
// Rutas limpias: /podcast/123, /podcast/123/episode/456
```

### 7.2 Rutas

| Ruta | Componente | Responsabilidad |
|------|-----------|-----------------|
| `/` | HomePage | Listado de podcasts |
| `/podcast/:podcastId` | PodcastDetailPage | Detalle podcast + episodios |
| `/podcast/:podcastId/episode/:episodeId` | EpisodeDetailPage | Detalle episodio + player |

---

## 8. Indicador de Carga Global

### 8.1 Implementación
```typescript
// navigationStore.ts (Zustand)
- isLoading: boolean
- setLoading(boolean)

// useNavigation hook
- Detectar cambios de ruta
- Mostrar/ocultar indicador
- Desaparecer tras completar transición
```

### 8.2 Ubicación
- Esquina superior derecha
- Spinner o progress bar
- Animación suave

---

## 9. Filtrado de Podcasts

### 9.1 Características
- Búsqueda en tiempo real (debounced)
- Filtra por título y autor
- Reactividad inmediata

### 9.2 Implementación
```typescript
// useDebounce hook
- Delay: 300ms
- Evita re-renders excesivos

// filterStore (Zustand)
- searchTerm: string
- setSearchTerm(string)

// Lógica de filtrado en componente
- Usar useMemo para optimización
```

---

## 10. Reproducción de Audio

### 10.1 Requisitos
- Reproductor HTML5 nativo
- Controles básicos: play, pause, progress
- Mostrar duración y tiempo actual

### 10.2 Consideraciones
- HTML en descripciones debe interpretarse
- Usar `dangerouslySetInnerHTML` con sanitización
- Manejo de errores de reproducción

---

## 11. Gestión de Errores

### 11.1 Estrategia
- Errores en consola (como especifica el requisito)
- No mostrar UI de error
- Logging en consola con contexto

### 11.2 Implementación
```typescript
// errorHandler.ts
- logError(error, context)
- Incluir stack trace
- Información de contexto
```

---

## 12. Optimizaciones de Performance

### 12.1 Code Splitting
- Lazy loading de páginas con React.lazy
- Suspense boundaries

### 12.2 Memoización
- React.memo para componentes puros
- useMemo para cálculos costosos
- useCallback para funciones en props

### 12.3 Vite Optimizations
- Tree-shaking automático
- Minificación en producción
- Concatenación de assets

---

## 13. Desarrollo vs Producción

### 13.1 Configuración Vite

**Development:**
```bash
make dev
# Assets sin minimizar
# Source maps habilitados
# HMR activo
```

**Production:**
```bash
make build
# Assets minimizados
# Concatenados
# Optimizados
```

### 13.2 Variables de Entorno
```
VITE_API_BASE_URL=...
VITE_CORS_PROXY=...
VITE_ENV=development|production
```

---

## 14. Testing

### 14.1 Estrategia
- **Unit Tests**: Servicios, utilidades, hooks
- **Integration Tests**: Flujos de usuario
- **E2E Tests**: Casos críticos

### 14.2 Stack
- Vitest (unit/integration)
- React Testing Library
- Playwright (E2E)

---

## 15. CI/CD y Versionado

### 15.1 Conventional Commits
```
feat: agregar filtro de podcasts
fix: corregir caché de episodios
refactor: simplificar componente PodcastCard
docs: actualizar README
test: agregar tests para cacheService
chore: actualizar dependencias
```

### 15.2 Git Tags
```bash
git tag -a v0.1.0 -m "MVP: Vista principal"
git tag -a v0.2.0 -m "Detalle de podcast"
git tag -a v0.3.0 -m "Detalle de episodio"
git tag -a v1.0.0 -m "Release inicial"
```

---

## 16. Docker

### 16.1 Dockerfile
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### 16.2 Makefile
```makefile
.PHONY: dev build start docker-build docker-run clean

dev:
	npm run dev

build:
	npm run build

start:
	npm run preview

docker-build:
	docker build -t podcast-app .

docker-run:
	docker run -p 3000:3000 podcast-app

clean:
	rm -rf node_modules dist
```

---

## 17. Dependencias Principales

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0",
    "axios": "^1.6.0",
    "tailwindcss": "^3.4.0",
    "lucide-react": "^0.344.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.0"
  }
}
```

---

## 18. Checklist de Implementación

- [ ] **Fase 1: Setup**
  - [ ] Inicializar proyecto Vite + React + TypeScript
  - [ ] Configurar React Router
  - [ ] Setup TailwindCSS + Shadcn/ui
  - [ ] Configurar TanStack Query
  - [ ] Setup Zustand

- [ ] **Fase 2: Servicios Base**
  - [ ] httpClient con CORS proxy
  - [ ] podcastApi service
  - [ ] cacheService
  - [ ] Tipos TypeScript

- [ ] **Fase 3: Vista Principal**
  - [ ] Componente HomePage
  - [ ] PodcastList y PodcastCard
  - [ ] PodcastFilter con debounce
  - [ ] Caché de 24 horas
  - [ ] Tag: v0.1.0

- [ ] **Fase 4: Detalle Podcast**
  - [ ] PodcastDetailPage
  - [ ] PodcastSidebar
  - [ ] EpisodeList
  - [ ] episodeApi service
  - [ ] Caché de episodios
  - [ ] Tag: v0.2.0

- [ ] **Fase 5: Detalle Episodio**
  - [ ] EpisodeDetailPage
  - [ ] AudioPlayer HTML5
  - [ ] Renderizado de HTML en descripción
  - [ ] Navegación entre vistas
  - [ ] Tag: v0.3.0

- [ ] **Fase 6: Indicador de Carga**
  - [ ] LoadingIndicator component
  - [ ] navigationStore
  - [ ] useNavigation hook
  - [ ] Integración en rutas

- [ ] **Fase 7: Pulido**
  - [ ] Optimizaciones de performance
  - [ ] Error handling
  - [ ] Testing
  - [ ] Docker setup
  - [ ] README completo
  - [ ] Tag: v1.0.0

---

## 19. Buenas Prácticas a Seguir

### 19.1 Código
- TypeScript strict mode
- Linting con ESLint
- Formatting con Prettier
- Pre-commit hooks (husky)

### 19.2 Componentes
- Nombres descriptivos
- Props bien tipadas
- Documentación JSDoc
- Componentes pequeños y enfocados

### 19.3 Performance
- Lazy loading de rutas
- Memoización estratégica
- Evitar renders innecesarios
- Optimizar bundle size

### 19.4 Mantenibilidad
- Código autodocumentado
- Funciones puras
- Evitar side effects
- Tests significativos

---

## 20. Recursos y Referencias

- **React**: https://react.dev
- **React Router**: https://reactrouter.com
- **TanStack Query**: https://tanstack.com/query
- **Zustand**: https://github.com/pmndrs/zustand
- **Vite**: https://vitejs.dev
- **Conventional Commits**: https://www.conventionalcommits.org
- **SOLID Principles**: https://en.wikipedia.org/wiki/SOLID
- **Apple Podcasts API**: https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json

---

## 21. Notas Finales

Este plan proporciona una arquitectura robusta, escalable y mantenible para la aplicación de podcasts. Cada decisión está justificada por principios de ingeniería senior y buenas prácticas de la industria.

**Puntos clave:**
- Separación clara de responsabilidades
- Código reutilizable y DRY
- Fácil de testear y mantener
- Performance optimizada
- Escalable para futuras features

**Próximos pasos:**
1. Crear repositorio en GitHub/Bitbucket
2. Inicializar proyecto con Vite
3. Seguir el checklist de implementación
4. Hacer commits con Conventional Commits
5. Crear tags en puntos relevantes
6. Documentar en README
