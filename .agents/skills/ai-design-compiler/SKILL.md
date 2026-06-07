---
name: ai-design-compiler
description: Compile a product requirement into a coherent art world, design scheme, high-fidelity design, engineered assets, semantic layout IR, HTML reference runtime, React PWA MVP, and finally production runtimes (RN / Cocos / Godot / Unity / Flutter / PPT). Use whenever the user wants AI to produce a real product end-to-end, not just a single screen.
---

# AI Product Compiler (V7)

> **Art → Design → Build once, render everywhere.**
> Art Concept → Design Scheme → High-Fidelity Design → Assets + Layout IR → **HTML (reference runtime, human QA)** → React PWA MVP → compile to React Native / Cocos / Godot / Unity / Flutter / PPT.

This is no longer just a UI generator. It is a **product compiler**: world-view in, production runtimes out.

## Core Principles

1. **Art First** — define the world before drawing any screen. Style drift downstream is almost always an Art Concept failure.
2. **Scheme Before Pixels** — convert the world into a concrete design scheme (page map, components, layout rules, imagegen spec) before calling Imagen.
3. **Fidelity First** — `Native > Crop > Repair > Sprite Sheet > Regenerate`. Minimize Imagen calls.
4. **Semantic Layout** — anchors / constraints / safe-area, never raw `x,y` pixels.
5. **HTML-First QA** — every target platform is first reconstructed as HTML and reviewed by a human against the original. HTML is the **Gold Standard**.
6. **Compiler Architecture** — HTML / React / RN / Cocos / Godot / Unity / Flutter / PPT are all **compiler backends** of the same Semantic Layout IR.

## The Four Permanent Assets

Versioned long-term as the source of truth:

1. **Art Concept** (`art-concept.md`, `style-board.png`, `color-system.json`, `visual-language.md`)
2. **Design Scheme** (`design-system.md`, `page-map.md`, `component-library.md`, `imagegen-spec.md`)
3. **Asset Manifest** (transparent assets, background layers, provenance)
4. **Semantic Layout IR** (`layout.json` + `theme.json`)

Runtimes (HTML/React/RN/Cocos/...) are regenerated from these — they are outputs, not sources of truth.

## Pipeline

```text
Requirement
   │
   ▼
00 art-concept                       → art-concept.md, style-board.png, color-system.json, visual-language.md
   ▼
01 design-scheme                     → design-system.md, page-map.md, component-library.md, imagegen-spec.md
   ▼
02 design-imagegen                   → design.png, design@2x.png, preview.png   (high-fidelity design)
   ▼
03 fidelity-first-asset-extraction   → visual_inventory.md, asset_manifest.json, transparent_assets/, background_layers/, .asset.json
   ▼
04 semantic-layout-builder           → layout_tree.md, layout.json, theme.json
   ▼
05 html-reference-renderer           → preview.html, comparison.html
   ▼
06 html-visual-review                → review.md, validation.json   ←─ repair loop until human approves
   ▼
07 react-pwa-generator               → React PWA = Reference Runtime + Business MVP
   ▼
08 runtime-compiler                  → React Native · Cocos · Godot · Unity · Flutter · PPT
```

## What each phase answers

| Phase | Question it answers |
|-------|---------------------|
| 00 Art Concept | What does the product **look and feel** like as a world? |
| 01 Design Scheme | How is that world **translated into a product** (pages, components, rules)? |
| 02 High-Fidelity Design | What is the first real **screen** of that scheme? |
| 03 Asset Extraction | How are visuals turned into **engineered assets** with max fidelity? |
| 04 Semantic Layout | How does layout work **across platforms**? |
| 05 HTML Renderer | Can the design be **reconstructed** faithfully? |
| 06 HTML QA | Has a human **confirmed** the reconstruction? |
| 07 React PWA | Can the product actually **run** with logic? |
| 08 Runtime Compiler | How do we **ship** to RN / Cocos / Godot / Unity / Flutter / PPT? |

## Phase References (read on demand)

| Phase | File | Read when |
|-------|------|-----------|
| 00 Art Concept | `references/00-art-concept.md` | Defining world-view, color system, material, light, icon language, UI principles |
| 01 Design Scheme | `references/01-design-scheme.md` | Turning the art concept into page map, component library, layout rules, imagegen spec |
| 02 Imagen | `references/02-design-imagegen.md` | Generating the high-fidelity mockup from the scheme |
| 03 Asset Extraction | `references/03-fidelity-first-asset-extraction.md` | Splitting mockup into native / crop / sprite-sheet / regenerated assets |
| 04 Layout IR | `references/04-semantic-layout-builder.md` | Producing `layout.json` (anchor/constraint/adaptive, no raw coords) |
| 05 HTML Renderer | `references/05-html-reference-renderer.md` | Generating `preview.html` + `comparison.html` from the IR |
| 06 HTML Review | `references/06-html-visual-review.md` | Running the human QA + repair loop |
| 07 React PWA | `references/07-react-pwa-generator.md` | Generating the MVP runtime (asset binding, layout binding, business logic) |
| 08 Runtime Compiler | `references/08-runtime-compiler.md` | Compiling to RN / Cocos / Godot / Unity / Flutter / PPT |
| Shared utilities | `references/shared.md` | Reconciliation, responsive layout, style library, provenance |

## Compiler Mental Model

```text
Art Concept           = Language spec
Design Scheme         = Module / package design
Design Screenshot     = Source code
Asset Manifest        = Resource table
Semantic Layout IR    = AST
HTML Preview          = Unit test (human-verified)
Renderer              = Compiler backend
React/Cocos/Godot/PPT = Machine code
```

## Hard Rules

- **Never** skip Art Concept on a new product — style drift later is 10× more expensive to fix.
- **Never** call Imagen before `design-scheme.md` + `imagegen-spec.md` exist.
- **Never** rasterize editable text or hide editable layers behind transparent overlays.
- **Never** ship a runtime that wasn't first validated in HTML.
- **Never** let AI hand-write Cocos Prefabs, Unity Scenes, Godot `.tscn`, or PPT XML directly — always go IR → compiler backend → runtime script.
- **Never** use raw `x,y` coordinates in the IR. Use anchor + offset + adaptive policy.
- **Never** call Imagen when a smaller strategy (Native / Crop / Repair / Sprite Sheet) can preserve the original fidelity.

## Required Deliverables

```text
art-concept.md
style-board.png
color-system.json
visual-language.md
design-system.md
page-map.md
component-library.md
imagegen-spec.md
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

- Art Concept signed off — world-view, palette, material, light, icon language all locked
- Design Scheme signed off — page map and component library match the art concept
- Inventory ↔ Asset Manifest reconciled (zero missing, zero unnamed)
- `preview.html` visually matches `design.png` (font, radius, shadow, hierarchy, color, spacing, asset, alignment, opacity)
- Layout IR uses only semantic primitives (anchor / constraint / auto-layout / safe-area / padding / margin / gap)
- Provenance recorded for every generated asset (source, region, strategy, prompt hash, sha256)
- A human has signed `review.md`
