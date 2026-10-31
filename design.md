# Design

Feathermode is the parent of a family of products, in the way 37signals owns Basecamp and HEY: the products
belong to Feathermode and say so, and each has its own presence (its own domain and look). This site is the
parent's front door. It follows the **Oofytronic design system** (see `oofytronic-site`: `design.md` and the
`/design-system/` page). This file records only how Feathermode uses it.

## Structure

- `/` — **one screen that never scrolls.** The header has the Feathermode logo on the left and the nav on
  the right. There is no family dropdown on this site: the nav is the family. The dropdown lives on the child
  sites (Oofytronic, and the products as they appear). The nav has two groups: **Platforms** (Aerodash, Gondola)
  and **Writing** (Nimbus Nectar, Feathermode Updates, Oofytronic), in that order.
  - Every nav item has a **scene**. Hovering (or keyboard-focusing) an item shows its scene; moving away
    returns to the welcome scene. Clicking goes to that item's site or page. Items with no site yet
    (Aerodash, Gondola, Nimbus Nectar) have scenes that say so, and a click keeps that scene showing.
  - The logo is the full lockup on the welcome scene and just the mark (no box) on every other scene.
    Clicking it returns to the welcome scene.
  - **Touch.** There is no hover, so the first tap on an item shows its scene and a second tap (or the button
    in the scene) follows the link.
  - **Buttons.** Scenes for Updates and Oofytronic have a button to the site, but only on touch and in the phone
    drawer. With a mouse and the nav along the top the scene is only showing while its link is hovered and
    clicking the link goes to the same place, so the button is hidden there.
  - Without JavaScript the scenes are an ordinary stacked, scrolling page and the nav links jump to them.
    `#aerodash` etc. deep-link to a scene.
  - Below 50rem the nav no longer fits beside the logo, so the header becomes a slim bar along the bottom:
    the logo on the left and an up-arrow button on the right. The button slides the links up as a drawer
    (Platforms and Writing, one per row); it turns into a down arrow, which puts the drawer away again, as do
    Escape, a tap outside and choosing a link. In the drawer a link only chooses the scene (the scene's own
    button goes on to the site). Without JavaScript the links just wrap under the logo.
- `/principles/` — the mission and the four principles, as a scrolling page (long-form text).
- `/updates/` — Feathermode Updates, the newsletter page. No posts yet; subscribing is a `mailto:` link.
- `/communication/` — the **previous Feathermode site, moved here unchanged**. It is a placeholder: the
  communication / everything-app platform (Aerodash) will get its own repository, and this folder is what will seed it.
  It still describes the old publishing pitch and still calls itself "Feathermode". It is publicly reachable
  at `/communication/` until it moves out and is no longer linked from the site. Do not edit it here unless
  that is deliberate.
- Pages are folders with an `index.html`, so URLs have no `.html`. The pages are written out by hand (the
  header and footer are repeated in each); a scratch generator was used for the first version only.

## The family

The family dropdown is on the child sites (Oofytronic, and the products as they appear), not here, where the nav
lists the members. Its member list is hand-maintained markup in each site; a shared brand registry was deliberately skipped for now.

| Member | Kind | Status |
| --- | --- | --- |
| **Feathermode** | Parent | Live (this site) |
| **Aerodash** | Everything app (communication first) | Exploration; own domain to come (working name) |
| **Gondola** | Distribution; a mini-app inside Aerodash | In development; own domain to come (working name) |
| **Oofytronic** | Personal blog | Live (separate repository) |
| **Nimbus Nectar** | Publication from Feathermode | Not live; to be spun up |

The legal entity is **motuALIS, LLC**, doing business as Feathermode. The motuALIS site (separate repository)
is a one-screen page for the LLC that links here. Earlier names retired: MTF Technologies, WWWinged, Alula,
Penna and Flight Log.

## Look

- **Palette and type** are the former motuALIS brand: violet `#7B0FFF`, blue `#177EFE`, cyan `#00DEFF`,
  light `#F9FBFF`, dark `#333F54`, on a deeper slate ground; Urbanist (self-hosted). Cyan is the accent;
  violet appears only in the brand gradient (it is too dark to carry text).
- **Corners** are slightly rounded (`--radius`, `--radius-lg`), unlike Oofytronic.
- **Logo.** `assets/feathermode_logo-light.svg` and `assets/feathermode-icon-light.svg` were built from the
  mark in the previous site (a feather-wing in a ring) with the "Feathermode" wordmark outlined from
  Crimson Pro 400. They are near-white, for dark backgrounds. `assets/favicon.svg` and
  `assets/feathermode-icon.png` (social preview) are the mark on the dark ground.
- The wordmark is the lockup, and becomes the bare mark (no box) while any other scene is showing.
- Each scene has its own glow colour behind it (Oofytronic's is brass, as on the blog).

## Content notes

- The mission and principles text is the original motuALIS copy with the company name changed. The welcome
  line, the scene copy and the Updates page are new copy to review.
- The contact address is `hello@feathermode.com` (footer, principles page, newsletter sign-up). The sign-up is
  only a `mailto:` link.
- Analytics: none (motuALIS's Fathom script was not carried over).

## To do

- [ ] Make sure `hello@feathermode.com` receives mail, and replace the `mailto:` newsletter link with a real list and form.
- [ ] Give the communication app and the distribution platform final names and domains, then link them from
  their nav items and the child sites' family dropdowns (their scenes currently say "to be announced").
- [ ] Check trademarks and domains for Aerodash and Gondola.
- [ ] Replace the Oofytronic link (`oofytronic-site.vercel.app`, the repo's recorded address) with its real domain.
- [ ] Spin up Nimbus Nectar and link it from its nav item and the child sites' family dropdowns.
- [ ] Move `communication/` into its own repository (`git subtree split --prefix=communication` keeps its
  history), then remove it from here.
- [ ] Decide whether to add analytics.
- [ ] Try the scenes (hover and the touch first-tap) on real devices and tablets.
- [ ] Share the design-system code between the sites instead of keeping copies.
