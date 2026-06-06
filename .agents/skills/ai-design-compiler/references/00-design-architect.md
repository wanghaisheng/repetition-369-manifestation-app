# 00 — Design Architect

**Purpose**: requirement → design **spec**, not images.

## Input
PRD · natural-language requirement · sketch · reference images.

## Output
```
design-spec.md
design-system.md   (colors, typography, radius, shadows, spacing scale)
visual-inventory.md (every object id + type — source of truth for later reconciliation)
imagegen-prompt.md  (handed to Skill 01)
```

## Supported Modes & References
| Mode | References |
|------|-----------|
| PPT | Apple, Stripe, McKinsey |
| App UI | Apple HIG, Material Design |
| Web | Linear, Vercel |
| Dashboard | TradingView, Notion, Grafana |
| Game UI | Supercell, Clash Royale, Clash of Clans, Rise of Kingdoms |

## Rules
- Commercial-grade, engineering-ready
- Asset-extractable (avoid heavy occlusion, gratuitous overlap)
- Consistent visual language across all screens in the spec
- Every visible element listed in `visual-inventory.md` with `id | type` (image / widget / button / text / shape / background)
