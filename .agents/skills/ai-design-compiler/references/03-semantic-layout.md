# 03 — Semantic Layout Builder

**Purpose**: design → **Semantic Layout IR**. Describe layout semantically, never as raw pixels.

## Forbidden
```json
{ "x": 123, "y": 456 }
```

## Required
```json
{
  "id": "battle_button",
  "asset": "battle-button",
  "anchor": "bottom-center",
  "offset": { "x": 0, "y": -32 },
  "adaptive": "safe-area",
  "size": { "w": "60%", "h": 64 }
}
```

## Primitives
- **Auto Layout** — horizontal · vertical
- **Constraint** — top-left · top-right · bottom · center · scale
- **Adaptive** — safe-area · stretch · fit-content · scale · cover
- **Spacing** — padding · margin · gap
- **Responsive** — phone / tablet / desktop / landscape / portrait breakpoints

## Layout Tree (engine-agnostic, semantic hierarchy)
```
GameMain
├─ Background
├─ TopHUD
│  ├─ Avatar
│  ├─ CoinBar
│  └─ DiamondBar
├─ BattleButton
└─ BottomNavigation
```

## Output
```
layout_tree.md
layout.json
theme.json    (tokens — colors, radii, shadows, type scale)
```

## Forbidden in JSON
UUIDs · serialized engine components · editor metadata · runtime-specific fields.
