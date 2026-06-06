# 01 — Design Imagegen

**Purpose**: GPT-refined prompt + Imagen → engineering-grade high-fidelity mockup, not a pretty picture.

## Workflow
```
Requirement → Design Spec → Prompt Builder → GPT Refine → Imagen → QA
```

## Prompt Recipe
`Subject + Layout + Visual Style + Color System + Material + Rendering Constraints`

Always append: *"asset extraction friendly, high readability, professional production quality, layers clearly separated, icons isolated, text crisp, natural shadows, 4K"*.

## Tools
- `imagegen--generate_image` — `premium` tier when typography or fine UI is involved.
- `imagegen--edit_image` — only inside Skill 02 (repair / background fill).

## Output
```
design.png
design@2x.png
preview.png   (downscaled for review pages)
```

## QA (reject if any fails)
- Visual hierarchy clear
- Spacing consistent
- No unreadable text
- Implementation feasible (no impossible occlusion, no rasterized fake-editable layers)
- Style matches `design-system.md`
