---
name: bengreenier.com
description: A living slab of marbled stone that wakes up when you get close.
colors:
  ground: "#04170f"
  ground-deep: "#020c08"
  cream: "#ffd2b0"
  safety-orange: "#ff5f0f"
  cream-ink: "#ffe9da"
  ink-on-orange: "#0a0603"
  jade: "#5fd3a0"
  tint-typescript: "#6b5cff"
  tint-rust: "#ff7333"
  tint-mods: "#9eff4d"
typography:
  display:
    fontFamily: "'Bricolage Grotesque Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(4.25rem, 26vw, 17rem)"
    fontWeight: 800
    lineHeight: 0.8
    letterSpacing: "-0.04em"
  title:
    fontFamily: "'Bricolage Grotesque Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 11vw, 9rem)"
    fontWeight: 800
    lineHeight: 0.85
    letterSpacing: "-0.04em"
  project-name:
    fontFamily: "'Bricolage Grotesque Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 6.5vw, 5.25rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  lede:
    fontFamily: "'Bricolage Grotesque Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.35rem, 2.6vw, 2.15rem)"
    fontWeight: 450
    lineHeight: 1.25
  body:
    fontFamily: "'Bricolage Grotesque Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "'Bricolage Grotesque Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 650
    lineHeight: 1.3
rounded:
  none: "0"
spacing:
  gutter: "clamp(1rem, 4vw, 3.5rem)"
  stack: "clamp(1.5rem, 4vw, 3rem)"
  row: "clamp(0.5rem, 2vw, 1.25rem)"
components:
  pebble-primary:
    backgroundColor: "{colors.safety-orange}"
    textColor: "{colors.ink-on-orange}"
    rounded: "{rounded.none}"
    padding: "0.75em 1.4em 0.8em"
  pebble-primary-hover:
    backgroundColor: "#ff7a33"
    rounded: "{rounded.none}"
  pebble-quiet:
    backgroundColor: "rgb(2 12 8 / 0.6)"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
    padding: "0.75em 1.4em 0.8em"
  project-row:
    backgroundColor: "rgb(2 12 8 / 0.35)"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
    padding: "clamp(1rem, 2.5vw, 1.6rem) clamp(1rem, 3vw, 2.25rem)"
  project-row-hover:
    backgroundColor: "rgb(2 12 8 / 0.78)"
---

# Design System: bengreenier.com

## Overview

The site is a slab of green marble with safety-orange type set on it. The stone is live: a WebGL shader (`src/scripts/marble.ts`) paints domain-warped fbm veins, emerald with obsidian pockets, over a granite speckle, and it drifts at a calm pace. Its hue eases from emerald to sapphire and back once a minute, on wall-clock time, so interaction never rushes it. It holds at emerald under reduced motion. When the pointer nears anything interactive (`[data-energy]`), or keyboard focus lands on it, the veins swirl around that spot and the flow speeds up. On `/projects`, the nearby veins also tint toward the project's language hue. Organic form lives only in the stone. Everything set on it is hard-edged.

## Colors

### Primary
- **Safety orange** `#ff5f0f`: display emphasis (the surname, page titles, "Gather") and button fills. It is only ever large or bold text, because at small sizes on dark stone it falls under 4.5:1.

### Secondary
- **Cream** `#ffd2b0`: body copy and the first line of the name, a pale orange tint that keeps body text above 4.5:1. **Cream ink** `#ffe9da` covers the lede and hover states.

### Neutral
- **Ground** `#04170f` and **ground deep** `#020c08`: the static fallback and the base of the slab. The shader keeps marble luminance low so cream body text stays legible. Only the thin jade veins go brighter.

### Tints
- Language hues, used only as vein tints and stack labels: TypeScript `#6b5cff`, Rust `#ff7333`, game mods `#9eff4d`.

### Named Rules
- **The Stone Owns Color.** Large color fields come from the marble. UI surfaces are translucent ground (`rgb(2 12 8 / α)`).
- **No Pink.** Ben vetoed it. The marble has no magenta either.
- **Green to Blue.** The stone's only color journey is emerald ⇄ sapphire. Orange stays fixed on top.

## Typography

One family, Bricolage Grotesque Variable (self-hosted via Fontsource):
- Display and titles: weight 800, `font-stretch: 75%`, tracking -0.04em, line-height ≤ 0.85.
- Project names: weight 700 at 78% width. On hover or focus they widen to 100% and weight 800.

### Named Rules
- **Width Is Emphasis.** Condensed is the resting state. Widening signals interaction.

## Layout

Generous gutters (`clamp(1rem, 4vw, 3.5rem)`). The home page is a single column on phones and becomes a two-column split at 64rem, with the name spanning both columns. The first viewport always holds the name, the call to action and the social links. Projects form one ordered index separated by 1px orange hairlines.

## Elevation & Depth

Buttons cast a soft dark drop shadow and lift up and to the left on hover. Text over the marble uses a soft dark `text-shadow`. There are no hard offset shadows.

## Shapes

**Square, always.** `border-radius` is 0 everywhere: buttons, rows, focus rings, the favicon. Ben vetoed roundness. The marble is the only organic form.

## Components

### Buttons (slabs)
- **Primary:** a safety-orange fill with near-black text. On hover or focus it lifts (-3px, -3px), its shadow deepens, and its type widens.
- **Quiet:** a translucent ground fill with a 2px inset orange ring. Used for nav and social links. `aria-current="page"` fills it orange.

### Project row (signature)
- A whole-row link to the repo, carrying `data-energy` and `data-tint`. Hover or focus darkens the row, draws a 2px orange frame, nudges it right, widens the name, and tints the stone.

## Do's and Don'ts

### Do:
- Mark new interactive elements with `data-energy`, and add `data-tint="r,g,b"` when they have a hue.
- Keep motion inside the shader and the type axes. Respect `prefers-reduced-motion`.
- Keep the slab fixed: the canvas is sized to `100lvh` and the shader is anchored top-left and scaled by width only, so mobile browser chrome showing or hiding during scroll never moves the stone.
- Gate hover effects behind `@media (hover: hover) and (pointer: fine)`. Touch gets no hover highlight, and touch pointers do not stir the stone. Keyboard `:focus-visible` keeps the full treatment everywhere.
- Add projects by editing `src/data/site.ts`.

### Don't:
- Don't use pink or magenta, and don't round any corners.
- Don't set small text in safety orange. Use cream.
- Don't add opaque color panels, gradients or neon glows, or kickers above headings.
