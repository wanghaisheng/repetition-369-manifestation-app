# 08 — Runtime Compiler (Backends)

**Purpose**: compile the validated IR + assets + (optionally) React PWA business logic into production runtimes. **AI never hand-writes engine serialization.**

## Inputs (all four permanent assets)
```
art-concept.md + visual-language.md         (style guardrails)
design-system.md + theme.json               (tokens)
layout.json                                 (IR)
asset_manifest.json + transparent_assets/ + background_layers/
business logic (from React PWA, optional for static targets)
```

## Backends

### HTML
Output: `html` + `css`. Same generator as Skill 05.

### React
Output: `.tsx` components + asset bindings + layout bindings. Same generator as Skill 07.

### React Native
Reuse: Asset Manifest, Semantic Layout IR, business logic.
Regenerate: `RNRenderer` (View / FlatList / SafeAreaView). Forbid raw `position: absolute` where Flex works.

### Cocos
Reuse: Asset Manifest, Semantic Layout IR.
Generate: `AutoBuildUI.ts`, layout JSON, Prefab Builder script.
Prefer: `Widget`, `Layout`, `UITransform`. **Forbid**: `node.setPosition(123, 456)`.

### Godot
Reuse: Asset Manifest, Semantic Layout IR.
Generate: Scene Builder script.
Prefer: `Control`, `MarginContainer`, `HBoxContainer`, `VBoxContainer`. **Forbid**: hardcoded `position =`.

### Unity
Generate: builder C# that constructs `RectTransform` trees.
Prefer: `LayoutGroup`, anchors, `ContentSizeFitter`. **Forbid**: hardcoded `anchoredPosition`.

### Flutter
Generate: widget tree.
Prefer: `Row`, `Column`, `Stack`, `Expanded`, `SafeArea`, `MediaQuery`.

### PPT
Generate: **editable** shapes + text + pictures. **Forbid**: whole-page screenshots, transparent text-over-image fakes.

## Architecture
```text
Semantic Layout IR  (AST)
        │
        ▼
  Compiler Backend  (per target)
        │
        ▼
  Runtime Script    (AutoBuildUI.ts / RNRenderer.tsx / Scene Builder / etc.)
        │
        ▼
  Engine Output     (Prefab / Scene / .tscn / PPTX / ...)
```

## Rule
For every backend: **Adaptive first** — anchor / constraint / auto-layout / safe-area / flex over absolute positioning. Absolute positioning is only allowed when the IR explicitly marks a node as `pinned`.
