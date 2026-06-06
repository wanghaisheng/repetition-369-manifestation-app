# Shared Utilities

Cross-cutting helpers used by multiple phases.

## asset-reconciliation
```
visual_inventory → asset_manifest → check → validation.json
```
Every inventory id must map to exactly one asset. Unmatched ids = build failure.

## responsive-layout
Single source of truth for: anchor names, constraint vocab, adaptive policies, safe-area handling, scale modes. Every backend (HTML / React / RN / Cocos / Godot / Unity / Flutter) must read its mapping table from this module — do not redefine per-backend.

## imagegen-style-library
Per-domain prompt fragments that lock visual consistency:
- `game-style` (Supercell / Clash / RoK)
- `app-style` (HIG / Material)
- `web-style` (Linear / Vercel)
- `dashboard-style` (TradingView / Notion / Grafana)
- `ppt-style` (Apple / Stripe / McKinsey)

Skill 01 must compose from this library, not invent style language ad hoc.

## provenance-tracker
Every generated artifact records:
```
source · source_region_px · strategy · prompt · prompt_hash · sha256 · imagegen_hash · created_at
```
Enables: regenerate-from-source, drift detection, deterministic rebuilds.
