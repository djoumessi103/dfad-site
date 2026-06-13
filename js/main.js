/**
 * DFAD — Mécatronique Industrielle
 * Fichier JavaScript principal · 2026
 * ─────────────────────────────────────────
 */

'use strict';

/* ══════════════════════════════════════════
   1. NAVBAR — sticky + scroll + mobile
══════════════════════════════════════════ */
(function initNav() {
  const navbar     = document.getElementById('navbar');
  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks   = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  });

  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
    burger.innerHTML = isOpen
      ? '<i class="ti ti-x"></i>'
      : '<i class="ti ti-menu-2"></i>';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
      burger.innerHTML = '<i class="ti ti-menu-2"></i>';
    });
  });

  function updateActiveLink() {
    let current = '';
    document.querySelectorAll('section[id]').forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 110) current = sec.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }
})();


/* ══════════════════════════════════════════
   2. SMOOTH SCROLL
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});


/* ══════════════════════════════════════════
   3. ANIMATIONS INTERSECTION OBSERVER
══════════════════════════════════════════ */
(function initAnimations() {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.anim').forEach(el => io.observe(el));
})();


/* ══════════════════════════════════════════
   4. COMPTEURS ANIMÉS
══════════════════════════════════════════ */
(function initCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const end    = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      let cur = 0;
      const step = Math.max(1, Math.ceil(end / 60));
      const t = setInterval(() => {
        cur = Math.min(cur + step, end);
        el.textContent = cur + suffix;
        if (cur >= end) clearInterval(t);
      }, 22);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
})();


/* ══════════════════════════════════════════
   5. FILTRE PORTFOLIO
══════════════════════════════════════════ */
(function initFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      items.forEach(item => {
        const show = cat === 'all' || item.dataset.category === cat;
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
          item.style.display = show ? '' : 'none';
          if (show) {
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          }
        }, 200);
      });
    });
  });
})();


/* ══════════════════════════════════════════
   6. FORMULAIRE CONTACT
   → Envoi direct vers WhatsApp DFAD
══════════════════════════════════════════ */
(function initContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('focus', () => field.classList.remove('error'));
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = form.querySelector('.btn-submit');

    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });

    if (!valid) {
      showToast('⚠ Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    const prenom = form.querySelector('#prenom').value.trim();
    const nom = form.querySelector('#nom').value.trim();
    const telephone = form.querySelector('#telephone').value.trim();
    const service = form.querySelector('#service').value.trim() || 'Non précisé';
    const message = form.querySelector('#message').value.trim();

    const waMsg =
      '🔧 Nouvelle demande DFAD\n' +
      '👤 Nom : ' + prenom + ' ' + nom + '\n' +
      '📱 Téléphone : ' + telephone + '\n' +
      '⚙️ Service : ' + service + '\n' +
      '💬 Message : ' + message;

    const waURL = 'https://wa.me/237656876238?text=' + encodeURIComponent(waMsg);

    afficherModale(waURL, prenom);
    form.reset();

    if (btn) {
      btn.innerHTML = '<i class="ti ti-send"></i> Envoyer par WhatsApp & Email';
      btn.disabled = false;
    }
  });
})();

