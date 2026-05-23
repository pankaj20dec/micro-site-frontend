# FIPO microsite — implementation reference

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (`frontend/`) |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"` in `globals.css`) |
| Fonts | Montserrat (body), Poppins (headings via `--font-top-heading`) |

## Brand tokens (`frontend/src/lib/brand.ts`)

| Token | Hex | Typical use |
|-------|-----|---------------|
| `purple` | `#7D2E7E` | Primary brand, CTAs |
| `purpleDark` | `#5c245c` | Hover / emphasis |
| `lavender` | `#f3eef6` | Tinted panels |
| `mutedStrip` | `#f4f4f5` | Alternate section bg |
| `accentBlue` | `#7FB3D5` | Harcus Parker accent |
| `divider` | `#D1D1D1` | Header divider |

Figma fills often map to `brand.*` or Tailwind `neutral-*` / `text-[#22313F]` for headings.

## Typography helpers (`frontend/src/lib/bandSectionTitle.ts`)

- `topHeadingFontClassName` — Poppins 700, `#22313F`, under section titles
- `bandSectionTitleClassName` — centered band headings (Fighting, About, …)

## UI primitives (`frontend/src/components/ui/`)

| Component | Use for |
|-----------|---------|
| `Section` | Vertical section wrapper + padding |
| `Container` | Max-width content column |
| `SectionHeading` | Titled blocks (`variant`: section, subsection, display, compact) |
| `ButtonLink` | CTAs (`primary` / `outline` / `inverse`, sizes `sm`/`md`/`lg`) |
| `TextLink` | Inline text links |
| `Panel` | Bordered content panels |
| `FeatureCard` | Icon + title + body cards |
| `TwoColumn` | Side-by-side layouts |
| `MediaFrame` | Images / media with consistent framing |
| `DataTable` | Tabular data |
| `AccentRule` | Decorative accent line |
| `IconCircle` / `IconStepTile` | Step / feature icons |
| `icons.tsx` | Shared SVG icons (`IconUserPlus`, `IconSealCheck`, …) |

Import from `@/components/ui` unless tree-shaking a single file matters.

## Common sections (`frontend/src/components/common/`)

Reusable page sections — import from `@/components/common/`. Home page order in `HomePage.tsx`:

1. `HeroSection` / `HeroSlider`
2. `FightingSection`
3. `ActionJoinSection`
4. `AboutSection`
5. `ClaimSection`
6. `StepsSection`
7. `FeesSection`
8. `FaqTeaserSection`

Layout chrome: `Header`, `Footer` under `frontend/src/components/layout/`.

## Layout conventions

- Page shell: `layout.tsx` sets `Header` + flex column; pages use `bg-white text-neutral-800`.
- Sections: `Section` + `Container`; grids use `lg:grid-cols-*` breakpoints.
- Section backgrounds: white, `bg-[#F8F9FA]`, or `brand.lavender` / `brand.mutedStrip` via `style` or class.
- Buttons: uppercase, wide tracking (`ButtonLink` defaults).
- Anchors: `id` + `scroll-mt-20` for in-page nav targets.

## Figma → code mapping cheatsheet

| Figma | Code |
|-------|------|
| Auto-layout row/column | `flex` / `grid` + `gap-*` |
| Fixed frame width | `Container` max + responsive padding |
| Purple CTA | `ButtonLink variant="primary"` |
| Outlined button | `ButtonLink variant="outline"` |
| H1/H2 display | `SectionHeading` or `bandSectionTitleClassName` |
| Body 16 Regular | `text-base` + `font-sans` |
| Card with icon | `FeatureCard` or `IconStepTile` pattern in `ActionJoinSection` |

## Images and icons

- Prefer reusing icons from `frontend/src/components/ui/icons.tsx`.
- New simple icons: add to `icons.tsx` as inline SVG (match existing `viewBox` / stroke style).
- Raster exports: `frontend/public/` with descriptive names; use `next/image` where appropriate.
