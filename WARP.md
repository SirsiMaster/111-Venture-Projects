# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
**Legacy v1** is a single-page marketing site for "The Estate Operating System" - an end-of-life estate management platform. The site is deployed via GitHub Pages.

**Design Aesthetic: "Opulent, Permanent, Guardian-Like"**
- Deep Royal Blue Gradient background (NOT black)
- Solid Metallic Gold (`#D4AF37`) buttons with hover brightening (NO gradients on buttons)
- High-contrast text (`text-gray-100` or white)
- Compact footer (`py-8`)
- "Alive UI" with green pulse dots on cards
- Tech borders/glowing frames
- `bg-grain` film overlay for texture

## File Structure
```
Legacy/
├── index.html      # The single-page site (GitHub Pages entry point)
├── README.md       # Project readme
├── WARP.md         # This file
├── .nojekyll       # Disables Jekyll processing
└── .gitignore
```

## Development Workflow

### Local Preview
```bash
cd "/Users/thekryptodragon/Development/111 Venture Studio/Legacy"
python3 -m http.server 8000
```
Then visit: http://localhost:8000

### Deployment
The site is deployed automatically via GitHub Pages from the `main` branch.

## Design Tokens (CSS Variables)
```css
--color-gold: #D4AF37;
--color-gold-bright: #FCD34D;
--color-blue-deep: #0f172a;
--color-blue-royal: #1e3a8a;
--glass-surface: rgba(15, 23, 42, 0.85);
--glass-border: rgba(255, 255, 255, 0.15);
```

## Typography
- **Headings**: `Cinzel` (serif, uppercase tracking)
- **Body**: `Inter` (sans-serif)

## Key Components
- `.btn-legacy` - Gold solid button with hover glow
- `.glass-panel` - Frosted glass surface
- `.active-card` - Card with gold hover border and tech line decorator
- `.status-dot` - Green pulsing "alive" indicator
- `.bg-grain` - Film grain texture overlay

## Rules & Guidelines

### DO
- Keep everything in a single `index.html` file (Tailwind CDN)
- Use the approved Royal Blue gradient background
- Use solid gold buttons that brighten on hover
- Maintain high text contrast (white/gray-100)
- Include the grain overlay for texture

### DO NOT
- Revert to dark/black backgrounds
- Use gradients on buttons
- Make the footer huge (keep `py-8`)
- Use low-contrast gray text
- Introduce build tools or frameworks without explicit request

### Interaction Rules
- Always provide a link to the live page after completing a task
- Format code blocks with file path and start line
