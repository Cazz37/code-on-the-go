# VibeCore Blueprint Engine

VibeCore is the deterministic builder inside Code On The Go. It converts a guided brief into a versioned blueprint, validates that blueprint, and renders project files from reviewed templates. The VibeCore path does not call an AI or external generation service.

## Current pipeline

1. Read the project name, brief, chosen recipe, target, style, navigation, and components.
2. Match keywords against the registered app recipes and component catalogue.
3. Choose a supported code target:
   - React + Vite PWA for app-like dashboards, stores, and booking flows.
   - HTML + CSS + JavaScript for static landing and portfolio sites.
4. Create a versioned vibecore.blueprint.json.
5. Apply structure, target, contrast, form-label, and responsive-layout rules.
6. Render code, design tokens, a PWA manifest/configuration, documentation, and a standalone preview.
7. Place every generated file into the existing Code On The Go workspace.

Given the same inputs, the blueprint and generated file contents are identical. Only the build timestamp changes.

## Registered UI components

| Component | Rule-backed behaviour |
| --- | --- |
| Header | Brand identity and primary action |
| Hero | Clear headline, summary, and actions |
| Stats | Responsive metric cards |
| Search | Labelled search/filter control |
| Cards | Responsive reusable content grid |
| Form | Visible labels, required fields, and submit handling |
| Table | Semantic headings and mobile-safe overflow |
| Navigation | Top, bottom, or single-page variants with large touch targets |

## Reference-image support

The first image mapper works entirely in the browser. It:

- reads PNG, JPEG, and WebP files up to 5 MB;
- samples and groups pixels to find a small dominant-colour palette;
- can apply that palette to generated design tokens; and
- provides an adjustable reference overlay above the live preview.

It does not yet detect exact regions, fonts, spacing, or individual components. Those belong to the next deterministic image-mapper layer and are deliberately not described as pixel-perfect today.

## Extension contract

- Add recipes and components in src/vibecore/catalog.js.
- Add inference, validation, or code-rendering rules in src/vibecore/engine.js.
- Keep each new output target template-only and free of network/model calls.
- Add a smoke-test example for every new recipe, component, rule, or language pack.
- A generated project must build independently before a target can be marked supported.

## Verification

Run npm run test:vibecore, npm run test:backend, and npm run build.

The VibeCore test also materialises a generated React project in a temporary directory and runs its production build.
