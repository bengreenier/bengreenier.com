---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/projects.astro"]
---

# Surface brief: home + projects

Scope: `/` (bio and links) and `/projects` (curated index). Visitor mode: Experience. Ben is the work, so the page should feel like him from the first viewport.

Audience and job: engineers and the occasional recruiter arriving from GitHub or social, on a phone or at a desk. They want to know who this is, what he builds, and where to find him, in under a minute.

User-pinned direction (beats the roll): organic shapes, noise textures (granite-like, marbled), and subtle motion that ramps up energetically when there's relevant interaction nearby. Earlier feedback: no themed costume, more "me", bolder.

## Direction contract

THESIS: A living slab of marbled stone that wakes up when you get close. It refuses the dev-portfolio default of dark mode, neon accents, mono type, and a grid of repo cards.

OWN-WORLD: A deep green marble ground, domain-warped fbm veins in jade and wine, and a fine granite speckle, all rendered live in WebGL. Type is hot pink (#ffc4ea family) set in Bricolage Grotesque at huge sizes. Links and nav are pebble-shaped pills whose organic radii morph. There are no straight-edged boxes, and the only rules are hand-wavy.

STORY: The visitor learns that Ben is a Gather engineer who builds real-time media, native bindings, and game mods. They read the projects, believe the work is real because every one links to code, and click through to a repo or profile.

FIRST VIEWPORT: "Ben Greenier" in pink, about 18vw, across the top left. Under it sits a big first-person bio (about 2.2rem). Pebble links (GitHub, LinkedIn, X) and a "See the projects" pebble sit lower left. The marble fills every pixel behind them. Pointer proximity to any link swirls the veins locally and speeds the flow.

FORM: The user-pinned marble-and-pebble world, outside the roll's list. Seed key 8c3dd0aa (two degraded re-rolls; the user pinned the direction after them). Signature interaction: an energy field. The shader's warp strength and speed ramp toward the nearest focused or hovered interactive element, then decay back to a calm drift. On /projects, hovering a project tints the nearby veins toward that project's hue.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
