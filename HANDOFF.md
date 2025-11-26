# Handoff to Next Agent

## Project Status: Legacy v5 Complete
The user has approved a major redesign of the "Legacy" marketing site. The final, approved single-page prototype is located at:
`out/legacy-v5-FINAL.html`

## User Intent & Design Rules
The user wants a site that feels **"Opulent, Permanent, and Guardian-Like."**
*   **DO NOT** revert to dark/black backgrounds. Stick to the **Deep Royal Blue Gradient** defined in the CSS.
*   **DO NOT** use gradients on buttons. Use **Solid Metallic Gold** (`#D4AF37`) that brightens on hover.
*   **DO NOT** make the footer huge. Keep it compact (`py-8`).
*   **DO NOT** use low-contrast gray text. Use `text-gray-100` or white.

## The "Sirsi-Grade" Aesthetic
We are emulating the "Living System" feel of Sirsi.ai but with a Blue/Gold palette.
*   **Alive UI**: Use green pulse dots (`w-2 h-2 bg-green-500 animate-pulse`) on cards.
*   **Tech Borders**: Use glowing borders or "Tech Corners" to frame content.
*   **Texture**: Always include the `bg-grain` film overlay for depth.

## Next Steps for Implementation
The user's ultimate goal is to port this HTML/CSS prototype into the main Next.js application (`legacy-next/`).
1.  **Port Tailwind Config**: Extract the color tokens (`--color-gold`, `--color-blue-royal`) into `tailwind.config.ts`.
2.  **Port Global CSS**: Move the glass utilities and background gradients to `app/globals.css`.
3.  **Componentize**: Break `legacy-v5-FINAL.html` into React components (`Hero.tsx`, `Protocol.tsx`, `Security.tsx`, `Pricing.tsx`, `Footer.tsx`).

## Visual Assets
*   **Logo**: The "Heraldic Angel" SVG is the new logo. Do not use the old square.
*   **Images**: Use high-quality Unsplash images depicting *human connection* or *tech abstract*, always in glass frames.
