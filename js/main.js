// ============================================================
// Feathermode — Homepage Script
// ============================================================

// ---- Lock screen ----
// Soft preview gate only — this is a static site, so the "hidden" content
// ships in the page regardless. The SHA-256 check just keeps the plaintext
// password out of view-source; it is not real access control.
const LOCK_KEY = 'fm-unlocked';
const LOCK_HASH = '4eee3206d95af897d4d000e0302b9b4c7d84fe01dbac8bb2c4f2b459b8053057';
const lockForm = document.getElementById('lockForm');
const lockPassword = document.getElementById('lockPassword');
const lockError = document.getElementById('lockError');

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

lockForm.addEventListener('submit', async e => {
  e.preventDefault();
  const hash = await sha256Hex(lockPassword.value);

  if (hash === LOCK_HASH) {
    localStorage.setItem(LOCK_KEY, '1');
    document.documentElement.setAttribute('data-locked', 'false');
  } else {
    lockError.textContent = "That password isn't right.";
    lockError.classList.remove('shake');
    void lockError.offsetWidth; // restart the animation
    lockError.classList.add('shake');
    lockPassword.value = '';
    lockPassword.focus();
  }
});

const STORAGE_KEY = 'fm-theme';
const root = document.documentElement;
const toggle = document.getElementById('themeToggle');
const media = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme(palette) {
  root.setAttribute('data-palette', palette);
  toggle.setAttribute(
    'aria-label',
    palette === 'parchment-dark' ? 'Switch to light theme' : 'Switch to dark theme'
  );
}

// Respect the palette set by the inline head script; keep it in sync.
applyTheme(root.getAttribute('data-palette') || 'parchment-light');

toggle.addEventListener('click', () => {
  const next = root.getAttribute('data-palette') === 'parchment-dark' ? 'parchment-light' : 'parchment-dark';
  applyTheme(next);
  localStorage.setItem(STORAGE_KEY, next);
});

// Follow system theme changes unless the visitor has chosen one explicitly.
media.addEventListener('change', e => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    applyTheme(e.matches ? 'parchment-dark' : 'parchment-light');
  }
});

// ---- Signup form ----
const form = document.getElementById('signup');
const emailInput = document.getElementById('email');
const hint = document.getElementById('hint');

form.addEventListener('submit', e => {
  e.preventDefault();
  const val = emailInput.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  if (!valid) {
    hint.textContent = 'Please enter a valid address.';
    hint.style.color = 'var(--color-accent)';
    emailInput.focus();
    return;
  }

  const body = new URLSearchParams({ 'form-name': 'feathermode-waitlist', Email: val }).toString();
  fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
    .then(() => {
      form.innerHTML = '<p class="signup-success">You\'re on the list. We\'ll be in touch.</p>';
    })
    .catch(() => {
      hint.textContent = 'Something went wrong. Please try again.';
      hint.style.color = 'var(--color-accent)';
    });
});
