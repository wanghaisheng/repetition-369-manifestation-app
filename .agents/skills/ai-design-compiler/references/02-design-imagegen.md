# 02 — Design Imagegen

**Purpose**: GPT-refined prompt + Imagen → engineering-grade high-fidelity mockup, not a pretty picture. Executes the contract in `imagegen-spec.md` (Skill 01).

## Workflow
```
Art Concept + Design Scheme → imagegen-spec.md → Prompt Builder → GPT Refine → Imagen → QA
```

## Prompt Recipe
`Subject + Layout + Visual Style (from Art Concept) + Color System + Material + Lighting + Rendering Constraints`

Always append: *"asset extraction friendly, high readability, professional production quality, layers clearly separated, icons isolated, text crisp, natural shadows, 4K"*.

The Visual Style and Lighting clauses must be copied verbatim from `art-concept.md` / `visual-language.md` — do not paraphrase.

## Tools
- `imagegen--generate_image` — `premium` tier when typography or fine UI is involved.
- `imagegen--edit_image` — only inside Skill 03 (repair / background fill).

## Output
```
design.png
design@2x.png
preview.png   (downscaled for review pages)
```

## QA (reject if any fails)
- Matches `style-board.png` feel (world-view intact)
- Visual hierarchy clear
- Spacing consistent with `design-system.md`
- No unreadable text
- Implementation feasible (no impossible occlusion, no rasterized fake-editable layers)
- Color tokens match `color-system.json`
- No forbidden moves from `visual-language.md`
