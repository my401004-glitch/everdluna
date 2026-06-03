---
name: Cinematic AI Music Academy
colors:
  surface: '#121316'
  surface-dim: '#121316'
  surface-bright: '#38393c'
  surface-container-lowest: '#0d0e11'
  surface-container-low: '#1a1b1e'
  surface-container: '#1e2022'
  surface-container-high: '#292a2d'
  surface-container-highest: '#343538'
  on-surface: '#e3e2e6'
  on-surface-variant: '#e4bdbf'
  inverse-surface: '#e3e2e6'
  inverse-on-surface: '#2f3033'
  outline: '#ab888a'
  outline-variant: '#5b3f41'
  surface-tint: '#ffb2b8'
  primary: '#ffb2b8'
  on-primary: '#67001d'
  primary-container: '#e32652'
  on-primary-container: '#ffffff'
  inverse-primary: '#be003d'
  secondary: '#ffffff'
  on-secondary: '#2c3400'
  secondary-container: '#d0f100'
  on-secondary-container: '#5c6b00'
  tertiary: '#dfc573'
  on-tertiary: '#3c2f00'
  tertiary-container: '#c3aa5a'
  on-tertiary-container: '#4e3e00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdadb'
  primary-fixed-dim: '#ffb2b8'
  on-primary-fixed: '#40000f'
  on-primary-fixed-variant: '#91002c'
  secondary-fixed: '#d0f100'
  secondary-fixed-dim: '#b6d300'
  on-secondary-fixed: '#181e00'
  on-secondary-fixed-variant: '#404c00'
  tertiary-fixed: '#fce18b'
  tertiary-fixed-dim: '#dfc572'
  on-tertiary-fixed: '#231b00'
  on-tertiary-fixed-variant: '#564500'
  background: '#121316'
  on-background: '#e3e2e6'
  surface-variant: '#343538'
  pitch-black: '#000000'
  graphite-base: '#0d0d0e'
  deep-slate: '#272c33'
  subtle-ash: '#191c21'
  silver-mist: '#9ea0a9'
  light-steel: '#d4d5d9'
  pure-white: '#ffffff'
typography:
  display-xl:
    fontFamily: anton
    fontSize: 80px
    fontWeight: '500'
    lineHeight: '0.85'
    letterSpacing: -0.04em
  display-lg:
    fontFamily: anton
    fontSize: 64px
    fontWeight: '500'
    lineHeight: '0.90'
    letterSpacing: -0.02em
  display-serif:
    fontFamily: playfairDisplay
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.10'
  headline-lg:
    fontFamily: inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.45'
  body-md:
    fontFamily: inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.45'
  body-sm:
    fontFamily: inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.45'
  label-caps:
    fontFamily: inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.45'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 64px
  section-gap: 64px
  grid-margin: 24px
  grid-gutter: 16px
---

## Brand & Style

The design system is built for a premium, global AI-powered music education platform. It blends a **Cinematic / Modern** aesthetic with a high-end streaming experience. The mood is deep, focused, and stage-like, utilizing "Pitch Black" and "Charcoal Canvas" to create a sense of focused immersion. 

To emphasize the AI-driven nature of the product, we introduce a **Technical Sophistication** layer. This is achieved through razor-sharp 0px radius inputs, high-contrast "Interactive Lime" accents for data visualizations and AI interactions, and a mix of bold, condensed sans-serif and elegant serif display typefaces. The goal is to evoke the feeling of standing on a world-class stage while having access to a high-tech laboratory of musical discovery.

## Colors

This design system is strictly dark-mode dominant. The palette is designed to maximize contrast and focus on content.

*   **Primary (Action Raspberry):** Used exclusively for high-conversion CTAs and primary branding moments.
*   **Secondary (Interactive Lime):** Represents the "AI" layer. Used for data-driven insights, interactive music widgets, and selected states in technical modules.
*   **Neutral (Charcoal Canvas / Pitch Black):** Forms the backbone of the UI. `Pitch Black` is reserved for the lowest layers (footers, full-bleed sections), while `Charcoal Canvas` acts as the primary background for content consumption.
*   **Pure White:** Used for primary body text to ensure maximum legibility against the dark canvas.

