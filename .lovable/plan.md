

# Migration: React Router to TanStack Router

## Overview

Replace `react-router-dom` with `@tanstack/react-router` across all 36 files that currently import from React Router. This gives us file-based route definitions, type-safe navigation, built-in loader support for future SSR/data-fetching, and eliminates the need for the `LanguageRouter` + `RouteHandler` wrapper pattern.

---

## Phase 1: Install and Create Route Tree

### 1.1 Install dependencies
- `@tanstack/react-router`
- `@tanstack/react-router-devtools` (dev only, optional)
- Remove `react-router-dom` after migration is complete

### 1.2 Create root route

**New file: `src/routes/__root.tsx`**

The root route replaces the current `App.tsx` shell. It will contain:
- All providers (HelmetProvider, QueryClientProvider, AuthProvider, TooltipProvider)
- Global SEO components (SearchConsoleVerification, CriticalResourceOptimizer, StructuredData)
- Analytics (lazy-loaded GoogleAnalytics, MicrosoftClarity, Adsense)
- Toaster, PWAInstallPrompt, AuthDebugPanel
- Language sync logic (currently in LanguageRouter) moved into the root route's `beforeLoad` or a layout effect
- `<Outlet />` for child routes

### 1.3 Create route definitions

**New file: `src/routes/index.tsx`** -- Landing page (zh default)
**New file: `src/routes/about.tsx`**
**New file: `src/routes/faq.tsx`**
**New file: `src/routes/method369.tsx`**
**New file: `src/routes/privacy.tsx`**
**New file: `src/routes/terms.tsx`**
**New file: `src/routes/blog/index.tsx`** -- Blog list
**New file: `src/routes/blog/$slug.tsx`** -- Blog post (uses `$slug` param)
**New file: `src/routes/user-stories.tsx`**
**New file: `src/routes/auth.tsx`**
**New file: `src/routes/en/index.tsx`** -- English landing
**New file: `src/routes/en/about.tsx`**
**New file: `src/routes/en/faq.tsx`**
**New file: `src/routes/en/method369.tsx`**
**New file: `src/routes/en/privacy.tsx`**
**New file: `src/routes/en/terms.tsx`**
**New file: `src/routes/en/blog/index.tsx`**
**New file: `src/routes/en/blog/$slug.tsx`**
**New file: `src/routes/en/user-stories.tsx`**
**New file: `src/routes/app/index.tsx`** -- Redirect to /app/home
**New file: `src/routes/app/$tab.tsx`** -- Protected, renders Index
**New file: `src/routes/blog-admin.tsx`** -- Protected
**New file: `src/routes/admin-stats.tsx`** -- Protected
**New file: `src/routes/$.tsx`** -- Catch-all 404 (replaces `path="*"`)

### 1.4 Create router instance

**New file: `src/router.tsx`**

```text
import { createRouter, createRootRoute } from '@tanstack/react-router'
import { rootRoute } from './routes/__root'
import { routeTree } from './routeTree.gen' // or manually assembled

export const router = createRouter({ routeTree })

// Type-safety declaration
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
```

### 1.5 Update `src/main.tsx`

Replace `<App />` with `<RouterProvider router={router} />`. Keep hydration logic.

### 1.6 Refactor `src/App.tsx`

Remove BrowserRouter, Routes, Route, Navigate. The App component either becomes minimal (just calling RouterProvider) or is removed entirely, with providers moved into `__root.tsx`.

---

## Phase 2: Replace React Router APIs (36 files)

### 2.1 Link component replacement

**21 files** use `<Link>` from `react-router-dom`. Replace with TanStack Router's `<Link>`:

```text
// Before
import { Link } from 'react-router-dom';
<Link to="/about">About</Link>

// After
import { Link } from '@tanstack/react-router';
<Link to="/about">About</Link>
```

Or create a `LangLink` wrapper that applies `addLanguagePrefix` automatically for marketing pages.

**Affected files:**
- src/pages/Landing.tsx
- src/pages/About.tsx
- src/pages/FAQ.tsx
- src/pages/Method369.tsx
- src/pages/Privacy.tsx
- src/pages/Terms.tsx
- src/pages/BlogPost.tsx
- src/pages/UserStories.tsx
- src/pages/Auth.tsx
- src/pages/NotFound.tsx
- src/components/landing/OptimizedHeader.tsx
- src/components/landing/OptimizedFooter.tsx
- src/components/landing/HeroOptimized.tsx
- src/components/landing/ConversionOptimizedCTA.tsx
- src/components/landing/SocialProofSection.tsx
- src/components/landing/AboutFounderOptimized.tsx
- src/components/seo/InternalLinks.tsx
- src/components/seo/EnhancedInternalLinks.tsx
- src/components/navigation/Breadcrumbs.tsx
- src/components/auth/ProtectedRoute.tsx
- src/components/blog/BlogManagement.tsx

### 2.2 useNavigate replacement

**9 files** use `useNavigate`. Replace with TanStack Router's `useNavigate`:

```text
// Before
const navigate = useNavigate();
navigate('/app/practice');

// After
const navigate = useNavigate();
navigate({ to: '/app/practice' });
```

**Affected files:**
- src/pages/Index.tsx
- src/pages/Auth.tsx
- src/pages/AdminStats.tsx
- src/components/home/QuickActions.tsx
- src/components/wishes/WishCard.tsx
- src/components/i18n/LanguageSwitcher.tsx
- src/components/routing/RouteHandler.tsx
- src/components/seo/RedirectHandler.tsx
- src/components/admin/AdminFloatingButton.tsx (uses Link, not navigate directly)

