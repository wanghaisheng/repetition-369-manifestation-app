# 04 — HTML Reference Renderer

**Purpose**: HTML is the **Gold Standard** runtime. Every other target compares against it.

## Why HTML First
1. Easiest visual verification (side-by-side with the design).
2. Native responsive (Flex/Grid/Absolute/Constraint mature everywhere).
3. Fastest iteration — edit `layout.json`, refresh, done. No engine reimport.
4. Becomes the canonical reference for React / RN / Cocos / Godot / Unity / Flutter.

## Input
```
layout.json
asset_manifest.json
theme.json
transparent_assets/
background_layers/
```

## Output
```
preview.html       (the reconstruction)
comparison.html    (side-by-side: original | HTML)
```

## comparison.html layout
```
+----------------------+----------------------+
| Original Design      | HTML Reconstruction  |
+----------------------+----------------------+
```

## Implementation notes
- Use semantic CSS primitives that map 1:1 to the IR (flexbox for auto-layout, `position: absolute` + anchors for constraints, `env(safe-area-inset-*)` for adaptive safe-area).
- Bind every asset by id from `asset_manifest.json`. No inline base64 unless the asset is `< 2 KB`.
- Apply tokens from `theme.json` as CSS custom properties — no hex literals in markup.
