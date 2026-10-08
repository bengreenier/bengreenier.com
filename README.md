# bengreenier.com

Ben Greenier's personal site: [Astro](https://astro.build) + TypeScript, built as a static site and deployed to GitHub Pages.

```sh
npm install
npm run dev      # local dev server
npm run build    # astro check + static build to dist/
```

- Projects and links live in `src/data/site.ts`.
- The live marble background is a WebGL shader in `src/scripts/marble.ts`. Elements marked `data-energy` make it react when you get near them.
- Design rules: `DESIGN.md`. Product context: `PRODUCT.md`.
