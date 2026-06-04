---
name: design-ai-pipeline
description: End-to-end pipeline for turning requirements or screenshots into editable, reusable, engineering-friendly UI — high-fidelity mockups, transparent assets, semantic layout trees, and runtime-generated React/Cocos/PPT output. Trigger when the user asks to "convert a screenshot into editable UI", "extract assets from a design", "build a layout JSON / layout tree", "generate game UI / PPT / dashboard via AI", or wants assets split from a mockup (sprite/asset sheet, transparent PNGs, background removal, generative fill). Do NOT trigger for simple "make me a hero section" requests — this is for structured design→assets→layout→runtime conversions.
---

# Design AI Pipeline

Convert requirements or screenshots into editable artifacts. **Never fake editability with screenshots.** If it can be code → code. If it can be a shape → shape. If it can be cropped → crop. Generate only when nothing else fits.

## Workflow

```text
Requirement → Design Brief → Visual Inventory → High-fi Mockup
   → Object Classification → Asset Extraction → Layout Tree
   → Layout JSON → Runtime Builder (React / Cocos / PPT)
```

## Phase 1 — Requirement → Design

1. **Design brief** (`design-brief.md`): target users, business goals, platform, visual style, interaction priority.
2. **Visual inventory** (`visual-inventory.md`): every object as `id | type` (image / widget / button / text / shape). This is the source of truth for later reconciliation.
3. **Layout zones**: semantic regions (e.g. `Header / Main / CTA / Footer`, or `Top HUD / Center Focus / Bottom Nav`).
4. **Imagen prompt** = `Subject + Layout + Visual Style + Color System + Material + Rendering Constraints`. Always add "asset extraction friendly", "high readability", "professional production quality".
5. **Design QA**: reject mockups that are beautiful but structurally unusable (overlap, unreadable text, no spacing).

Use `imagegen--generate_image` (premium for typography-heavy mockups) for the hi-fi shot.

## Phase 2 — Object Classification

Every visible object belongs to **exactly one** category:

| Category   | Output            | Examples                                |
| ---------- | ----------------- | --------------------------------------- |
| Text       | Native text       | usernames, labels, numbers, button text |
| Shape      | Native primitive  | card, divider, progress bar, container  |
| Asset      | Transparent PNG   | icons, badges, mascots, decorations     |
| Background | Background layer  | photos, scenery, textures, gradients    |

**Never rasterize readable text.**

## Asset Strategy Decision Tree

```text
Object
 ├─ Readable text?         → Native Text
 ├─ Expressible as shape?  → Native Shape
 ├─ Must preserve identity (logo, mascot)? → Source Crop
 └─ otherwise              → Asset Sheet (or Regenerate)
```

Priority order (always prefer the top):

```text
Native Shape → Native Text → Source Crop → Asset Sheet
  → Regenerate Asset → Background Repair
```

### A. Source Crop
Direct crop from the source screenshot. Only when small, no readable text, identity must remain. Record `source_region_px {x,y,w,h}` in provenance. **Forbidden**: whole cards, table rows, buttons-with-text, full profile cards.

### B. Asset Sheet (preferred for generated assets)
1. Build inventory list.
2. Generate one **sparse** sheet via Imagen with pure chroma-key background, large spacing, no overlap, no readable text, consistent style.
3. `imagegen--edit_image` with `transparent_background: true` to remove the chroma.
4. Connected-component split → individual PNGs (one per inventory id).
5. **Reconciliation**: count + naming + semantics must match inventory exactly. Missing assets = failure.
6. Record provenance (`asset_id, strategy, prompt_hash, sha256, created_at`).

### C. Edit Image (generative fill)
Use `imagegen--edit_image` to remove foreground UI and repair the scene behind it. Output: `clean-background.png`.

### D. Regenerate Asset
When source is blurry/low-res: `imagegen--generate_image` with `transparent_background: true`, matching the surrounding style.

### Tool selection in Lovable sandbox

| Task                       | Tool                                              |
| -------------------------- | ------------------------------------------------- |
| Remove white/green bg      | `imagegen--edit_image` + `transparent_background` |
| Background repair / fill   | `imagegen--edit_image`                            |
| Asset regeneration         | `imagegen--generate_image`                        |
| Transparent PNG creation   | `imagegen--generate_image` + `transparent_background` |
| Asset storage              | `lovable-assets` CLI                              |
| Provenance tracking        | `.asset.json` sidecar                             |

## Phase 3 — Layout Tree & JSON

**Layout tree** (`layout-tree.md`): semantic hierarchy, engine-agnostic. Example:

```text
CastleMasterMain
├─ Background
├─ TopHUD
│  ├─ Avatar
│  ├─ CoinBar
│  └─ DiamondBar
├─ Logo
├─ StartButton
└─ BottomNavigation
```

**Layout JSON** (`layout.json`): store only stable info — hierarchy, positions, sizes, anchors, asset ids.

Forbidden in JSON: UUIDs, serialized components, editor metadata, engine internals.

```json
{ "id": "start_button", "asset": "start-button", "position": [0, -280], "anchor": [0.5, 0.5] }
```

## Phase 4 — Runtime Builders

Layout JSON is consumed by engine-specific builders the agent does **not** write directly: `AutoBuildUI.ts`, `UnityUIBuilder.cs`, `ReactRenderer.tsx`, `PPTRenderer.ts`. Runtime owns engine APIs; AI owns the JSON.

## Required Deliverables

```text
design-brief.md
visual-inventory.md
asset-manifest.json
layout-tree.md
layout.json
reconciliation.md
```

Optional engine outputs: `react-layout.json`, `cocos-layout.json`, `unity-layout.json`, `ppt-layout.json`.

## QA Checklist (human review mandatory)

- Inventory complete and reconciled against extracted assets (zero missing)
- Assets: transparent background, correct semantics, consistent style
- Layout: hierarchy correct, alignment correct, spacing correct
- Preview visually matches the source mockup
- No transparent text overlays, no hidden editable layers, no fake editability

## Success Criteria

Editable text · editable hierarchy · reusable assets · semantic layout description · runtime-generated final UI.

Never deliver: screenshot reconstruction, transparent-text overlays, hidden editable layers, fake editability.
