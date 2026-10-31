# Feathermode

The public site of **Feathermode**, a freedom-focused storytelling-technology company (legal entity: motuALIS, LLC,
doing business as Feathermode). It is the **parent and launchpad** for a family of products, in the way 37signals
owns Basecamp and HEY: each product has its own domain and look; this site is the front door.

- Static HTML, CSS and vanilla JavaScript. **No build step, no dependencies.**
- Live at `https://feathermode.com` (the canonical URL in the pages).
- Built on the **Oofytronic design system** (see the `oofytronic-site` repo), with its own palette and rounded corners.

## What the site does

The home page is **one screen that never scrolls.** The logo is top left and the nav is top right
(a slide-up drawer on phones):

- **Platforms:** Aerodash (the everything app), Gondola (distribution, a mini-app inside Aerodash)
- **Writing:** Nimbus Nectar, Feathermode Updates, Oofytronic

Each nav item has a **scene**. Hover (or keyboard-focus) a link and its scene appears; move away and the welcome
scene returns. Click and you go to that item's site or page. Items with no site yet show a "to be announced" scene.
On touch screens the first tap shows the scene (no hover exists). The logo shrinks to just the mark (no box) while
another scene is showing.

Other pages: `/principles/` (mission and the four principles), `/updates/` (the newsletter page, no posts yet).

## Quick start

```sh
git clone https://github.com/oofytronic/feathermode-web
cd feathermode-web
python3 -m http.server 8000
# open http://localhost:8000/
```

Pages are folders with an `index.html`, so use a static server (not `file://`). Deploying is "serve the repo root".

## What is where

```
index.html            the one-screen home page: header (logo, nav/drawer), six scenes, footer
principles/           mission + principles (scrolling page)
updates/              Feathermode Updates (scrolling page)
communication/        the PREVIOUS Feathermode site, moved here unchanged (see its README)
css/tokens.css        design values (colours, type scale, space, bar height)
css/style.css         all styles, in sections: base, header, nav/drawer, scenes, pages, footer
js/main.js            scene switching, the phone drawer, keep-at-top, footer year
assets/               logo lockup, icon, favicon, social preview image
fonts/                Urbanist, self-hosted (variable files)
design.md             structure, the family table, look, content notes, to-do list
HISTORY.md            what changed and when
AGENTS.md             notes for AI agents / new contributors
```

## How the home page works

- Scenes are `<section class="scene">` elements inside `<main class="scenes">`. The scene ids are `home`,
  `aerodash`, `gondola`, `nimbus-nectar`, `updates`, `oofytronic`. Every nav link carries
  `data-scene="<id>"`; the logo is `data-scene="home"`.
- `html[data-scenes]` (set by an inline script in `<head>`) switches the stacked, scrolling baseline into the
  one-screen layout; `html[data-scene]` names the scene being shown; inactive scenes are `inert` and
  `visibility: hidden`. Without JavaScript all scenes are simply stacked and the nav links jump to them.
- State in `js/main.js` is two ids, `pinned` (chosen by click/hash) and `preview` (hover/focus); what shows is
  `preview ?? pinned`.
- **Below 50rem** the header becomes a fixed bottom bar: logo on the left and an up-arrow button on the right that
  slides the nav up as a drawer (down arrow, Escape, a tap outside or choosing a link puts it away). In the drawer
  a link only *selects* the scene; the scene's own button goes on to the site. With a mouse and the nav along the
  top, those buttons are hidden because the link already goes there.
- Each scene has its own glow colours (`--g1`, `--g2`, `--gx` on `html[data-scene=...]`).

## The look

Original motuALIS brand colours (violet `#7B0FFF`, blue `#177EFE`, cyan `#00DEFF`, light `#F9FBFF`, dark `#333F54`)
on deep slate; cyan is the accent and violet appears only in the gradient. Urbanist type. Slightly rounded corners.
The logo is the feather-wing mark from the previous site with "Feathermode" outlined from Crimson Pro.

## Common tasks

| I want to… | Do this |
| --- | --- |
| Add a nav item and scene | Add a `<li><a data-scene="id" href="…">` in the header nav of **every page**, and a `<section id="id" class="scene" data-name="…">` in `index.html`; add a glow in the CSS if you want one. |
| Give a product its real site | In its nav link set the real `href` (and `target="_blank" rel="noopener"` if external), and give its scene a button (`.button--primary`) instead of the "to be announced" text. |
| Change the contact email | `hello@feathermode.com` appears in every footer, `principles/` and `updates/`. |
| Make the newsletter real | `updates/` posts nowhere: it is a `mailto:` link. Add a form and a provider. |
| Remove `communication/` | See `communication/README.md` (it is meant to become its own repo). |

## Workflow

Work on **`trunk`** and push to `trunk`. No other branches are published. An `experimental` branch will be added
when asked for.

## Things to know

- Header and footer markup are copied into the three pages; edit all of them.
- The family dropdown is **not** on this site (the nav is the family); it lives on the child sites.
- `communication/` is publicly reachable and still carries the old publishing pitch. It is untouched on purpose.
- No analytics. The Oofytronic link uses its Vercel address until it has a real domain.
- Names (Aerodash, Gondola, Nimbus Nectar) are working names; trademarks and domains are unchecked.
- Tested only in headless Chromium (hover, tap emulation, sizes 320 to 1920 wide); not on real devices.

See `design.md` for the to-do list and `HISTORY.md` for how the site got here.
