// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

// Mobile nav
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle) toggle.addEventListener('click', () => links.classList.toggle('open'));

// Blog filter
document.querySelectorAll('.blog-categories button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.blog-categories button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    document.querySelectorAll('.article').forEach(a => {
      if (cat === 'all' || a.dataset.cat === cat) a.style.display = '';
      else a.style.display = 'none';
    });
  });
});

// Contact form → Google Sheets
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxiD1JDe3NHjk1YGTj3WrojoBolUoTZYtINb7FS7kmLTPEzGVZ-RPOr8Vpf0FFjWIBR/exec';

const form = document.querySelector('form.contact-form-el');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const successEl = document.getElementById('form-success');
    const errorEl = document.getElementById('form-error');
    const data = Object.fromEntries(new FormData(form));

    if (!data.correo || !data.correo.includes('@')) {
      const correoInput = form.querySelector('[name="correo"]');
      if (correoInput) correoInput.focus();
      return;
    }
    const consent = form.querySelector('[name="privacidad"]');
    if (consent && !consent.checked) {
      consent.focus();
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Enviando…';
    if (successEl) successEl.hidden = true;
    if (errorEl) errorEl.hidden = true;

    try {
      await fetch(SHEET_URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
      });
      form.reset();
      if (successEl) successEl.hidden = false;
    } catch {
      if (errorEl) errorEl.hidden = false;
    } finally {
      btn.disabled = false;
      btn.textContent = 'Enviar mensaje';
    }
  });
}
