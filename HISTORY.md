# History

Commit hashes are on `trunk`. The Oct 2026 work was one extended session across four sites.

## The launchpad site (25 to 27 Oct 2026)

- `66de238` The welcome scene is visible from first paint (no flash before the script runs).
- `6b6bfc1` **Scene buttons hidden on desktop.** A scene only shows while its link is hovered and the link goes to
  the same place, so the button was redundant. They stay on touch and in the phone drawer.
- `7f04dfe` **Phone nav is a slide-up drawer**: logo on the left of a slim bottom bar, an up-arrow button on the
  right (down arrow to close). Replaces the stacked two-row bar, which was "way too busy".
- `b4edd3f` The logo moved into the bottom bar on narrow screens; fixed a grid-order bug that stretched the footer
  and pushed content around; the bar height is now measured so nothing hides behind it; the page is pinned to the
  top.
- `4471b5a` Scene content lifted slightly away from the phone nav bar.
- `09152e2` **Family dropdown removed** from this site (the nav already is the family) and the logo moved to the top
  left. The dropdown stays on the child sites. The nav now fits beside the logo down to 50rem.
- `43e9a5c` **Home page reworked: no more slides.** Logo, family dropdown and nav in the header; one scene per nav
  item that appears on hover and links onward on click; added `/updates/`; moved the mission text onto
  `/principles/`; contact address changed to `hello@feathermode.com`.
- `ec699e1` **Feathermode became the parent site.** The previous Feathermode site was moved, unchanged, into
  `communication/` (it is meant to seed a future repo). The root became a new site built on the Oofytronic design
  system with the motuALIS brand colours: a stage of full-screen scenes (Welcome, Mission, Platforms, Principles,
  Writing, Contact) with pickers for the platforms and principles. The Feathermode lockup logo was rebuilt from the
  mark in the old site's header SVG, with the wordmark outlined from Crimson Pro.

## Before (to 22 Aug 2026)

- `c646778` (merge of PR #8, "feathermode-aerial-sports-redesign") is the last state of the **previous
  Feathermode**: a pitch for a user-owned writing and self-publishing platform (a site of the writer's own for
  novels, serial fiction, nonfiction and manga, with storefront, reader support tiers and built-in newsletters),
  in a parchment palette with Crimson Pro and DM Sans. That site is what `communication/` contains.

## How the idea evolved

1. The motuALIS LLC site was rebuilt on the Oofytronic design system (see the `motualis` repo).
2. motuALIS became a quiet technology-company parent. Names were explored for the parent and its platforms; the
   user kept **Feathermode** and the product names **Common Tongue** (communication), **Airlift** (distribution) and
   **Nimbus Nectar** (a publication from Feathermode). Retired names: MTF Technologies, WWWinged, Alula, Penna,
   Flight Log.
3. Plan (37signals-style): motuALIS becomes a one-screen page linking to Feathermode; the former motuALIS site moves
   to Feathermode; the old Feathermode site goes to `communication/`; Oofytronic stays the same except the family
   dropdown moves top-right on phones.
4. The slide/stage idea was then dropped in favour of the hover-to-preview scenes, and later the phone nav became a
   drawer.

## Decisions to remember

- Feathermode is the public face; motuALIS, LLC is only the legal entity.
- No family dropdown here; it belongs on the child sites.
- Work on `trunk` only; an `experimental` branch comes later when asked for.
- Do not delete `communication/` until its replacement repo exists.
- A shared brand registry for the family list was deliberately skipped.

## Not done yet

See `design.md` (to-do list): a real newsletter list, final names and domains for the products, trademark and
domain checks, moving `communication/` into its own repo, analytics decision, real-device testing.
