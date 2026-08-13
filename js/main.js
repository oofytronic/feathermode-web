// ============================================================
// Feathermode — Homepage Script
// ============================================================

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

  const body = new URLSearchParams({ 'form-name': 'feathermode-signup', Email: val }).toString();
  fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
    .then(() => {
      form.innerHTML = '<p class="signup-success">Thank you. We\'ll be in touch.</p>';
    })
    .catch(() => {
      hint.textContent = 'Something went wrong. Please try again.';
      hint.style.color = 'var(--color-accent)';
    });
});
