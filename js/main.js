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
      const firstTap = isHoverless() && state.pinned !== id && !home;
      if (inPage || home || firstTap) {
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

// ---------- Bottom bar height ----------
// On narrow screens the header is a fixed bar; tell the layout exactly how tall it is so nothing hides behind it.
const fitBar = () => {
  const header = $(".site-header");
  if (!header) return;
  const measure = () => {
    const fixed = getComputedStyle(header).position === "fixed";
    fixed ? root.style.setProperty("--bar-h", `${header.offsetHeight}px`) : root.style.removeProperty("--bar-h");
  };
  new ResizeObserver(measure).observe(header);
  measure();
};

// ---------- Footer year ----------
const initYear = () => $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

initScenes();
pinToTop();
fitBar();
initYear();
