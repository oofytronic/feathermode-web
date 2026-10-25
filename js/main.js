// Functional helpers — small, pure, composed.
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const clamp = (min, max) => (n) => Math.min(max, Math.max(min, n));
const on = (event, handler) => (target) => (target.addEventListener(event, handler, { passive: true }), target);
const root = document.documentElement;

// ---------- Reading progress ----------
const scrollRatio = () => {
  const { scrollHeight, clientHeight } = root;
  const span = scrollHeight - clientHeight;
  return span > 0 ? clamp(0, 1)(window.scrollY / span) : 0;
};
const paintProgress = () => root.style.setProperty("--progress", scrollRatio());

const initProgress = () => {
  on("scroll", paintProgress)(window);
  paintProgress();
};

// ---------- Family island ----------
// The island is a <details>, so it opens and closes natively; this only closes it on outside click or Escape.
const closeFamily = (family) => (event) => {
  const outside = event.type === "click" && !family.contains(event.target);
  const escaped = event.type === "keydown" && event.key === "Escape";
  if (!family.open || !(outside || escaped)) return;
  family.open = false;
  if (escaped) $("summary", family)?.focus();
};
const initFamily = () => {
  const family = $(".family");
  if (!family) return;
  ["click", "keydown"].forEach((type) => document.addEventListener(type, closeFamily(family)));
};

// ---------- Motion preference ----------
// "full" turns on the floating islands; "reduced" (or no JS) leaves a static page.
const STORAGE_KEY = "oofytronic:motion";
const readStored = () => { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } };
const writeStored = (value) => { try { localStorage.setItem(STORAGE_KEY, value); } catch { /* storage unavailable */ } };
const systemPrefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const resolveMotion = (stored, systemReduced) => stored ?? (systemReduced ? "reduced" : "full");
const currentMotion = () => resolveMotion(readStored(), systemPrefersReduced());

// ---------- Islands: pure state calculations ----------
const isScrolled = (y, threshold = 48) => y > threshold;
// Index of the last target whose top edge has passed the reading line (-1 = none yet).
const activeIndex = (tops, line) => tops.reduce((active, top, i) => (top <= line ? i : active), -1);
const labelOf = (el) => el?.dataset.context ?? el?.textContent.trim() ?? "";
const hashOf = (a) => new URL(a.href, location.href).hash;

// A short final section may never reach the reading line, so the page end selects the last target.
const islandState = ({ y, tops, line, atEnd }) => ({
  scrolled: isScrolled(y),
  index: atEnd ? tops.length - 1 : activeIndex(tops, line),
});

// ---------- Floating islands: pure visibility rules ----------
// Each rule takes the target's rect plus viewport height and returns "docked" or "away".
const inBand = ({ top, bottom, viewport }) =>
  top <= viewport * 0.6 && bottom >= viewport * 0.4 ? "docked" : "away"; // target overlaps the middle band
const nearEnd = ({ bottom, viewport }) =>
  bottom <= viewport * 0.85 ? "docked" : "away"; // the end of the target is approaching

// Islands declare themselves in markup: data-island, data-zone, data-trigger, data-target.
// The trigger name picks the rule; see /design-system/ for the registry.
const always = () => "docked"; // visible whenever the page is dynamic (used by the stage's scene list)
const TRIGGER_RULES = { band: inBand, "near-end": nearEnd, always };

// ---------- Islands: DOM effects ----------
const setFlag = (name) => (on_) => on_ ? root.setAttribute(name, "") : root.removeAttribute(name);
const setScrolled = setFlag("data-scrolled");
const setContextOpen = setFlag("data-context-open");

const paintContext = (slot) => (label) => {
  if (label) slot.textContent = label; // keep old text while the slot collapses
  setContextOpen(Boolean(label));
};
// Links name their section with data-section; a page's own link keeps aria-current="page".
const isPageLink = (a) => a.getAttribute("aria-current") === "page";
const paintCurrent = (links) => (target) =>
  links.filter((a) => !isPageLink(a)).forEach((a) =>
    target?.id && a.dataset.section === target.id
      ? a.setAttribute("aria-current", "location")
      : a.removeAttribute("aria-current"));

