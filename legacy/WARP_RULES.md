# Warp Rules

These are the project-specific and user-preference rules for the "Legacy" project environment.

## User Preferences
1. **Output Links:** Always provide a link to the app or page once a task is completed so the user can go directly to it.
2. **Formatting:** Code blocks must include file paths and start lines.
3. **Tone:** Concise, direct, and professional. No filler text.

## Project Rules
1. **Design System:** All UI changes must use `assets/css/legacy.css`. Do not use inline styles unless absolutely necessary for dynamic values (like progress bars).
2. **JS Architecture:**
   - `legacy.js`: Handles App logic (Auth, State, Rendering).
   - `landing.js`: Handles Marketing site logic (Scroll, Nav, Animations).
   - `mock-data.js`: Contains the seed data for the application.
3. **CSS Methodology:**
   - Use BEM-like naming where possible.
   - Use CSS variables for all colors, spacing, and fonts.
   - Mobile-first media queries are preferred, though the current system uses desktop-first overrides in some places (be consistent with existing patterns).
4. **Version Control:**
   - Bump CSS version query strings (`?v=X`) in HTML files when making significant CSS changes to defeat browser caching.
