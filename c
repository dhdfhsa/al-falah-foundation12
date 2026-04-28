# Donate & Gallery Pages Implementation

## Plan
- [x] 1. Gather design system info (colors, fonts, animations, patterns)
- [x] 2. Confirm plan with user
- [ ] 3. Create `src/app/donate/page.tsx` — full donation page with hero, amount selector, payment methods, impact calculator, donor marquee, FAQ
- [ ] 4. Create `src/app/donate/page.module.css` — navy/gold theme with dark mode, floating animations, responsive grid
- [ ] 5. Create `src/app/gallery/page.tsx` — category-filter hero, masonry grid, hover overlays, lightbox modal, load-more
- [ ] 6. Create `src/app/gallery/page.module.css` — theme-matching masonry, modal animations, responsive
- [ ] 7. Verify build passes

## Design System Summary
- **Colors**: Navy `#0b1638`, `#122060`; Gold `#c9912a`; Soft bg `#f4f6fb`
- **Fonts**: DM Sans (body), Cinzel (headings)
- **Theme**: `data-theme="blue"` / `"dark"` with `[data-theme="dark"]` CSS selectors
- **Patterns**: ScrollReveal wrapper, count-up numbers, gold squiggle SVG, gradient CTAs with hover lift, card hover zoom, IntersectionObserver triggers
