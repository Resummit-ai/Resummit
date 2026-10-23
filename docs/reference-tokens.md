# Reference Tokens Specification

Extracted directly from `docs/reference-tokens.json`.

---

## 1. Font Families & Weights Actually Loaded
- **Primary Sans**: `Inter`
  - Loaded weights: `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold)
  - CSS Fallback stack: `var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Monospace**: `Geist Mono`
  - Loaded weights: `400` (Regular), `500` (Medium), `600` (SemiBold)
  - CSS Fallback stack: `"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`

---

## 2. Color Palette

### Base Surfaces & Canvas
- **`--ink` (Background Canvas)**: `rgb(10, 10, 10)` (`#0a0a0a`)
- **`--paper` (Base Foreground / Text)**: `rgb(242, 239, 233)` (`#f2efe9`)
- **Page Surface**: `#09090b` / `#0b0b0c` / `#161618`
- **Card Background**: `rgba(255, 255, 255, 0.03)` with `backdrop-filter: blur(12px)`
- **Pill / Button Secondary Surface**: `rgba(255, 255, 255, 0.05)` (`bg-white/5`)
- **Hover Surface**: `rgba(255, 255, 255, 0.1)` (`hover:bg-white/10`)

### Text Shades (Opacity over `--paper`)
- **High-contrast Headings / Accents**: `rgb(242, 239, 233)` (`100%`)
- **Pill / Sub-headings**: `rgba(242, 239, 233, 0.8)` (`80%`)
- **Body Text**: `rgba(242, 239, 233, 0.7)` (`70%`)
- **Muted Review / Footnotes**: `rgba(242, 239, 233, 0.6)` (`60%`)
- **Dimmed Nav Links**: `rgba(242, 239, 233, 0.45)` (`45%`)
- **Neutral Muted**: `oklch(0.556 0 0)` (`#8e8e93`)

### Borders & Rings
- **Translucent White Border**: `1px solid rgba(255, 255, 255, 0.1)` (`inset-ring-white/10`)
- **Subtle White Border**: `1px solid rgba(255, 255, 255, 0.06)`
- **Dark Neutral Border**: `rgb(39, 39, 42)` (`#27272a`)
- **Inner Ring**: `inset 0 0 0 1px rgba(255, 255, 255, 0.1)`

### Accents & Indicators
- **Primary CTA Dark Contrast**: `oklch(0.145 0 0)` / `rgb(20, 20, 20)`
- **Sky Indicator**: `oklch(0.5 0.134 242.749)` (`#0284c7` / `text-sky-700`)
- **Emerald Live Dot**: `oklch(0.432 0.095 166.913)` (`#059669`)
- **Resummit Blue Accent**: `#2563eb` with glow `rgba(37, 99, 235, 0.25)`

---

## 3. Type Scale

| Element | Font | Size (`px` / `rem`) | Line Height | Letter Spacing | Weight | Color |
|---|---|---|---|---|---|---|
| **H1** | Inter | `48px` (sm: `60px`, lg: `72px`) | `48px` (desktop: `1`) | `-1.2px` (`-0.025em`) | `500` (Medium) | `rgb(242, 239, 233)` |
| **H2** | Inter | `36px` (sm: `48px`) | `40px` (desktop: `48px`) | `-0.9px` (`-0.025em`) | `500` (Medium) | `rgb(242, 239, 233)` |
| **H3** | Inter | `24px` | `32px` | `-0.6px` | `600` (SemiBold) | `rgb(242, 239, 233)` |
| **H3 (Mono)**| Geist Mono | `18px` | `28px` | `-0.45px` | `500` (Medium) | `rgb(242, 239, 233)` |
| **Body (Hero)**| Inter | `16px` (sm: `18px`) | `24px` | `normal` | `400` (Regular) | `rgba(242, 239, 233, 0.7)` |
| **Pill** | Inter | `14px` | `20px` | `normal` | `400` (Regular) | `rgba(242, 239, 233, 0.8)` |
| **CTA Primary**| Inter | `14px` | `20px` | `normal` | `500` (Medium) | `rgb(20, 20, 20)` |
| **CTA Secondary**| Inter | `14px` | `20px` | `normal` | `500` (Medium) | `rgb(242, 239, 233)` |
| **Eyebrow** | Inter | `12px` | `16px` | `normal` | `500` (Medium) | `oklch(0.5 0.134 242.749)` |
| **Footnote / Small**| Inter | `13px` / `14px` | `19.5px` / `20px`| `normal` | `400` (Regular) | `rgba(242, 239, 233, 0.6)` |

---

## 4. Radii & Spacing

- **Pills & Buttons**: `9999px` (`rounded-full` / `2.68435e+07px`)
- **Cards**: `16px` (`rounded-2xl` / `1rem`)
- **Inner Badges / Controls**: `8px` (`rounded-lg` / `0.5rem`)
- **Navbar**: `max-w-7xl` (`1280px`), `h-16` (`64px`), `px-6` (`24px`)
- **Sections**: `py-24 sm:py-32` (`96px` to `128px`), `px-6`
- **Max Content Widths**:
  - H1 max-width: `max-w-[20ch]` (`~620px`)
  - Hero body max-width: `max-w-[48ch]` (`~485px`)
  - H2 max-width: `max-w-[24ch]` (`~558px`)

---

## 5. Shadows, Borders & Backdrop Filters
- **Pill Inset Ring**: `inset 0 0 0 1px rgba(255, 255, 255, 0.1)`
- **Glass Backdrop Blur**: `backdrop-blur-sm` (`8px`) or `backdrop-blur-md` (`12px`)
- **Card Shadow**: `0 0 0 1px rgba(255, 255, 255, 0.08), 0 20px 70px -15px rgba(0, 0, 0, 0.6)`
- **Button Hover Shadow**: `0 0 6px 0 rgba(255, 255, 255, 0.2), inset 0 0.5px 0 0 rgba(255, 255, 255, 0.1)`

---

## 6. Keyframes
- **`spotlight`**:
  ```css
  @keyframes spotlight {
    0% { opacity: 0; transform: translate(-72%, -62%) scale(0.5); }
    100% { opacity: 1; transform: translate(-50%, -40%) scale(1); }
  }
  ```
- **`scroll`** (Marquee):
  ```css
  @keyframes scroll {
    100% { transform: translate(calc(-50% - 0.5rem)); }
  }
  ```
- **`meteor`**:
  ```css
  @keyframes meteor {
    0% { opacity: 1; transform: rotate(215deg) translate(0px); }
    70% { opacity: 1; }
    100% { opacity: 0; transform: rotate(215deg) translate(-500px); }
  }
  ```
- **`accordion-down` / `accordion-up`**:
  Height transitions using `--radix-accordion-content-height`.
