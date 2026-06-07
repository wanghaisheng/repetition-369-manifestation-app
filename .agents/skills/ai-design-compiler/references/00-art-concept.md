# 00 — Art Concept

**Purpose**: define the **world** the product lives in, before any page is designed. This is the single most ignored phase, and the root cause of almost all style drift downstream (UI A vs UI B looking like different designers, Imagen assets drifting, game UI sliding off-tone over time).

This phase does **not** design any screen. It designs the **universe**.

## Input
PRD · product type (game / app / dashboard / PPT) · brand references · mood references.

## Output
```
art-concept.md
style-board.png        (one mood board image — generated or curated)
color-system.json
visual-language.md
```

## What art-concept.md must cover

### 1. World-view (one sentence, then one paragraph)
Examples:
- Game: *Cozy healing farm* · *Eastern xianxia* · *Cyberpunk* · *Medieval fantasy* · *Chibi Three Kingdoms*
- App: *Apple minimal* · *Linear* · *Notion* · *Stripe* · *Modern enterprise*
- PPT: *Apple Keynote* · *McKinsey* · *Investor pitch* · *Tech launch keynote*

The world-view is non-negotiable downstream — every Imagen prompt, every component, every animation must serve it.

### 2. Color System
```json
{
  "primary":    "#ff9f43",
  "secondary":  "#6c5ce7",
  "accent":     "#00cec9",
  "background": "#f8f9fa",
  "surface":    "#ffffff",
  "ink":        "#1a1a1a"
}
```
Plus: usage rules (where each color is allowed), dark-mode pairings, accessibility contrast notes.

### 3. Icon Language
Pick exactly **one**: bold-stroke · flat · soft-skeuomorphic · glassmorphic · pixel · chibi-cartoon · line · duotone.
Mixing icon languages = world broken.

### 4. Material
Allowed materials in the world: wood · gold · stone · leather · crystal · metal · paper · glass · neon · fabric.
Each material has a sample swatch (Imagen-rendered if needed) saved in `style-board.png`.

### 5. Light & Rendering
Pick: soft light · high-saturation · cinematic · volumetric light · ambient occlusion · flat shadow · long shadow · neon glow.
This dictates every later Imagen prompt's lighting clause.

### 6. UI Principles (in-world)
Concrete primitives the world enforces. Examples:
- Radius 24
- Buttons have depth (3D)
- Cards float (drop shadow)
- Unified stroke width
- No gradients, OR gradients everywhere — pick one

## visual-language.md
Codifies the prose form of all of the above, plus **forbidden moves**:
- forbidden colors
- forbidden fonts
- forbidden effects (e.g. "no purple-on-white gradients", "no Inter")
- forbidden composition tropes

The forbidden list is as important as the allowed list.

## Style Board
One Imagen-generated reference image (or curated collage) that shows the world in **one frame** — palette + material + light + icon language coexisting. Used as a sanity check downstream: if a generated screen "doesn't feel like the style board," it fails QA.

## Rules
- **Pick conviction over balance.** Maximalist, minimalist, brutalist, editorial — commit. No two products from this pipeline should look the same.
- **No generic AI aesthetics** (purple-blue gradient on white, Inter/Poppins, predictable layouts) unless that is explicitly the chosen world.
- Art Concept is signed off **before** Skill 01 starts. Changes after sign-off cascade through every later phase — treat as expensive.
