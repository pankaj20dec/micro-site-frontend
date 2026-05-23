---
name: figma-to-code
description: >-
  Implements Figma designs into the FIPO microsite frontend (Next.js 16, React
  19, Tailwind v4). Fetches design context via the Figma MCP, maps tokens and
  components to this repo, and writes production UI. Use when the user invokes
  /figma-to-code or asks to implement, build, or sync a Figma screen, frame, or
  component for this project.
disable-model-invocation: true
---

# Figma → FIPO microsite code

## Design file (default)

Use this file when the user does not pass another Figma link:

**URL:** https://www.figma.com/design/9jDYdYvc5eoOP6jRFhco6Q/Untitled?node-id=0-1

| Field | Value |
|-------|-------|
| `fileKey` | `9jDYdYvc5eoOP6jRFhco6Q` |
| Root `nodeId` | `0:1` (from `node-id=0-1`) |

For a specific frame or component, take `node-id` from the Figma URL (`1-2` → `1:2`) or ask the user which node to implement.

## Prerequisites

- Figma URL optional if implementing from the design file above; otherwise user provides `figma.com/design/...` or file key + node id.
- Figma MCP server (`user-figma`) must be enabled.
- All app code lives under `frontend/`.

## Workflow

Copy and track progress:

```
- [ ] 1. Parse URL → fileKey, nodeId (`-` → `:` in node-id)
- [ ] 2. Fetch design (get_design_context; screenshot if layout is unclear)
- [ ] 3. Map to existing components/tokens (see reference.md)
- [ ] 4. Implement in frontend/src — reuse before creating
- [ ] 5. Verify: lint, visual parity, responsive behavior
```

### Step 1: Parse Figma URL

| URL pattern | Use |
|-------------|-----|
| `figma.com/design/:fileKey/:name?node-id=1-2` | `fileKey`, `nodeId` = `1:2` |
| Branch URL with `/branch/:branchKey/` | Use `branchKey` as `fileKey` |

Read MCP tool schemas under `mcps/user-figma/tools/` before calling.

### Step 2: Fetch design

1. Call `get_design_context` with `fileKey` and `nodeId`.
2. Treat MCP output as **reference only** — not paste-ready production code.
3. If Code Connect mappings exist, prefer mapped codebase components.
4. Call `get_screenshot` when spacing, alignment, or breakpoints are ambiguous.

### Step 3: Adapt to this project

**Do**

- Work in `frontend/src` with `@/` imports.
- Use Tailwind utility classes; extend `frontend/src/app/globals.css` `@theme` only when a token repeats across files.
- Map Figma colors to `brand` in `frontend/src/lib/brand.ts` (add there if new brand color).
- Use `font-sans` (Montserrat) for body; `font-top-heading` / `topHeadingFontClassName` for primary section titles (Poppins 700, `#22313F`).
- Compose sections with `Section`, `Container`, `SectionHeading`, `ButtonLink`, etc. — see [reference.md](reference.md).
- Use `cn()` from `@/lib/cn` for conditional classes.
- Put reusable sections and page blocks in `frontend/src/components/common/`; atomic primitives in `frontend/src/components/ui/`.
- Read `frontend/AGENTS.md` and relevant `node_modules/next/dist/docs/` before using Next.js APIs (this repo uses Next.js 16 with breaking changes).

**Do not**

- Copy absolute positioning stacks from Figma export as-is; use flex/grid and responsive spacing.
- Introduce new UI libraries or CSS-in-JS unless the user explicitly requests it.
- Duplicate components that already exist in `frontend/src/components/ui/`.
- Edit unrelated sections while implementing one frame.

### Step 4: Implement

| Task | Typical location |
|------|------------------|
| New section (any page) | `frontend/src/components/common/<Name>Section.tsx`, wire in page composer (e.g. `HomePage.tsx`) |
| Shared primitive | `frontend/src/components/ui/`, export from `ui/index.ts` |
| New route/page | `frontend/src/app/<route>/page.tsx` |
| Static assets from Figma | `frontend/public/` (prefer existing assets when names match) |

Match existing patterns: semantic HTML, `scroll-mt-*` on in-page anchors, `border-neutral-200/80` section dividers, uppercase CTA labels on buttons.

### Step 5: Verify

```bash
cd frontend && npm run lint
```

Manually compare against the Figma screenshot at `sm`, `lg`, and full width. Fix overflow, line-height, and image aspect ratio before finishing.

## Output

When done, briefly report:

1. Figma node implemented
2. Files created/changed
3. Components reused vs newly added
4. Any design gaps (missing assets, ambiguous states) needing designer input

## Additional resources

- Component inventory, tokens, and file layout: [reference.md](reference.md)
