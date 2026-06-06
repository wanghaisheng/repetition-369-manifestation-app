---
name: ai-design-compiler
description: Compiler-style pipeline that turns a requirement (or screenshot) into a high-fidelity design, an Asset Manifest, a Semantic Layout IR, then validates everything in HTML before compiling to React PWA / React Native / Cocos / Godot / Unity / Flutter / PPT. Trigger when the user asks to "convert design to editable UI", "extract assets / sprite sheet from a mockup", "build a semantic layout IR", "HTML reference renderer / visual QA", "compile layout to React/Cocos/Godot/Unity/Flutter/PPT", or mentions "Design Once / Compile Everywhere", "Fidelity First", "Asset Manifest", "Layout IR", or this V6 / V5 pipeline by name. Do NOT trigger for ordinary "build me a hero section" or single-component styling requests.
---

# AI Design Compiler (V6)

> **Build once, render everywhere.** Design → Assets + Layout IR → **HTML (reference runtime, human QA)** → React PWA (MVP) → compile to React Native / Cocos / Godot / Unity / Flutter / PPT.

## Core Principles

1. **Design First** — AI generates a high-fidelity design, not code.
2. **Fidelity First** — `Native > Crop > Repair > Sprite Sheet > Regenerate`. Minimize Imagen calls.
3. **Semantic Layout** — anchors / constraints / safe-area, never raw `x,y` pixels.
4. **HTML-First QA** — every target platform is first reconstructed as HTML and reviewed by a human against the original. HTML is the **Gold Standard**.
5. **Compiler Architecture** — HTML / React / Cocos / Godot / Unity / Flutter / PPT are all just **compiler backends** of the same Semantic Layout IR.

## The Three Permanent Assets

Only these three are versioned long-term:

1. **High Fidelity Design** (source PNG + spec)
2. **Asset Manifest** (transparent assets, background layers, provenance)
3. **Semantic Layout IR** (`layout.json` + `theme.json`)

Runtimes (HTML/React/RN/Cocos/...) are regenerated from these — they are outputs, not sources of truth.

## Pipeline

```text
Requirement
   │
   ▼
00 design-architect          → design-spec.md, design-system.md, visual-inventory.md, imagegen-prompt.md
   ▼
01 design-imagegen           → design.png, design@2x.png, preview.png
   ▼
02 fidelity-first-asset-extraction → visual_inventory.md, asset_manifest.json, transparent_assets/, background_layers/, .asset.json
   ▼
03 semantic-layout-builder   → layout_tree.md, layout.json, theme.json
   ▼
04 html-reference-renderer   → preview.html, comparison.html
   ▼
05 html-visual-review        → review.md, validation.json   ←─ repair loop until human approves
   ▼
06 react-pwa-generator       → React PWA = Reference Runtime + Business MVP
   ▼
07 runtime-compiler          → React Native · Cocos · Godot · Unity · Flutter · PPT
```

## Phase References (read on demand)

Each phase is documented separately. Load only the references relevant to the current task:

| Phase | File | Read when |
|-------|------|-----------|
| 00 Design Architect | `references/00-design-architect.md` | Turning a PRD / sketch / prompt into a design spec |
| 01 Imagen | `references/01-design-imagegen.md` | Generating the high-fidelity mockup |
| 02 Asset Extraction | `references/02-asset-extraction.md` | Splitting mockup into native / crop / sprite-sheet / regenerated assets |
| 03 Layout IR | `references/03-semantic-layout.md` | Producing `layout.json` (anchor/constraint/adaptive, no raw coords) |
| 04 HTML Renderer | `references/04-html-renderer.md` | Generating `preview.html` + `comparison.html` from the IR |
| 05 HTML Review | `references/05-html-review.md` | Running the human QA + repair loop |
| 06 React PWA | `references/06-react-pwa.md` | Generating the MVP runtime (asset binding, layout binding, business logic) |
| 07 Runtime Compiler | `references/07-runtime-compiler.md` | Compiling to RN / Cocos / Godot / Unity / Flutter / PPT |
| Shared utilities | `references/shared.md` | Reconciliation, responsive layout, style library, provenance |

## Compiler Mental Model

```text
Design Screenshot     = Source Code
Asset Manifest        = Resource Table
Semantic Layout IR    = AST
HTML Preview          = Unit Test (human-verified)
Renderer              = Compiler Backend
React/Cocos/Godot/PPT = Machine Code
```

## Hard Rules

- **Never** rasterize editable text or hide editable layers behind transparent overlays.
- **Never** ship a runtime that wasn't first validated in HTML.
- **Never** let AI hand-write Cocos Prefabs, Unity Scenes, Godot `.tscn`, or PPT XML directly — always go IR → compiler backend → runtime script.
- **Never** use raw `x,y` coordinates in the IR. Use anchor + offset + adaptive policy.
- **Never** call Imagen when a smaller strategy (Native / Crop / Repair / Sprite Sheet) can preserve the original fidelity.

## Required Deliverables

```text
design-spec.md
design-system.md
visual-inventory.md
imagegen-prompt.md
design.png
asset_manifest.json
transparent_assets/
background_layers/
layout_tree.md
layout.json
theme.json
preview.html
comparison.html
review.md           ← signed off by human
validation.json
```

Then, in order: React PWA → (after MVP validation) RN / Cocos / Godot / Unity / Flutter / PPT.

## QA Gate (must all be true before compiling beyond HTML)

- Inventory ↔ Asset Manifest reconciled (zero missing, zero unnamed)
- `preview.html` visually matches `design.png` (font, radius, shadow, hierarchy, color, spacing, asset, alignment, opacity)
- Layout IR uses only semantic primitives (anchor / constraint / auto-layout / safe-area / padding / margin / gap)
- Provenance recorded for every generated asset (source, region, strategy, prompt hash, sha256)
- A human has signed `review.md`