const initFloating = () =>
  $$("[data-island][data-trigger]").flatMap((el) => {
    const rule = TRIGGER_RULES[el.dataset.trigger]; // "scrolled" islands are driven by initIslands instead
    if (!rule) return [];
    const anchor = el.dataset.target ? $(el.dataset.target) : null;
    if (el.dataset.target && !anchor) return [];
    const setDock = (state) => { el.dataset.dock = state; };
    const measure = () => {
      const { top, bottom } = anchor ? anchor.getBoundingClientRect() : { top: 0, bottom: 0 };
      return { top, bottom, viewport: window.innerHeight };
    };
    return [{ update: () => setDock(rule(measure())), reset: () => setDock("flow") }];
  });

// Highlight the contents link for the heading currently being read.
const initContents = () => {
  const links = $$(".toc__list a");
  const headings = links.map((a) => $(hashOf(a)));
  if (!links.length) return { update: () => {}, reset: () => {} };
  const mark = (index) =>
    links.forEach((a, i) => i === index ? a.setAttribute("aria-current", "location") : a.removeAttribute("aria-current"));
  return {
    update: ({ tops, line, atEnd }) => mark(atEnd ? headings.length - 1 : activeIndex(headings.map((h) => h.getBoundingClientRect().top), line)),
    reset: () => mark(-1),
  };
};

const initIslands = () => {
  const floats = initFloating();
  const contents = initContents();
  const slot = $(".island__context > span");
  const links = $$(".island li a");
  const targets = $$("[data-context]");
  const measure = () => ({
    y: window.scrollY,
    tops: targets.map((el) => el.getBoundingClientRect().top),
    line: window.innerHeight * 0.3,
    atEnd: window.scrollY + window.innerHeight >= root.scrollHeight - 2,
  });
  const update = () => {
    const reading = measure();
    const state = islandState(reading);
    const target = targets[state.index];
    setScrolled(state.scrolled);
    paintContext(slot)(state.scrolled ? labelOf(target) : "");
    paintCurrent(links)(target);
    floats.forEach((f) => f.update());
    contents.update(reading);
  };
  let frame = 0;
  const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
  const listen = () => (["scroll", "resize"].forEach((e) => window.addEventListener(e, schedule, { passive: true })), update());
  const stop = () => (["scroll", "resize"].forEach((e) => window.removeEventListener(e, schedule)), setScrolled(false), setContextOpen(false), paintCurrent(links)(null), floats.forEach((f) => f.reset()), contents.reset());
  return { start: listen, stop };
};

