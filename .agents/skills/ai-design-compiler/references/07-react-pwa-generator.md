# 07 — React PWA Generator (Reference Runtime + MVP)

**Purpose**: the first **interactive** runtime. Validates business logic before committing to RN / Cocos / Godot / Unity / Flutter.

## Why React PWA First
- Reuses the HTML reference (same CSS primitives).
- Fastest path to validate: gameplay, interactions, data flow, routing, state.
- Cheap to throw away if the design needs to change.

## Responsibilities
| Layer | Tech |
|-------|------|
| UI | React components, generated from layout IR |
| Data | Mock API (or real backend if available) |
| Logic | Game / business logic |
| Routing | SPA router |
| State | Zustand / Redux / Context |
| Asset binding | `asset_manifest.json` |
| Layout binding | `layout.json` (consumed by a `LayoutRenderer`) |

## Architecture
```
layout.json + asset_manifest.json + theme.json
        │
        ▼
   <LayoutRenderer> (interprets the IR at runtime)
        │
        ▼
   React component tree (presentational only)
        │
        ▼
   Business hooks / services (logic, data, state)
```

Presentational components stay **stateless** — no `window`, `document`, `useEffect` for data fetching. Side effects live in hooks/services. (Project rule.)

## Output
```
src/runtime/LayoutRenderer.tsx
src/runtime/AssetBindings.ts
src/components/...      (generated from IR)
src/hooks/...           (business logic)
src/state/...           (app state)
```

## Definition of Done
- Visual parity with `preview.html` on phone + tablet + desktop.
- All flows in `page-map.md` are interactive (not just static screens).
- No raw coordinates, no hardcoded colors, no hardcoded text (i18n).