## Typography

The typography hierarchy is designed for dramatic impact.

*   **Display Layers:** Use the condensed sans-serif (Anton as a surrogate for Sohne Schmal) for monumental headlines. Letter-spacing must be tight to maintain the cinematic intensity.
*   **Serif Accents:** Use Playfair Display (as a surrogate for Ivar) for specific editorial moments or "Expert Master" titles to convey authority and heritage.
*   **Functional Layers:** Inter is used for all body, UI labels, and secondary headings, ensuring clarity and a modern, technical feel.
*   **AI Indicators:** Labels associated with AI features should use `label-caps` in `Interactive Lime` for clear differentiation.

## Layout & Spacing

This design system uses a **Fluid Grid** model with a max-width container for content readability.

*   **Grid:** A 12-column grid on desktop, transitioning to 8 columns on tablet and 4 columns on mobile.
*   **Rhythm:** Vertical spacing is generous, using 64px (xl) gaps between major content sections to maintain a premium, unhurried feel.
*   **Carousels:** Horizontal scrolling carousels are preferred for browsing class libraries to mimic streaming platform behavior.
*   **Safe Areas:** Desktop layouts should maintain a 48px padding for cards, while mobile reduces this to 16px to maximize screen real estate.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layers** and **Inset Outlines** rather than traditional drop shadows.

*   **Layering:** Backgrounds sit at Level 0 (Pitch Black). Cards sit at Level 1 (Charcoal Canvas). Elevated modules or active states sit at Level 2 (Deep Slate).
*   **Borders & Outlines:** Instead of ambient shadows, use 1px or 2px inset borders.
    *   *Default Border:* `1px inset #ffffff` (low opacity) or `Deep Slate`.
    *   *Focus/Active Border:* `2px inset #949aa4` (Silver Mist).
*   **Glassmorphism:** Use sparingly for sticky navigation bars with a background blur (32px) and 10% opacity white fill to maintain content context while scrolling.

## Shapes

The shape language is a mix of "Soft" and "Sharp" to reflect the intersection of Art and Technology.

*   **Buttons & Cards:** Use a consistent 8px radius (`rounded-md`).
*   **Badges:** Fully pill-shaped (20px+) to distinguish them from interactive buttons.
*   **Inputs:** Strictly 0px (Sharp). This creates a technical, precise aesthetic for data entry and search.
*   **Media/Images:** Subtle 4px radius on thumbnails to keep them feeling crisp but not aggressive.

## Components

### Buttons
*   **Primary Action:** Action Raspberry (#e32652) background, Pure White text. 8px radius. Use for "Start Learning" or "Join Now."
*   **AI Interactive:** Interactive Lime (#dcff00) background, Pitch Black text. Use for "Generate Practice Track" or "Analyze My Playing."
*   **Ghost Navigation:** Transparent background, 1px Pure White border, 8px radius.

### Input Fields
*   **Technical Style:** 0px radius, transparent background, 1px Pure White border. Text should be Pure White. Focus state uses a 2px inset Silver Mist border.

### Cards
*   **Content Feature:** Deep Slate background, 8px radius, 48px padding. Used for featured lessons.
*   **Instructor Card:** Charcoal Canvas background, 12px radius on the container, with images clipped to 4px radius inside. No padding for full-bleed thumbnail impact.

### Chips & Badges
*   **Category Badges:** Pure White background, Pitch Black text, pill-shaped.
*   **AI Status:** Interactive Lime text, 1px Lime border, no fill, pill-shaped.

### Lists
*   Interactive lists (lesson plans) use Graphite Base background for items with 1px Deep Slate dividers. Hover states shift the background to Subtle Ash.
