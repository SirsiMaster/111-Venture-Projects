# Project Context & Continuation Prompt

## Project Overview
**Name:** Legacy
**Type:** Progressive Web App (PWA)
**Stack:** Vanilla HTML/CSS/JS (No framework)
**Design System:** Custom "Legacy Design" (Skeuomorphic / Glassmorphism)

## Current Status (as of Nov 22, 2025)
We have completed a major UI/UX overhaul to match a high-end, dark-mode "Sirsi" aesthetic.
- **Fixed:** Desktop navigation layout (Flexbox), mobile menu toggle visibility, button class compatibility, and pricing grid responsiveness.
- **Pending:** Final verification of mobile menu animations, testing of the "Guided Path" flow on mobile devices, and deeper testing of the "Automation Console" simulation.

## Recent Updates
- **CSS System:** Added `legacy.css` v6 with Flexbox navigation fixes and backward-compatible button classes (`.btn`, `.btn-primary`, etc.).
- **Layout:** Fixed pricing grid to avoid single-column stretching on desktop (`minmax(300px, 1fr)`).
- **Cache Busting:** Updated all HTML files to reference `legacy.css?v=6`.

## Critical File Contents

### 1. `assets/css/legacy.css` (v6)
*Contains the full design system, including glassmorphism effects, typography scale, and component classes.*

### 2. `assets/js/legacy.js`
*Core application logic including the "Shepherd" state engine, view routing, and data persistence.*

### 3. `assets/js/landing.js`
*Landing page specific interactions: mobile menu toggle, smooth scroll, and intersection observers for animations.*

### 4. `index.html`, `app.html`, `pricing.html`, `about.html`
*Semantic HTML5 structure using the new CSS classes.*

---

## Codebase Context
The project follows a strict file structure:
```
/Legacy
  /assets
    /css/legacy.css
    /js/legacy.js
    /js/landing.js
    /js/mock-data.js
  index.html
  app.html
  pricing.html
  about.html
  manifest.json
  service-worker.js
```

## Next Steps for Development
1. **Mobile Testing:** Verify the "Guided Path" progress ring and task list on small screens.
2. **Automation Console:** Enhance the simulated console logs in `legacy.js` to feel more realistic (random delays).
3. **PWA Features:** Verify offline capability and manifest installation.