// ---------- Stage: full-screen scenes, no page scroll ----------
// Non-long-form content is *accessed*, not scrolled to. The page is a fixed stage of scenes. Landscape moves
// along x (like film frames), portrait along y (like a reel). Pure decisions first, effects after.
const clampIndex = (count) => (n) => Math.min(count - 1, Math.max(0, n));
const STEP_KEYS = { ArrowRight: 1, ArrowDown: 1, PageDown: 1, ArrowLeft: -1, ArrowUp: -1, PageUp: -1 };
const stepFromKey = (key) => STEP_KEYS[key] ?? 0;
const stepFromWheel = (axis) => ({ deltaX, deltaY }) => {
  const d = axis === "x" && Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
  return Math.abs(d) < 18 ? 0 : Math.sign(d);
};
const stepFromSwipe = (axis, threshold = 48) => ({ dx, dy }) => {
  const [main, cross] = axis === "x" ? [dx, dy] : [dy, dx];
  return Math.abs(main) < threshold || Math.abs(cross) > Math.abs(main) ? 0 : main < 0 ? 1 : -1;
};
const sceneFromHash = (ids) => (hash) => Math.max(0, ids.indexOf(hash.replace(/^#/, "")));
const nextTab = (count) => (current, key) =>
  key === "Home" ? 0
  : key === "End" ? count - 1
  : key === "ArrowRight" || key === "ArrowDown" ? (current + 1) % count
  : key === "ArrowLeft" || key === "ArrowUp" ? (current - 1 + count) % count
  : current;

// A listener that returns its own disposer, so start/stop stay symmetrical.
const listen = (target, type, handler, options) => {
  target.addEventListener(type, handler, options);
  return () => target.removeEventListener(type, handler, options);
};
const isTyping = (el) => Boolean(el?.closest?.('input, textarea, select, [contenteditable], [role="tablist"], .family[open]'));

// Pickers: a tablist that reveals one panel at a time (a level select). Without JS every panel is shown.
const initPickers = () => {
  const pickers = $$("[data-picker]").map((el) => {
    const tabs = $$('[role="tab"]', el);
    const panels = $$('[role="tabpanel"]', el);
    const list = $('[role="tablist"]', el);
    const select = (n) => {
      tabs.forEach((t, i) => { t.setAttribute("aria-selected", String(i === n)); t.tabIndex = i === n ? 0 : -1; });
      panels.forEach((p, i) => { p.hidden = i !== n; });
    };
    const onKey = (e) => {
      const current = tabs.findIndex((t) => t === document.activeElement);
      const next = nextTab(tabs.length)(current < 0 ? 0 : current, e.key);
      if (next === current || !["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(e.key)) return;
      e.preventDefault();
      tabs[next].focus();
      select(next);
    };
    return {
      start: () => { select(0); return [...tabs.map((t, i) => listen(t, "click", () => select(i))), listen(list, "keydown", onKey)]; },
      stop: () => { panels.forEach((p) => { p.hidden = false; }); tabs.forEach((t) => { t.removeAttribute("tabindex"); t.setAttribute("aria-selected", "false"); }); },
    };
  });
  let disposers = [];
  return {
    start: () => { disposers = pickers.flatMap((p) => p.start()); },
    stop: () => { disposers.forEach((d) => d()); disposers = []; pickers.forEach((p) => p.stop()); },
  };
};

const initStage = () => {
  const scenes = $$(".stage .scene");
  if (scenes.length < 2) return { available: false, start: () => {}, stop: () => {} };
  const ids = scenes.map((s) => s.id);
  const clamp = clampIndex(scenes.length);
  const tocLinks = $$(".toc__list a");
  const navLinks = $$(".island li a");
  const slot = $(".island__context > span");
  const status = $("[data-stage-status]");
  const portrait = window.matchMedia("(orientation: portrait)");
  const floats = initFloating();
  const pickers = initPickers();
  const axis = () => (portrait.matches ? "y" : "x");
  const current = () => Number(root.dataset.scene ?? 0);

  const paint = (n) => {
    root.dataset.scene = String(n);
    root.style.setProperty("--scene", n);
    scenes.forEach((s, i) => { s.inert = i !== n; });
    tocLinks.forEach((a, i) => (i === n ? a.setAttribute("aria-current", "location") : a.removeAttribute("aria-current")));
    setScrolled(n > 0); // reuse the header islands' "scrolled" look once we leave the title scene
    paintContext(slot)(n > 0 ? labelOf(scenes[n]) : "");
    paintCurrent(navLinks)(scenes[n]);
    if (status) status.textContent = `${labelOf(scenes[n])}, scene ${n + 1} of ${scenes.length}`;
  };
  const goTo = (target, { focus = false } = {}) => {
    const n = clamp(target);
    if (n !== current()) { paint(n); history.replaceState(null, "", `#${ids[n]}`); }
    if (focus) $("h1, h2", scenes[n])?.focus({ preventScroll: true });
  };
  const goBy = (step) => goTo(current() + step);

  const onKey = (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || isTyping(e.target)) return;
    if (e.key === "Home") return (e.preventDefault(), goTo(0));
    if (e.key === "End") return (e.preventDefault(), goTo(scenes.length - 1));
    const step = stepFromKey(e.key);
    if (step) (e.preventDefault(), goBy(step));
  };
  let wheelLocked = false;
  let lastWheel = 0;
  const onWheel = (e) => {
    if (e.target.closest?.(".family[open], [data-scroll]")) return;
    const now = performance.now();
    const idle = now - lastWheel > 160;
    lastWheel = now;
    if (wheelLocked && !idle) return; // still inside the same wheel burst
    wheelLocked = false;
    const step = stepFromWheel(axis())(e);
    if (!step) return;
    wheelLocked = true;
    goBy(step);
  };
  let touch = null;
  const onTouchStart = (e) => { const t = e.changedTouches[0]; touch = isTyping(e.target) ? null : { x: t.clientX, y: t.clientY }; };
  const onTouchEnd = (e) => {
    if (!touch) return;
    const t = e.changedTouches[0];
    const step = stepFromSwipe(axis())({ dx: t.clientX - touch.x, dy: t.clientY - touch.y });
    touch = null;
    if (step) goBy(step);
  };
  const onClick = (e) => {
    const stepper = e.target.closest?.("[data-step]");
    if (stepper) return goBy(Number(stepper.dataset.step));
    const a = e.target.closest?.("a[href]");
    if (!a) return;
    const url = new URL(a.href, location.href);
    const sameStage = url.origin === location.origin && url.pathname === location.pathname;
    if (sameStage && ids.includes(url.hash.slice(1))) (e.preventDefault(), goTo(ids.indexOf(url.hash.slice(1)), { focus: true }));
  };

  let disposers = [];
  const stop = () => {
    disposers.forEach((d) => d());
    disposers = [];
    pickers.stop();
    floats.forEach((f) => f.reset());
    ["stage", "stageAxis", "scene"].forEach((k) => delete root.dataset[k]);
    root.style.removeProperty("--scene");
    scenes.forEach((s) => { s.inert = false; });
    tocLinks.forEach((a) => a.removeAttribute("aria-current"));
    setScrolled(false); setContextOpen(false); paintCurrent(navLinks)(null);
  };
  const start = () => {
    stop();
    root.dataset.stage = "";
    root.dataset.stageAxis = axis();
    pickers.start();
    floats.forEach((f) => f.update());
    paint(sceneFromHash(ids)(location.hash));
    disposers = [
      listen(document, "keydown", onKey),
      listen(window, "wheel", onWheel, { passive: true }),
      listen(document, "touchstart", onTouchStart, { passive: true }),
      listen(document, "touchend", onTouchEnd, { passive: true }),
      listen(document, "click", onClick),
      listen(window, "hashchange", () => goTo(sceneFromHash(ids)(location.hash))),
      listen(portrait, "change", () => { root.dataset.stageAxis = axis(); }),
      listen($(".stage"), "scroll", (e) => { e.target.scrollTo(0, 0); }, { passive: true }), // a native #fragment jump must never move the stage
    ];
  };
  return { available: true, start, stop };
};

const initMotion = () => {
  const islands = initIslands();
  const stage = initStage();
  const toggle = $("[data-motion-toggle]");
  const apply = (motion) => {
    root.dataset.motion = motion;
    islands.stop();
    stage.stop();
    if (motion === "full") (stage.available ? stage : islands).start(); // a stage page replaces scroll-driven islands
    toggle?.setAttribute("aria-pressed", String(motion === "reduced"));
  };
  apply(currentMotion());
  if (toggle) {
    toggle.hidden = false;
    on("click", () => {
      const next = root.dataset.motion === "full" ? "reduced" : "full";
      writeStored(next);
      apply(next);
    })(toggle);
  }
  // The first tab stop on a stage page: leave the stage for the ordinary scrolling layout.
  $$("[data-motion-off]").forEach((button) => {
    button.hidden = false;
    on("click", () => { writeStored("reduced"); apply("reduced"); })(button);
  });
  // Follow the OS setting live, unless the visitor has chosen explicitly.
  on("change", () => readStored() === null && apply(currentMotion()))(window.matchMedia("(prefers-reduced-motion: reduce)"));
};

// ---------- Footer year ----------
const initYear = () => $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

[initProgress, initMotion, initYear, initFamily].forEach((init) => init());
