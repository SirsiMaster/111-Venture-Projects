# Changelog

All notable changes to the "Legacy" project will be documented in this file.

## [v3.1.0] - 2025-11-24
### Major Redesign: Monumental Art Deco
- **Theme:** Complete visual overhaul to "Monumental Art Deco" aesthetic using Royal Blue (`#003cff`), Deep Night Blue, and Metallic Gold (`#D4AF37`) palette.
- **Architecture:** Created new version set (`legacy-v2.html`, `legacy-v3.css`, `legacy-v2.js`) to isolate changes.
- **Layout:** 
  - Tightened desktop section spacing (reduced padding to `3rem`).
  - Switched Metric Strip to Flexbox to fix alignment and borders.
  - Stabilized Navigation Bar (removed scroll animation for instant visibility).
- **Content:** Restored "500-Hour Problem", "From Chaos to Closure", and "Bank-Grade Security" sections with full copy.
- **Typography:** Introduced classical serif stack (Cinzel, Cormorant Garamond, Lora) for high-editorial feel.
- **Fixes:**
  - Repaired HTML attribute syntax errors.
  - Implemented cache busting (`v=3.1`).
  - Enhanced readability on hero images with gradient overlays.
### Polished
- **Automation Console:** Updated `legacy.js` to simulate variable network latency (300ms-1200ms) for a realistic "concierge" experience.
- **Mobile UI:** Added `.guided-hero` and responsive progress ring styles to `legacy.css` to prevent overflow on small screens.
- **PWA:** Updated `manifest.json` theme to `#050507` and cleaned up `service-worker.js` cache list.

## [v1.5.1] - 2025-11-22
### Fixed
- **Navigation Layout:** Added `display: flex` to `.nav-container` and `.nav-menu` in `legacy.css` to fix vertical stacking issues on desktop.
- **Mobile Menu Button:** Explicitly hid `.mobile-menu-btn` on desktop viewports to prevent double controls.
- **Button Styles:** Added backward-compatible `.btn`, `.btn-primary`, `.btn-secondary` classes to `legacy.css` to match HTML usage and apply premium "molten" styling.
- **Pricing Grid:** Adjusted `grid-template-columns` to `minmax(300px, 1fr)` to prevent pricing cards from stretching full-width on standard laptops.
- **Cache Busting:** Bumped CSS version to `v=6` across `index.html`, `about.html`, `pricing.html`, and `app.html`.

## [v1.5.0] - Visual Overhaul
### Added
- **Skeuomorphic Design System:** Complete rewrite of `legacy.css` to implement high-end glassmorphism and 3D lighting effects.
- **New Sections:** Added Problem Agitation, Visual Journey, Security Deep Dive, and Metrics Strip to `index.html`.
- **Animations:** Implemented scroll-triggered fade-ins and number counters in `landing.js`.

### Changed
- **Typography:** Upscaled all font sizes using a new fluid type scale (SF Pro Display).
- **Spacing:** Doubled whitespace throughout the app for a "luxury" feel.
- **Colors:** Switched to a deep black/navy base (`#050507`) with neon iOS-style accents.

## [v1.0.0] - Initial PWA
### Added
- Core application logic in `legacy.js` (State management, Routing).
- "Shepherd" engine for guided end-of-life tasks.
- Basic PWA manifest and service worker.
- Mock data generation.
