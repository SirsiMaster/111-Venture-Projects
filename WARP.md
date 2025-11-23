# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
"Legacy" is a Progressive Web App (PWA) for 111 Venture Studio, built with vanilla HTML/CSS/JS. The project implements a "Sirsi" design system with a skeuomorphic/glassmorphism aesthetic.

All project files are located in the `legacy/` subdirectory.

## Development Workflow

### Running the Application
Because the project relies on static files, no build step is required. You can serve the application locally using Python.

1.  **Start Server:**
    ```bash
    python3 -m http.server -d legacy 8000
    ```
2.  **Access App:**
    - Marketing Site: [http://localhost:8000/index.html](http://localhost:8000/index.html)
    - App Console: [http://localhost:8000/app.html](http://localhost:8000/app.html)

### Testing
- Testing is currently manual. Verify responsiveness on mobile and desktop views.
- Check PWA functionality (manifest, service worker) using browser DevTools (Application tab).

## Architecture & Code Structure

### Directory Structure
The root project logic resides in `legacy/`:
- **HTML**: `index.html` (Landing), `app.html` (Main App), `pricing.html`, `about.html`.
- **Assets**: `legacy/assets/` contains all styles, scripts, and images.

### Key Components
#### CSS (`legacy/assets/css/`)
- `legacy.css`: The single source of truth for the design system.
  - Uses CSS variables for colors/fonts.
  - Implements BEM-like naming.
  - Contains media queries for responsiveness.

#### JavaScript (`legacy/assets/js/`)
- `legacy.js`: Core application logic.
  - Handles routing, authentication simulation, and state management.
  - Contains the "Shepherd" engine for task automation simulation.
- `landing.js`: Interactions for the marketing/landing pages (scroll effects, mobile menu).
- `mock-data.js`: Seed data for the application state.

#### PWA
- `manifest.json`: Configuration for app installability.
- `service-worker.js`: Handles offline capabilities and caching.

## Rules & Guidelines

### Coding Standards
- **Vanilla Stack**: Do not introduce build tools (Webpack, Vite) or frameworks (React, Vue) unless explicitly requested. Keep it simple HTML/CSS/JS.
- **Design Consistency**: Always reuse classes from `legacy.css`. Do not use inline styles unless necessary for dynamic values (e.g., progress bars).
- **Cache Busting**: When making significant CSS changes, update the version query string in HTML files (e.g., `<link href="assets/css/legacy.css?v=6">` to `?v=7`).

### Interaction Rules
- **Links**: Always provide a localhost link to the relevant page after completing a task.
- **Code Formatting**: Ensure all code blocks in responses include the file path and start line.
