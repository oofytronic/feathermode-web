// ============================================================
// feathermode — Landing Page Script
// ============================================================

const body = document.body;
const STORAGE_KEY = 'fm.palette.override';
const autoEl = document.getElementById('paletteAuto');

// Map hour → palette name
function paletteForHour(h) {
  if (h >= 7 && h < 17) return 'daylight';
  if (h >= 17 && h < 20) return 'dusk';
  return 'candlelight';
}

function applyPalette(p) {
  body.dataset.palette = p;
  document.querySelectorAll('.palette-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.palette === p);
  });
}

function syncAutoUI(isAuto) {
  autoEl.classList.toggle('active', isAuto);
}

function runAuto() {
  applyPalette(paletteForHour(new Date().getHours()));
  syncAutoUI(true);
}

// On load: honour stored override, otherwise pick by time
const stored = localStorage.getItem(STORAGE_KEY);
if (stored && ['daylight', 'dusk', 'candlelight'].includes(stored)) {
  applyPalette(stored);
  syncAutoUI(false);
} else {
  runAuto();
}

// Manual palette buttons
document.querySelectorAll('.palette-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    applyPalette(btn.dataset.palette);
    localStorage.setItem(STORAGE_KEY, btn.dataset.palette);
    syncAutoUI(false);
  });
});

// Auto button — clear override, return to time-based selection
autoEl.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  runAuto();
});

// Re-check every minute so visitors who linger across a palette boundary get the transition
setInterval(() => {
  if (!localStorage.getItem(STORAGE_KEY)) runAuto();
}, 60 * 1000);

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
    hint.style.color = 'var(--accent)';
    emailInput.focus();
    return;
  }

  const body = new URLSearchParams({ 'form-name': 'landing-signup', Email: val }).toString();
  fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
    .then(() => {
      form.innerHTML = '<div class="signup-success">Thank you. We\'ll be in touch.</div>';
      hint.textContent = 'Your name is on the list.';
      hint.style.color = 'var(--ink-faint)';
    })
    .catch(() => {
      hint.textContent = 'Something went wrong. Please try again.';
      hint.style.color = 'var(--accent)';
    });
});
