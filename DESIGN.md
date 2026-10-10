---
name: bengreenier.com
description: Two greens on paper, stacked like offset sheets that fan out when you reach for them.
colors:
  paper: "#eef0e8"
  lime: "#8fd14f"
  teal: "#3fae7f"
  teal-blue: "#4a93cf"
  ink: "#13221a"
  ink-soft: "#2b3d32"
  gold: "#a68e45"
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

Two flat greens printed on off-white paper, after Ben's reference: a 1960s Japanese "world graphic design exhibition" poster. Every block is a stack of offset sheets in alternating lime and teal. The masthead's stack rises above it, left edges aligned and each strip shorter on the right. The bio panel and project rows fan down and to the left. When a fine pointer comes near a stack, or keyboard focus lands inside it, `src/scripts/sheets.ts` sets `--energy` and the sheets fan further apart, then settle. The teal ink drifts to blue (`#4a93cf`) and back once a minute. A faint paper grain sits over everything.

## Colors

- **Paper** `#eef0e8`: the ground.
- **Lime** `#8fd14f` and **teal** `#3fae7f` (drifting to `#4a93cf`): the two sheet inks, always alternating.
- **Ink** `#13221a`: all text and primary buttons. It passes 4.5:1 on paper, lime, teal and the blue end of the drift.
- **Gold** `#a68e45`: only the small foil-stamp square next to the name. Never used for text, because it can't hold contrast on the greens.

### Named Rules
- **Alternate the Inks.** Stacked sheets always alternate lime and teal.
- **No Pink, No Rounding.** Ben vetoed both.

## Typography

One family, Bricolage Grotesque Variable: display at weight 800 and 75% width, with tight tracking. Project names go from weight 700 to 800 on a fine-pointer hover or keyboard focus. The width stays fixed, so rows never reflow.

## Shapes

Square, always. The stacks are built from hard-edged `box-shadow` copies (`.sheets` in `global.css`, driven by `--ox`, `--oy`, `--sp` and `--energy`). That's the world's one shape device.

## Components

- **Primary button:** an ink fill with paper text, carrying a two-sheet lime/teal stack that fans on hover or focus.
- **Quiet button:** paper with a 2px ink ring and a lime sheet. `aria-current="page"` turns it ink.
- **Project row:** a full sheet stack, alternating lime and teal down the list.

## Do's and Don'ts

### Do:
- Give new blocks `class="sheets"` and `data-stack` so they stack and fan.
- Gate hover effects behind `(hover: hover) and (pointer: fine)`. Respect `prefers-reduced-motion`, which stops the drift and snaps the stacks instead of animating them.
- Run all copy through the `no-ai-slop` skill.

### Don't:
- Don't add gradients, glows or rounded corners. The gold square is the only gradient.
- Don't put gold or teal text on the greens.
