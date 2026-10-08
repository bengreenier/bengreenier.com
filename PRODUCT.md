# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro + TypeScript, static output, deployed to GitHub Pages at the custom domain `bengreenier.com` (`CNAME`).

## Users

A personal-first audience: people who want to know who Ben Greenier is, usually arriving from GitHub, a package README, a talk, or a social profile. They are mostly other engineers and the occasional recruiter or collaborator. They want to answer "who is this, what do they build, and where do I find them?" in under a minute.

## Product Purpose

Ben's personal home on the web. It says who he is now and shows a curated set of side projects that make his interests concrete. It points to where he's active. Success means a visitor leaves knowing his focus (TypeScript, C++, Rust; real-time media and native tooling; games and mods) and clicks through to a project or profile.

## Positioning

A working engineer's hacker portfolio. It is not a resume or a marketing page. The projects are real, shipped open-source work that spans browser APIs, native Rust/C++ bindings, and game mods. That spread is the point.

## Operating Context

- Visitors land on `/` most of the time. `/projects` is the second stop.
- They read on phones and desktops in about equal measure, and they often arrive by tapping a link from GitHub or social.
- There is no backend, no forms, and no analytics requirement.

## Capabilities and Constraints

- Pages: `/` (bio and links) and `/projects` (curated projects).
- The old `/hire` page and `crypto.txt` are being removed. Their URLs are not preserved.
- Content lives in typed data files so projects can be added without touching layout.
- It must build to fully static HTML. Client JS is optional and minimal.

## Brand Commitments

- Name: **Ben Greenier**. Domain: bengreenier.com.
- Voice: casual, first person, a little playful, and plain-spoken. The old site used lines like "I make awesome things", and that warmth stays.
- Never use the phrase "knee-deep" (or "knee deep") anywhere. Ben vetoed it.
- Visual direction requested by Ben: **bold & playful**. Ben has vetoed pink and rounded shapes.

## Evidence on Hand

Confirmed facts:
- Role: Senior Software Engineer at Gather. Languages: TypeScript, C++, Rust. Always hacking on side projects.
- Links: GitHub `github.com/bengreenier`, LinkedIn, and X `@bengreenier`.

Featured projects, all public repos under `github.com/bengreenier/`:
- **sobx**: a compile-time, MobX-compatible observable runtime, with bundler plugins (alpha)
- **react-user-media**: React hooks and components for getUserMedia and getDisplayMedia
- **trpc-webrtc**: tRPC adapters for type-safe calls over RTCDataChannel
- **napi-audio**: a native (Rust) audio decoding stack for NAPI-compatible JS runtimes
- **partially**: a Rust derive macro that generates Option-wrapped partial structs
- **win_event_hook**: a safe Rust API for Win32 `SetWinEventHook`
- **csii-mods**: Cities: Skylines II mods, including BetterAssetMenu
- **vscode-node-readme**: a VS Code extension for in-editor JS module docs, with 40k+ installs

Do not fabricate: star counts, download numbers beyond the "40k+ installs" Ben stated previously, employers other than Gather, testimonials, or a photo. No portrait asset exists.

## Product Principles

1. Lead with who Ben is, then let the projects do the talking.
2. Every project card links to real code. No vaporware.
3. Personality over polish-for-its-own-sake, but it has to be fast and readable.
4. Easy to update: adding a project is a data edit.
