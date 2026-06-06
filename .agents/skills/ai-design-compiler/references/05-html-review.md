# 05 — HTML Visual Review (Repair Loop)

**Purpose**: human-in-the-loop QA. No runtime beyond HTML is generated until this passes.

## Loop
```
Render → Review → Fix layout.json / assets → Re-render → … → Approved
```

## QA Checklist
- [ ] Font family + weight + size
- [ ] Border radius (all corners)
- [ ] Shadows (offset, blur, color, opacity)
- [ ] Z-order / layering
- [ ] Color tokens (no drift from `theme.json`)
- [ ] Spacing (padding, margin, gap)
- [ ] Asset identity (correct PNG, correct scale, transparent edges clean)
- [ ] Alignment (anchors resolve correctly across breakpoints)
- [ ] Opacity / blending
- [ ] Animation placeholders present where the spec calls for motion
- [ ] Responsive: phone / tablet / desktop / landscape / portrait all match the design intent

## Outputs
```
review.md         — checklist + human sign-off
validation.json   — machine-readable pass/fail per item, for CI gating
```

## Gating Rule
`review.md` must be signed off (and `validation.json.pass === true`) **before** Skill 06 (React PWA) or Skill 07 (Runtime Compiler) run.
