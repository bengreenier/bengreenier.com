---
name: bengreenier.com
description: A live risograph print that tears and glitches when you get close.
colors:
  ground: "#0b0d0b"
  ground-deep: "#070807"
  paper: "#f1e7d6"
  vermilion: "#f0533a"
  paper-ink: "#fff6ea"
  ink-on-vermilion: "#0b0d0b"
  ink-green: "#3f8a4a"
  ink-blue: "#2f55e4"
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
    backgroundColor: "{colors.vermilion}"
    textColor: "{colors.ink-on-vermilion}"
    rounded: "{rounded.none}"
    padding: "0.75em 1.4em 0.8em"
  pebble-primary-hover:
    backgroundColor: "#ff7a33"
    rounded: "{rounded.none}"
  pebble-quiet:
    backgroundColor: "rgb(11 13 11 / 0.92)"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0.75em 1.4em 0.8em"
  project-row:
    backgroundColor: "rgb(11 13 11 / 0.92)"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "clamp(1rem, 2.5vw, 1.6rem) clamp(1rem, 3vw, 2.25rem)"
  project-row-hover:
    backgroundColor: "{colors.ground}"
---

# Design System: bengreenier.com

## Overview

The site is a live risograph/screenprint poster. A WebGL shader (`src/scripts/marble.ts`) prints flat inks: a near-black ground, a big green field with torn, comb-like edges and blue grain speckle, tall leaning vermilion and cobalt strokes with a dark misregistered edge, and black diagonal slabs. Thin horizontal bands slip sideways like a glitched scan. It drifts calmly. When the pointer nears anything interactive (`[data-energy]`), or keyboard focus lands on it, more bands tear and slip further around that spot, and on `/projects` the nearby strokes take on the project's language hue. Once a minute the green and blue inks swap between the field and the strokes. Reference: Ben's "color inspiration" screenprint (black ground, green field with blue grain, vermilion and cobalt strokes).

## Colors

### Inks (shader)
- Black ground `#0b0d0b`, green field `#3f8a4a`, cobalt `#2f55e4`, vermilion `#f0533a`. Inks are flat. Texture comes only from grain, speckle and torn edges, never from gradients.

### UI
- **Vermilion** `#f0533a` (`--accent-hot`): display emphasis (the surname, page titles, "Gather") and button fills. Black text on it.
- **Paper** `#f1e7d6` (`--accent`): body copy and "Ben". **Paper ink** `#fff6ea` for the lede and hovers.
- **Ground** `#0b0d0b`: knockout blocks behind all body copy and project rows.

### Named Rules
- **Knockout Blocks.** Body copy never sits directly on the inks. It sits in a solid black block, the way a poster knocks type out of the print.
- **Ink Outline.** Display type over the print gets a black outline (`-webkit-text-stroke: var(--ink-outline)` with `paint-order: stroke fill`).
- **No Pink.** Ben vetoed it. Vermilion is the only warm ink.
- **Green ⇄ Blue.** The only color journey is the field/stroke ink swap.

## Typography

One family, Bricolage Grotesque Variable (self-hosted via Fontsource):
- Display and titles: weight 800, `font-stretch: 75%`, tracking -0.04em, line-height ≤ 0.85, with the ink outline.
- Project names: weight 700 at 78% width. With a fine pointer or keyboard focus they widen to 100% and weight 800.

### Named Rules
- **Width Is Emphasis.** Condensed is the resting state. Widening signals interaction.

## Layout

Generous gutters (`clamp(1rem, 4vw, 3.5rem)`). The home page is a single column on phones and becomes a two-column split at 64rem, with the name spanning both columns. The first viewport always holds the name, the call to action and the social links. Projects form one ordered index of black rows separated by thin vermilion hairlines.

## Elevation & Depth

Flat print. Buttons cast a soft dark drop shadow and lift on hover. There are no glows or gradients.

## Shapes

**Square, always.** `border-radius` is 0 everywhere. Torn, organic edges live only in the print.

## Components

### Buttons
- **Primary:** a vermilion fill with black text. Lifts (-3px, -3px) on hover or focus.
- **Quiet:** a black fill with a 2px inset vermilion ring and paper text. Used for nav and social links. `aria-current="page"` fills it vermilion.

### Project row (signature)
- A black row linking to the repo, carrying `data-energy` and `data-tint`. With a fine pointer or keyboard focus, it draws a 2px vermilion frame, nudges right, widens the name, and tears and tints the print nearby. Touch gets no hover state.

## Do's and Don'ts

### Do:
- Mark new interactive elements with `data-energy`, and add `data-tint="r,g,b"` when they have a hue.
- Keep motion inside the shader and the type axes. Respect `prefers-reduced-motion`.
- Keep the print fixed: the canvas is sized to `100lvh`, and the shader is anchored top-left and scaled by width only.
- Gate hover effects behind `@media (hover: hover) and (pointer: fine)`.
- Add projects by editing `src/data/site.ts`. Run all copy through the `no-ai-slop` skill.

### Don't:
- Don't use pink or magenta, and don't round any corners.
- Don't set body copy directly on the print. Use a knockout block.
- Don't add gradients, glows or soft shading to the inks.
