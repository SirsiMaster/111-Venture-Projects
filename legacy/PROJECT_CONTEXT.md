# Project Context & Continuation Prompt

## Project Overview
**Name:** Legacy
**Type:** Progressive Web App (PWA)
**Stack:** Vanilla HTML/CSS/JS (No framework)
**Design System:** Custom "Legacy Design" (Skeuomorphic / Glassmorphism)

## Current Status (as of Nov 22, 2025)
We have completed a major UI/UX overhaul to match a high-end, dark-mode "Sirsi" aesthetic.
- **Fixed:** Desktop navigation layout (Flexbox), mobile menu toggle visibility, button class compatibility, and pricing grid responsiveness.
- **Polished:** Mobile responsiveness for "Guided Path" and "Automation Console" simulation realism.
- **Verified:** PWA manifest and service worker configuration.

## Recent Updates
- **JS Logic:** Updated `simulateAutomation` in `legacy.js` to use random variable delays for a more organic, "thinking" server feel.
- **CSS System:** Added `.guided-hero`, `.guided-progress-ring`, and `.console-log` styles to `legacy.css` to ensure proper mobile rendering.
- **PWA:** Updated `manifest.json` theme colors to `#050507` (Dark Mode) and fixed `service-worker.js` asset list.

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
1. **Document Management:** Implement a drag-and-drop zone for the "Documents" view in `app.html` to make it feel more interactive (even if just a simulation).
2. **Contact Validation:** Add basic form validation to the "Add Contact" modal (e.g., check email format).
3. **Settings View:** Expand the "Settings" view to include a mock "Notification Preferences" toggle list.
