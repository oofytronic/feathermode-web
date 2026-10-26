// Functional helpers — small, pure, composed.
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const root = document.documentElement;

// ---------- Scenes ----------
// State is two ids: the scene the visitor has chosen (pinned) and the one being previewed by hover or focus.
// What is shown is the preview if there is one, otherwise the pinned scene.
const shown = ({ pinned, preview }) => preview ?? pinned;
const knownOr = (ids, fallback) => (id) => (ids.includes(id) ? id : fallback);
const isHoverless = () => window.matchMedia("(hover: none)").matches;

const paintScene = (scenes, links, status) => (id) => {
  root.dataset.scene = id;
  scenes.forEach((scene) => {
    const active = scene.id === id;
    scene.classList.toggle("is-active", active);
    scene.toggleAttribute("inert", !active);
  });
  links.forEach((link) =>
    link.dataset.scene === id ? link.setAttribute("aria-current", "true") : link.removeAttribute("aria-current"));
  const name = scenes.find((scene) => scene.id === id)?.dataset.name;
  if (name) status.textContent = name;
};

const initScenes = () => {
  const scenes = $$(".scene");
  if (!root.hasAttribute("data-scenes") || !scenes.length) return;
  const ids = scenes.map((scene) => scene.id);
  const links = $$("a[data-scene]");
  const paint = paintScene(scenes, links, $("[data-scene-status]"));
  const fromHash = knownOr(ids, "home")(location.hash.slice(1));

  let state = { pinned: fromHash, preview: null };
  const update = (patch) => { state = { ...state, ...patch }; paint(shown(state)); };

  links.forEach((link) => {
    const id = link.dataset.scene;
    link.addEventListener("pointerenter", (event) => event.pointerType !== "touch" && update({ preview: id }));
    link.addEventListener("pointerleave", () => update({ preview: null }));
    link.addEventListener("focus", () => update({ preview: id }));
    link.addEventListener("blur", () => update({ preview: null }));
    link.addEventListener("click", (event) => {
      const inPage = new URL(link.href, location.href).pathname === location.pathname && link.hash;
      const home = id === "home";
      // A page that leaves this site goes straight there with a pointer; on touch the first tap shows the scene.
      // In the narrow drawer a link only chooses the scene; the scene's own button goes on to the site.
      const firstTap = isHoverless() && state.pinned !== id && !home;
      if (inPage || home || firstTap || isNarrow()) {
        event.preventDefault();
        history.replaceState(null, "", home ? location.pathname : link.hash || location.pathname);
        update({ pinned: id, preview: null });
      }
    });
  });

  paint(shown(state));
  if (location.hash) $(`#${state.pinned} h1, #${state.pinned} h2`)?.focus({ preventScroll: true });
  window.addEventListener("hashchange", () => update({ pinned: knownOr(ids, "home")(location.hash.slice(1)) }));
};

// ---------- Keep the one-screen page at the top ----------
// The page never scrolls; if a browser moves it anyway (focus, bars sliding in and out), put it back.
const pinToTop = () => {
  if (!root.hasAttribute("data-scenes")) return;
  const reset = () => window.scrollY && window.scrollTo(0, 0);
  window.addEventListener("scroll", reset, { passive: true });
  reset();
};

// ---------- Drawer (narrow screens) ----------
// Below 50rem the nav is a drawer that slides up from the bottom bar. The button toggles it; Escape, a click
// outside, or choosing a link puts it away.
const NARROW = "(max-width: 50rem)";
const isNarrow = () => window.matchMedia(NARROW).matches;
const setDrawer = (toggle, open) => {
  root.toggleAttribute("data-drawer-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close the menu" : "Open the menu");
};
const initDrawer = () => {
  const toggle = $(".drawer-toggle");
  const header = $(".site-header");
  if (!toggle || !header) return;
  toggle.hidden = false;
  const isOpen = () => root.hasAttribute("data-drawer-open");
  const close = () => setDrawer(toggle, false);
  toggle.addEventListener("click", () => setDrawer(toggle, !isOpen()));
  document.addEventListener("click", (event) => isOpen() && !header.contains(event.target) && close());
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !isOpen()) return;
    close();
    toggle.focus();
  });
  $$(".site-nav a").forEach((link) => link.addEventListener("click", close));
  window.matchMedia(NARROW).addEventListener("change", close);
};

// ---------- Footer year ----------
const initYear = () => $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

initScenes();
pinToTop();
initDrawer();
initYear();