/* ════════════════════════════════════
   MODALE WHATSAPP — moderne et propre
════════════════════════════════════ */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function afficherModale(waURL, prenom) {
  const oldModal = document.getElementById('modal-wa');
  if (oldModal) oldModal.remove();

  const oldStyle = document.getElementById('style-modal-wa');
  if (oldStyle) oldStyle.remove();

  const modal = document.createElement('div');
  modal.id = 'modal-wa';

  modal.innerHTML = `
    <div class="mwa-overlay">
      <div class="mwa-box" role="dialog" aria-modal="true" aria-labelledby="mwa-title">
        <button type="button" class="mwa-close" id="mwa-close" aria-label="Fermer">
          <i class="ti ti-x"></i>
        </button>

        <div class="mwa-badge">
          <i class="ti ti-brand-whatsapp"></i>
          <span>Réponse rapide</span>
        </div>

        <div class="mwa-icon">
          <i class="ti ti-message-circle-2"></i>
        </div>

        <h3 id="mwa-title">Merci ${escapeHtml(prenom)} !</h3>
        <p class="mwa-text">
          Votre demande est prête à être envoyée.
          Cliquez sur le bouton ci-dessous pour ouvrir WhatsApp DFAD.
        </p>

        <a href="${waURL}" target="_blank" rel="noopener noreferrer" class="mwa-wa-btn" id="btn-wa-link">
          <i class="ti ti-brand-whatsapp"></i>
          <span>Envoyer sur WhatsApp · +237 656 876 238</span>
        </a>

        <div class="mwa-meta">
          <i class="ti ti-clock"></i>
          <span>Réponse rapide · 7j/7</span>
        </div>
      </div>
    </div>
  `;

  const style = document.createElement('style');
  style.id = 'style-modal-wa';
  style.textContent = `
    .mwa-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: rgba(2, 6, 23, 0.72);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .mwa-box {
      position: relative;
      width: min(100%, 470px);
      background: linear-gradient(145deg, #ffffff, #f8fafc);
      border: 1px solid rgba(15, 23, 42, 0.08);
      border-radius: 24px;
      padding: 30px 24px 24px;
      box-shadow: 0 24px 80px rgba(15, 23, 42, 0.25);
      text-align: center;
      animation: mwaPop 0.25s ease;
    }

    @keyframes mwaPop {
      from { opacity: 0; transform: translateY(12px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .mwa-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 7px 12px;
      border-radius: 999px;
      background: rgba(37, 211, 102, 0.12);
      color: #128c7e;
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 14px;
    }

    .mwa-icon {
      width: 72px;
      height: 72px;
      margin: 0 auto 14px;
      display: grid;
      place-items: center;
      border-radius: 999px;
      background: linear-gradient(135deg, #dcfce7, #bbf7d0);
      color: #128c7e;
      font-size: 1.8rem;
    }

    .mwa-box h3 {
      margin: 0 0 10px;
      font-size: 1.35rem;
      font-weight: 800;
      color: #0f172a;
    }

    .mwa-text {
      margin: 0 0 18px;
      color: #64748b;
      font-size: 0.95rem;
      line-height: 1.7;
    }

    .mwa-wa-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 14px 16px;
      border-radius: 999px;
      background: linear-gradient(135deg, #25d366, #128c7e);
      color: #fff;
      font-weight: 700;
      text-decoration: none;
      box-shadow: 0 12px 24px rgba(37, 211, 102, 0.24);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .mwa-wa-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 16px 28px rgba(37, 211, 102, 0.3);
    }

    .mwa-meta {
      margin-top: 14px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #0f766e;
      font-size: 0.88rem;
      font-weight: 600;
    }

    .mwa-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 999px;
      background: #f1f5f9;
      color: #475569;
      cursor: pointer;
      display: grid;
      place-items: center;
      transition: all 0.2s ease;
    }

    .mwa-close:hover {
      background: #e2e8f0;
      color: #0f172a;
    }

    @media (max-width: 480px) {
      .mwa-box {
        padding: 24px 18px 18px;
      }

      .mwa-wa-btn {
        font-size: 0.95rem;
      }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  const overlay = modal.querySelector('.mwa-overlay');
  const closeBtn = modal.querySelector('.mwa-close');

  const closeModal = () => {
    modal.remove();
    style.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeyDown);
  };

  const onKeyDown = (event) => {
    if (event.key === 'Escape') closeModal();
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeModal();
  });
  document.addEventListener('keydown', onKeyDown);
}


/* ══════════════════════════════════════════
   7. TOAST
══════════════════════════════════════════ */
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className   = 'toast ' + type + ' show';
  setTimeout(() => toast.classList.remove('show'), 4500);
}


/* ══════════════════════════════════════════
   8. LIGHTBOX GALERIE
══════════════════════════════════════════ */
(function initLightbox() {
  const box      = document.getElementById('lightbox');
  if (!box) return;
  const boxImg   = box.querySelector('.lb-img');
  const boxClose = box.querySelector('.lb-close');

  document.querySelectorAll('.gallery-img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      boxImg.src = img.src || img.dataset.src || '';
      boxImg.alt = img.alt;
      box.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLB() { box.classList.remove('open'); document.body.style.overflow = ''; }
  boxClose.addEventListener('click', closeLB);
  box.addEventListener('click', e => { if (e.target === box) closeLB(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });
})();


/* ══════════════════════════════════════════
   9. ANNÉE FOOTER
══════════════════════════════════════════ */
const yr = document.getElementById('current-year');
if (yr) yr.textContent = new Date().getFullYear();
