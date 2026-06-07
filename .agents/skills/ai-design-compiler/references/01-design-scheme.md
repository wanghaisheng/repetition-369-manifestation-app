# 01 — Design Scheme

**Purpose**: translate the art world (Skill 00) into a **concrete product design scheme** — what pages exist, what components compose them, what rules govern layout, and how Imagen must generate the high-fidelity design.

This phase still produces **no pixels**. It produces the contract that Skill 02 (Imagen) will execute.

## Input
```
art-concept.md
style-board.png
color-system.json
visual-language.md
```
Plus: PRD / user flows.

## Output
```
design-system.md       (tokens: typography, spacing, radius, shadows, motion — derived from Art Concept)
page-map.md            (every page/screen + its purpose + its primary action)
component-library.md   (every reusable component + variants + states)
imagegen-spec.md       (handed to Skill 02 — prompts, constraints, do/don't)
```

## design-system.md
Token-level execution of the Art Concept. Examples:
- Type scale (display / h1 / h2 / body / caption) with font family from Art Concept
- Spacing scale (4 · 8 · 12 · 16 · 24 · 32 · 48 · 64)
- Radius scale (sm / md / lg / pill) — values must respect Art Concept's UI principle (e.g. `radius 24` → lg = 24)
- Shadow scale (sm / md / lg / floating)
- Motion tokens (duration, easing)

All values reference Art Concept; no surprise additions.

## page-map.md
One row per screen.
| ID | Page | Purpose | Primary Action |
|----|------|---------|----------------|
| login | Login | Auth entry | Continue |
| main | Main | Hub | Tap battle |
| shop | Shop | Buy currency / items | Purchase |
| inventory | Inventory | Manage owned items | Equip |
| battle | Battle | Core loop | Attack |
| settings | Settings | Preferences | Toggle |

## component-library.md
| Component | Variants | States | Notes |
|-----------|----------|--------|-------|
| Primary Button | solid / outline / ghost | default / hover / pressed / disabled | uses `primary` token |
| Secondary Button | … | … | |
| Currency Bar | coin / diamond / energy | … | top-HUD only |
| Avatar Card | sm / md / lg | … | |
| Dialog | modal / sheet / toast | … | |
| Bottom Navigation | 3-tab / 5-tab | active / inactive | safe-area aware |

Each component lists: anchors it tends to use, allowed materials, allowed motion.

## Layout Rules (inside design-system.md)
Examples:
- Top: HUD pinned
- Bottom: Tab pinned (safe-area)
- Middle: adaptive, fills remainder
- Modals: centered with backdrop

These rules pre-commit the Semantic Layout IR (Skill 04).

## imagegen-spec.md
The contract between this phase and Skill 02. Must include:

**Required clauses:**
- 4K
- Commercial / production-grade
- Style locked to Art Concept (cite the world-view phrase verbatim)
- Assets extractable (icons isolated, no occlusion)
- Icons independent
- Minimal overlap

**Forbidden clauses:**
- Complex overlapping layers
- Text rasterized on top of imagery (must stay editable)
- Heavy transparent FX that block extraction
- Compositions that can't be sliced

**Per-page prompt stubs:**
For each entry in `page-map.md`, a prompt skeleton:
`Subject + Layout + Visual Style (from Art Concept) + Color System + Material + Lighting + Constraints`.

## Rules
- The Design Scheme must be reviewable in isolation: a teammate should understand the entire product surface from these four files alone.
- If a page or component is not in this scheme, **do not generate it** in Skill 02. Loop back here first.
- Every token in `design-system.md` must trace to a decision in `art-concept.md` (or `visual-language.md`). No orphan tokens.
