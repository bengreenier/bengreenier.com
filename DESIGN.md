---
name: bengreenier.com
description: A living slab of marbled stone that wakes up when you get close.
colors:
  ground: "#06261a"
  ground-deep: "#031a11"
  pink: "#ffc4ea"
  pink-hot: "#ff8fd6"
  pink-ink: "#ffe3f5"
  ink-on-pink: "#052016"
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
  pebble: "58% 42% 55% 45% / 52% 60% 40% 48%"
  pebble-alt: "46% 54% 60% 40% / 45% 52% 48% 55%"
  slab: "3rem 2.2rem 3.4rem 2rem / 2.4rem 3.2rem 2.2rem 3rem"
spacing:
  gutter: "clamp(1rem, 4vw, 3.5rem)"
  stack: "clamp(1.5rem, 4vw, 3rem)"
  row: "clamp(0.5rem, 2vw, 1.25rem)"
components:
  pebble-primary:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.ink-on-pink}"
    rounded: "{rounded.pebble}"
    padding: "0.7em 1.35em 0.75em"
  pebble-primary-hover:
    backgroundColor: "{colors.pink-ink}"
    rounded: "{rounded.pebble-alt}"
  pebble-quiet:
    backgroundColor: "rgb(3 26 17 / 0.55)"
    textColor: "{colors.pink}"
    rounded: "{rounded.pebble}"
    padding: "0.7em 1.35em 0.75em"
  project-row:
    backgroundColor: "rgb(3 26 17 / 0.35)"
    textColor: "{colors.pink}"
    rounded: "{rounded.slab}"
    padding: "clamp(1rem, 2.5vw, 1.6rem) clamp(1rem, 3vw, 2.25rem)"
  project-row-hover:
    backgroundColor: "rgb(3 26 17 / 0.72)"
---

# Design System: bengreenier.com

## Overview

The site is a slab of green marble with pink type set on it. The stone is live: a WebGL shader (`src/scripts/marble.ts`) paints domain-warped fbm veins over a granite speckle, and it drifts at a calm pace. When the pointer nears anything interactive (`[data-energy]`), or keyboard focus lands on it, the veins swirl around that spot and the flow speeds up. On `/projects`, the nearby veins also tint toward the project's language hue. Everything else stays still so the stone can be the motion.

It deliberately refuses the dev-portfolio default: dark mode with a neon accent, mono type, and a grid of repo cards. The personality comes from huge, condensed, quirky type, a first-person voice, and organic shapes.

## Colors

### Primary
- **Pink** `#ffc4ea`: all type and the primary pebble fill. Hot pink `#ff8fd6` marks emphasis (the surname, the page title, "Gather"). Pink ink `#ffe3f5` covers lede and hover states.

### Neutral
- **Ground** `#06261a` and **ground deep** `#031a11`: the static fallback and the base of the slab. The shader keeps marble luminance low (under about 0.11) so pink body text holds 4.5:1. Only the thin veins go brighter.

### Tints
- Language hues, used only as vein tints and stack labels: TypeScript `#6b5cff`, Rust `#ff7333`, game mods `#9eff4d`. Stack labels brighten them (`brightness(1.35)`) to clear contrast.

### Named Rules
- **The Stone Owns Color.** Large color fields come from the marble, never from flat panels. UI surfaces are translucent ground (`rgb(3 26 17 / α)`) so the stone shows through.

## Typography

One family, Bricolage Grotesque Variable (self-hosted via Fontsource), driven across its axes:
- Display and titles: weight 800, `font-stretch: 75%`, tracking -0.04em, line-height ≤ 0.85.
- Project names: weight 700 at 78% width. On hover or focus they widen to 100% and weight 800. The axis animation is the type's motion.
- The lede and body copy are first person and casual.

### Named Rules
- **Width Is Emphasis.** Condensed is the resting state. Widening signals interaction.

## Layout

Generous gutters (`clamp(1rem, 4vw, 3.5rem)`). The home page is a single column on phones and becomes a two-column split at 64rem, with the name spanning both columns. The first viewport always holds the name, the call to action and the social links. Projects form one ordered index, and each row becomes a name/blurb split at 64rem.

## Elevation & Depth

Pebbles have soft depth: a blurred drop shadow plus inner highlight and shade, so they read as polished stones. There are no hard offset shadows. Text sitting over the marble uses a soft dark `text-shadow` for legibility.

## Shapes

Everything is organic. Pebbles use asymmetric elliptical `border-radius` values that morph to an alternate set on hover. Project rows use the larger slab radii. There are no square corners and no straight dividers.

## Components

### Buttons (pebbles)
- **Primary pebble:** pink fill, dark green text. On hover or focus it morphs its radii, lifts 2px, rotates -1.5°, and widens its type.
- **Quiet pebble:** a translucent ground fill with a 2px inset pink ring. Used for nav and social links. `aria-current="page"` fills it pink.

### Navigation
- Two quiet pebbles (Home, Projects) top-left, plus a skip link.

### Project row (signature)
- A whole-row link to the repo, carrying `data-energy` and `data-tint`. Hover or focus darkens the row, nudges it right, widens the name, and tints the stone.

## Do's and Don'ts

### Do:
- Mark new interactive elements with `data-energy` so the stone reacts to them, and add `data-tint="r,g,b"` when they have a hue.
- Keep motion inside the shader and the type axes. Respect `prefers-reduced-motion`, which already freezes the slab to a still frame.
- Add projects by editing `src/data/site.ts`.

### Don't:
- Don't add opaque color panels, gradients or neon glows. The stone carries color.
- Don't add kickers or eyebrows above headings, mono labels, or emoji icons. Icons are authored SVG.
- Don't raise marble brightness behind body text above the current clamp.