### 2.3 useLocation replacement

**11 files** use `useLocation`. Replace with TanStack Router's `useLocation` (returns `{ pathname, search, hash }`):

**Affected files:**
- src/components/seo/UnifiedSEO.tsx
- src/components/seo/ComprehensiveSEO.tsx
- src/components/seo/MultiLanguageSEO.tsx
- src/components/seo/SEOHead.tsx
- src/components/seo/AdvancedSEO.tsx
- src/components/seo/SocialMediaCards.tsx
- src/components/seo/RedirectHandler.tsx
- src/components/routing/LanguageRouter.tsx
- src/components/routing/RouteHandler.tsx
- src/components/navigation/Breadcrumbs.tsx
- src/components/performance/PageLoadMonitor.tsx
- src/pages/NotFound.tsx

### 2.4 useParams replacement

**2 files** use `useParams`:

- `src/pages/Index.tsx` -- `useParams<{ tab: string }>()` becomes `useParams({ from: '/app/$tab' })`
- `src/pages/BlogPost.tsx` -- `useParams<{ slug: string }>()` becomes `useParams({ from: '/blog/$slug' })`

### 2.5 useSearchParams replacement

**2 files** use `useSearchParams`:

- `src/pages/Auth.tsx` -- Move `redirect` search param to route's `validateSearch`; read with `useSearch({ from: '/auth' })`
- `src/components/views/PracticeView.tsx` -- Move `wishId` search param similarly

### 2.6 Navigate component replacement

**2 files** use `<Navigate>`:

- `src/pages/Auth.tsx` -- Replace with `redirect()` in route's `beforeLoad` or `useNavigate` in effect
- `src/components/auth/ProtectedRoute.tsx` -- Replace `<Navigate to={...} />` with TanStack's `redirect()` in `beforeLoad` of protected routes

---

## Phase 3: Structural Refactors

### 3.1 ProtectedRoute pattern

Instead of wrapping components in `<ProtectedRoute>`, use the route's `beforeLoad` function:

```text
// In route definition
export const Route = createFileRoute('/app/$tab')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/auth', search: { redirect: location.pathname } })
    }
  },
  component: Index,
})
```

Pass auth context through `router.context` in the router creation.

### 3.2 LanguageRouter removal

The `LanguageRouter` component syncs URL path language to i18n. This logic moves into the root route's `beforeLoad` or an `onEnter` effect, eliminating the wrapper component.

### 3.3 RouteHandler removal

The `RouteHandler` component handles:
- URL canonicalization (move to root route's `beforeLoad`)
- Google Analytics page tracking (move to `router.subscribe` callback)
- Scroll to top (TanStack Router has built-in `scrollRestoration`)
- Performance monitoring (move to `router.subscribe`)

### 3.4 RedirectHandler simplification

The remaining redirect logic (trailing slash normalization, `/zh` prefix removal) moves to the root route's `beforeLoad` using TanStack's `redirect()`.

### 3.5 LangLink helper

**New file: `src/components/routing/LangLink.tsx`**

A convenience wrapper around TanStack's `Link` that auto-applies language prefix for marketing pages using `addLanguagePrefix` from `src/utils/languageUrl.ts`.

---

## Phase 4: Cleanup

### 4.1 Remove deprecated files
- `src/components/routing/LanguageRouter.tsx` (logic merged into root route)
- `src/components/routing/RouteHandler.tsx` (logic merged into router config)
- `src/components/seo/RedirectHandler.tsx` (logic merged into root route beforeLoad)

### 4.2 Uninstall react-router-dom
- `npm uninstall react-router-dom`
- Remove from package.json

### 4.3 Update main.tsx
- Remove hydration logic if no longer needed, or keep for prerendering compatibility

---

## File Change Summary

| Action | Count | Description |
|--------|-------|-------------|
| **New files** | ~28 | Route definitions + router config + LangLink |
| **Major refactor** | 3 | App.tsx, main.tsx, ProtectedRoute.tsx |
| **Import updates** | 36 | Replace react-router-dom imports |
| **Delete** | 3 | LanguageRouter, RouteHandler, RedirectHandler |

---

## Risk Mitigation

1. **Prerendering compatibility**: The prerender system (`scripts/prerender.mjs`) uses Puppeteer and navigates to routes. TanStack Router is client-side, so prerendering should still work as before since it renders the full app.

2. **SEO components**: Multiple SEO components use `useLocation()`. TanStack Router's `useLocation()` returns a similar shape (`{ pathname, search, hash }`), so the migration is straightforward.

3. **i18n URL sync**: The current `LanguageRouter` pattern is a simple useEffect. Moving it to the root route's layout effect preserves the same behavior.

4. **Auth redirect flow**: The `?redirect=` pattern used in `ProtectedRoute` and `Auth.tsx` maps cleanly to TanStack Router's `search` params with `validateSearch`.

---

## Execution Order

1. Install `@tanstack/react-router`
2. Create route tree (all route files)
3. Create router instance with context (auth)
4. Update `main.tsx` to use `RouterProvider`
5. Migrate all 36 files' imports (Link, useNavigate, useLocation, useParams, useSearchParams, Navigate)
6. Move LanguageRouter/RouteHandler/RedirectHandler logic into route config
7. Delete deprecated wrapper components
8. Uninstall `react-router-dom`
9. Test all routes (marketing pages, /en/* pages, /app/* protected routes, /auth, /blog/:slug, 404)

