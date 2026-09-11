# DESIGN.md

Branding rules for the payments demo. Terse by intent. Apply verbatim.

The demo is a Tailwind UI storefront whose job is to showcase the payments SDK, not the
brand. Brand work stays inside the surfaces named here. Adapted from the customer-portal
`DESIGN.md`; other Credova design system rules do not apply here on the demo site.

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

- Only render the approved artwork. Never typeset "credova" in a text font as a logo
  stand-in.
- Colorways: white on dark, `#004059` teal on light. No other fills. The header and footer
  sit on dark surfaces, so they use white.
- Wordmark aspect ratio is 177×34. Components size it with a fixed height and `w-auto`
  (`h-5` in the header, `h-10` in the footer). Don't stretch, restyle, or recolor.
- Clear space ≥ 16px on all sides.

| File                         | Artwork                            |
| ---------------------------- | ---------------------------------- |
| `public/logo-white.svg`      | Wordmark, white, for dark surfaces |
| `public/logo-dark.svg`       | Wordmark, `#004059`, for light     |
| `public/logo-mark-white.svg` | Mark only, white, for dark         |

Paths come from Figma Logo & Brand (wordmark node `267:53556`, mark node `267:53585`).
Keep the file names stable so `config.ts` needs no edit when artwork changes.

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

The manifest omits `start_url` and `display`, so the demo is not installable. It exists
only so Android gets a proper home-screen icon. Don't add `theme_color` or
`background_color` without also deciding the install story.

---

## Color

Theme colors are literals in `config.ts` (`theme.colors`), mapped into Tailwind by
`tailwind.config.ts`: `primary`, `primary-dark`, and `navbar`. Use the tokens, never hex
literals in components.

On the dark `navbar` surface, text is white in every state. Hover dims to `gray-300`, and
the open or selected state is shown by a white underline, not a text color change.
`primary-dark` is a light-surface color: use it for text and underlines only on white
(mobile menu tabs, buttons, form controls).

---

## Typography

The demo ships Inter via `next/font/google` in `src/app/layout.tsx`. Swap the loader in
one place; no per-component font overrides.
