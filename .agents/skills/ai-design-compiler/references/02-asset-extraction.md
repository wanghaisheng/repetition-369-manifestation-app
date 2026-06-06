# 02 — Fidelity-First Asset Extraction

**Purpose**: maximize design fidelity, minimize Imagen calls.

## Decision Tree
```
Visual Object
 ├─ Expressible in code?      → A. Native
 ├─ Crop-safe (no text, identity must remain)? → B. Direct Crop
 ├─ UI overlaps the bg we need? → C. Crop + Background Repair
 ├─ Many small consistent icons? → D. Sprite Sheet
 └─ Source unusable / blurry  → E. Regenerate
```

Priority order is strict: **Native > Crop > Repair > Sprite Sheet > Regenerate**.

## A — Native (code)
text, rectangle, border, radius, gradient, shadow, divider, progress bar, container.

## B — Direct Crop (default; zero Imagen)
logo, coin, icon, badge, avatar, button glyph.
Record `source_region_px {x,y,w,h}`. **Forbidden**: whole cards, table rows, buttons-with-text, profile cards.

## C — Crop + Repair (generative fill)
`imagegen--edit_image` on the background with the foreground removed. Prompt: *"Remove the object. Restore surrounding texture. Keep original lighting."*

## D — Sprite Sheet (batch generation)
1. Build inventory list (mail / shop / gift / event / rank / quest …).
2. One sparse Imagen sheet — pure chroma-key bg, large spacing, no text, no overlap, consistent style.
3. `imagegen--edit_image` with `transparent_background: true`.
4. Connected-component split → one PNG per inventory id.
5. **Reconciliation**: count + name + semantics must match inventory exactly. Missing = failure.

## E — Regenerate
`imagegen--generate_image` with `transparent_background: true`, matching surrounding style. Last resort.

## Tool Map (Lovable sandbox)
| Task | Tool |
|------|------|
| Remove white/green bg | `imagegen--edit_image` + `transparent_background` |
| Background repair / generative fill | `imagegen--edit_image` |
| Asset regeneration | `imagegen--generate_image` |
| Transparent PNG creation | `imagegen--generate_image` + `transparent_background` |
| Asset storage | `lovable-assets` CLI |
| Provenance | `.asset.json` sidecar |

## Provenance (per asset, mandatory)
```json
{ "asset_id": "shop", "source": "design.png", "source_region_px": {"x":0,"y":0,"w":0,"h":0},
  "strategy": "sprite-sheet", "prompt_hash": "...", "sha256": "...", "imagegen_hash": "...", "created_at": "..." }
```

## Output
```
visual_inventory.md
asset_manifest.json
transparent_assets/
background_layers/
*.asset.json
```
