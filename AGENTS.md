# Notes for agents and new contributors

Read `README.md`, then `design.md`. The architecture comes from the Oofytronic design system
(`oofytronic-site`: `design.md` and its `/design-system/` page).

## Rules

1. Work on `trunk`; push to `trunk`. No other branches, no pull requests unless asked.
2. No build tooling, frameworks or libraries. Edit the HTML, CSS and JS directly.
3. Semantic HTML, CSS custom properties for every design value (`css/tokens.css`), functional JavaScript (small
   pure functions, no classes).
4. **Progressive enhancement:** without JavaScript the scenes must stack as an ordinary scrolling page; with
   `prefers-reduced-motion` nothing animates. The home page must never scroll when JavaScript is on, at any size
   (check 320×568 up to 1920×1080 and landscape phones).
5. Accessibility: inactive scenes stay `inert`; a polite live region (`[data-scene-status]`) names the scene;
   keep visible focus styles; the phone drawer button needs `aria-expanded` and `aria-controls`.
6. Slightly rounded corners (`--radius`); brand colours are the original motuALIS ones.
7. No analytics. Corporate wording: "motuALIS, LLC, doing business as Feathermode".

## Traps

- Header and footer markup are **copied into** `index.html`, `principles/` and `updates/`. Change all three.
- Nav links use `data-scene`. On narrow screens the click handler deliberately only *selects* a scene; do not
  make drawer links navigate on the home page.
- CSS order matters: the narrow-screen grid override for the body had to be moved to the end of the file because
  a later base rule overrode it. When a rule seems ignored, look for a later rule of equal specificity.
- Never run a leftover generator script from a scratch folder; they overwrite hand-edited pages.
- `communication/` is the old site with its own `css/` and `js/`. Do not edit, restyle or "clean up" it; it is
  waiting to be extracted into its own repository (see `communication/README.md`).
- The family list is hand-maintained on each site; a shared registry was deliberately skipped.
- Pushing to `trunk` replaces what is live at feathermode.com, including `communication/`.
- The email in `mailto:` links is `hello@feathermode.com`; the newsletter is only a `mailto:` for now.
