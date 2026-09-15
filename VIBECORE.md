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

The v0.2 image mapper works entirely in the browser and offers two deliberate modes:

- **Exact Pixels** preserves the complete attached PNG, JPEG, or WebP as the generated visual source. The output uses the measured source dimensions and aspect ratio, so imagery, logos, text, colour, spacing, and composition stay together instead of being replaced by a generic template.
- **Editable Layout** extracts the reference palette and applies it to registered, reusable VibeCore components.

For both modes the mapper samples pixel data, identifies an accent-first palette, finds strong horizontal and vertical layout guides, records measured regions, and searches for a reliable primary action rectangle. On recognised sign-in references, exact mode aligns functional email/password/submit hit areas with that detected action. The untouched screenshot remains visible until a field is focused, preserving the reference appearance at rest.

Images below the embedded storage threshold are retained byte-for-byte. Larger images are resized and encoded as a storage-safe WebP while keeping their complete composition and aspect ratio. Exact Pixels is therefore a literal image-backed visual match, not a claim that every pixel has been reverse-engineered into an independently editable DOM element. Additional semantic controls can be mapped in later component-specific passes without changing the fidelity layer.

## Extension contract

- Add recipes and components in src/vibecore/catalog.js.
- Add inference, validation, or code-rendering rules in src/vibecore/engine.js.
- Keep each new output target template-only and free of network/model calls.
- Add a smoke-test example for every new recipe, component, rule, or language pack.
- A generated project must build independently before a target can be marked supported.

## Verification

Run npm run test:vibecore, npm run test:backend, and npm run build.

The VibeCore test also materialises a generated React project in a temporary directory and runs its production build.
