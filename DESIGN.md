# DESIGN.md

Branding rules for the payments demo. Terse by intent. Apply verbatim.

The demo is a Tailwind UI storefront whose job is to showcase the payments SDK, not the
brand. Rebrand work stays inside the branding surfaces named here and never reshapes
layout. Adapted from the customer-portal `DESIGN.md`; the portal's component rules
(alerts, radius, elevation, motion) do not apply here.

---

## Brand sources

- Identity guidebook (Corebook): [Logo](https://my.corebook.io/CredovaBrand/brand-overview/logo) ·
  [Colors](https://my.corebook.io/CredovaBrand/brand-overview/colors) ·
  [Typography](https://my.corebook.io/CredovaBrand/brand-overview/typography)
- Figma "Credova Design System":
  [Logo & Brand](https://www.figma.com/design/BOlCXEY23hwwthD9FdGfp8/Credova-Design-System?node-id=1-194) ·
  [Color](https://www.figma.com/design/BOlCXEY23hwwthD9FdGfp8/Credova-Design-System?node-id=2-56911) ·
  [Typography](https://www.figma.com/design/BOlCXEY23hwwthD9FdGfp8/Credova-Design-System?node-id=2-57676)

---

## Branding surfaces

Every brand-bearing value lives in `config.ts`. Components read it; they never hardcode a
brand string or asset path.

| Key         | Value                           | Rendered by                       |
| ----------- | ------------------------------- | --------------------------------- |
| `seoTitle`  | `Credova Shop`                  | `<title>` in `src/app/layout.tsx` |
| `trademark` | `Credova. All rights reserved.` | Footer copyright line             |
| `logo`      | `/logo-white.svg`               | Header (lg+) and footer wordmark  |
| `logoMark`  | `/logo-mark-white.svg`          | Header mark below `lg`            |

The footer renders `© {current year} {trademark}`, so the visible string is
"© 2026 Credova. All rights reserved." and the year rolls over on its own.

Outside `config.ts`, the only brand text is accessible-name copy (`alt`, `sr-only`) and
the metadata description in `src/app/layout.tsx`. Those say "Credova".

---

## Logo

Rules from the guidebook Logo page and Figma Logo & Brand:

- Only render the approved artwork in `public/`. Never typeset "credova" in a text font
  as a logo stand-in.
- Colorways: white on dark (`logo-white.svg`, `logo-mark-white.svg`), `#004059` teal on
  light (`logo-dark.svg`). No other fills. The header and footer sit on dark surfaces, so
  they use white.
- Wordmark aspect ratio is 177×34. Components size it with a fixed height and `w-auto`
  (`h-5` in the header, `h-10` in the footer). Don't stretch, restyle, or recolor.
- Clear space ≥ 16px on all sides.

Assets are generated, not hand-edited. `scripts/gen-logos.sh` embeds the paths exported
from Figma node `267:53556` (wordmark) and `267:53585` (mark) and writes all three files.
Re-run it if the Figma artwork changes, and keep the file names stable so `config.ts`
needs no edit.

---

## Favicon

Same icon set as developer-center and the customer portal: the white mark on a `#004059`
square. Next.js App Router picks these up by file name, so there is no `<link>` markup to
maintain.

| File                          | Role                                                      |
| ----------------------------- | --------------------------------------------------------- |
| `src/app/icon.svg`            | Primary icon. Mark at 75% so the C stays legible at 16px. |
| `src/app/favicon.ico`         | Single 32×32 entry. Legacy fallback only.                 |
| `src/app/apple-icon.png`      | 180×180. iOS has no SVG icon support.                     |
| `src/app/manifest.ts`         | `name` + `icons` only, name read from `config.seoTitle`.  |
| `public/icon-192.png`, `-512` | Manifest icons, `any` and `maskable`. Mark at 63%.        |

The manifest deliberately omits `start_url` and `display`, so the demo is not installable.
It exists only so Android gets a proper home-screen icon. Don't add `theme_color` or
`background_color` without also deciding the install story.

---

## Color

The demo's theme colors are literals in `config.ts` (`theme.colors`), mapped into
Tailwind by `tailwind.config.ts`. They are still Tailwind UI indigo and a gray-900 navbar.

| Token          | Current   | Brand target           |
| -------------- | --------- | ---------------------- |
| `primary`      | `#4f46e5` | `#004059` Primary Teal |
| `primary-dark` | `#4338ca` | `#002E40` Primary Dark |
| `navbar`       | `#111827` | `#004059` or keep dark |

The swap is deliberately not part of the logo rebrand. `primary-dark` is also used as the
active-tab text color on the dark navbar, so moving it to `#002E40` needs a contrast pass
on `TopNav.tsx` first. Tracked under [Pending implementation](#pending-implementation).

---

## Typography

The demo ships Inter via `next/font/google` in `src/app/layout.tsx`. The guidebook
specifies Matter SQ, which is unlicensed here, so Inter stays until a license lands. Swap
the loader in one place; no per-component font overrides.

---

## Verify

```bash
rg -i "publicsquare|public square" src config.ts   # → SDK imports and API env vars only
rg "tailwindui" src next.config.mjs                  # → none
rg -n "logo" src config.ts                           # → config.ts keys and their two readers
```

The first sweep is expected to hit `@publicsquare/elements-react` imports and
`NEXT_PUBLIC_PUBLICSQUARE_*` env names. Those are the payments API's product name, not
storefront branding, and stay as they are.

---

## Pending implementation

- Theme colors: move `primary` / `primary-dark` / `navbar` in `config.ts` to the brand
  values above after checking `TopNav.tsx` active-state contrast.
- Font: Inter stays the shipping face until Matter SQ is licensed.
- Footer tagline and link columns are Tailwind UI placeholder copy, not brand copy.
  Replace only if the demo grows a real footer.
