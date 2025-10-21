# Test Suite – Podcast App

## Overview

This test suite provides comprehensive coverage for the podcast application, following production-grade standards with **Vitest**, **React Testing Library**, and **MSW** (Mock Service Worker).

## Structure

```
tests/
├── setup.ts                      # Global test setup (MSW, mocks, cleanup)
├── mocks/
│   └── server.ts                 # MSW server with iTunes API mocks
├── unit/
│   ├── entities/podcast/
│   │   └── mappers.test.ts       # Podcast mapper normalization tests
│   ├── shared/
│   │   ├── api/
│   │   │   └── fetcher.test.ts   # HTTP fetcher and proxy logic
│   │   └── utils/
│   │       └── dates.test.ts     # Duration formatting utilities
│   └── features/podcasts/
│       └── hooks.test.ts         # React Query hooks
├── components/
│   ├── EpisodesTable.test.tsx    # Episodes table rendering and interactions
│   └── PodcastSidebar.test.tsx   # Sidebar component and links
└── integration/
    ├── HomePage.test.tsx         # Top 100, filtering, URL persistence
    ├── PodcastDetailPage.test.tsx # Podcast detail and episodes
    └── EpisodeDetailPage.test.tsx # Episode detail and audio player
```

## Test Categories

### Unit Tests
- **Mappers** (`mappers.test.ts`): iTunes API response normalization
- **Fetcher** (`fetcher.test.ts`): CORS proxy logic, retry mechanisms
- **Utils** (`dates.test.ts`): Duration formatting, date handling
- **Hooks** (`hooks.test.ts`): React Query caching and data fetching

### Component Tests
- **EpisodesTable**: Table rendering, date/duration formatting, links
- **PodcastSidebar**: Image, title, author, description, navigation links

### Integration Tests
- **HomePage**: Top 100 loading, filtering, URL persistence, keyboard navigation
- **PodcastDetailPage**: Podcast metadata, episodes table, error states
- **EpisodeDetailPage**: Episode details, HTML sanitization, audio player

## Running Tests

### Development (Watch Mode)
```bash
npm run test
```

### Single Run (CI/CD)
```bash
npm run test:run
```

### Coverage Report
```bash
npm run test:coverage
```

### UI Dashboard
```bash
npm run test:ui
```

## Key Testing Patterns

### 1. MSW Mocking
All HTTP requests are intercepted by MSW server in `tests/mocks/server.ts`. No real API calls are made during tests.

```typescript
// Example: Mocking iTunes Top 100
http.get(ITUNES_TOP_URL, () => {
  return HttpResponse.json({ feed: { entry: [...] } })
})
```

### 2. React Query Integration
Tests wrap components with `QueryClientProvider` to test data fetching hooks.

```typescript
function renderWithProviders(component: ReactElement) {
  const queryClient = createQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  )
}
```

### 3. Router Testing
Components that use `useParams()` are tested within `BrowserRouter` and `Routes`.

```typescript
<BrowserRouter>
  <Routes>
    <Route path="/podcast/:podcastId" element={<PodcastDetailPage />} />
  </Routes>
</BrowserRouter>
```

### 4. Async Waiters
Tests use `waitFor()` to handle async state updates.

```typescript
await waitFor(() => {
  expect(screen.getByText('Episode 1')).toBeInTheDocument()
})
```

## Coverage Goals

| Category | Target | Status |
|----------|--------|--------|
| Unit Tests | >90% | ✅ |
| Component Tests | >85% | ✅ |
| Integration Tests | >80% | ✅ |
| Overall | >85% | ✅ |

## Best Practices Applied

1. **Isolation**: Each test is independent; no shared state between tests.
2. **Cleanup**: `afterEach()` cleans up DOM and MSW handlers.
3. **Accessibility**: Tests use semantic queries (`getByRole`, `getByLabelText`).
4. **User-Centric**: Tests simulate real user interactions (typing, clicking, keyboard navigation).
5. **Descriptive Names**: Test names clearly describe what is being tested.
6. **Arrange-Act-Assert**: Clear structure in each test.

## Debugging Tests

### View Test UI
```bash
npm run test:ui
```

### Run Single Test File
```bash
npm run test -- tests/components/EpisodesTable.test.tsx
```

### Run Tests Matching Pattern
```bash
npm run test -- --grep "should format duration"
```

### Debug in Browser
```bash
npm run test -- --inspect-brk
```

## CI/CD Integration

Add to your CI pipeline:
```bash
npm run typecheck
npm run lint
npm run test:run
npm run test:coverage
npm run build
```

## Maintenance

- Update mocks in `tests/mocks/server.ts` when API responses change.
- Add tests for new features before merging to main.
- Keep test coverage above 85%.
- Review coverage reports regularly.

---

**Last Updated**: Oct 20, 2025
