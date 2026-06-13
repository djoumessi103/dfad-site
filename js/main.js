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
   → Lien WhatsApp direct (href) sans JS fetch
   → Fonctionne même en local / hors connexion
══════════════════════════════════════════ */
(function initContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.querySelectorAll('input, textarea, select').forEach(f => {
    f.addEventListener('focus', () => f.classList.remove('error'));
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = form.querySelector('.btn-submit');

    // ── Validation ──
    let valid = true;
    form.querySelectorAll('[required]').forEach(f => {
      f.classList.remove('error');
      if (!f.value.trim()) { f.classList.add('error'); valid = false; }
    });
    if (!valid) {
      showToast('⚠ Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    // ── Récupération valeurs ──
    const prenom    = form.querySelector('#prenom').value.trim();
    const nom       = form.querySelector('#nom').value.trim();
    const telephone = form.querySelector('#telephone').value.trim();
    const service   = form.querySelector('#service').value.trim() || 'Non précisé';
    const message   = form.querySelector('#message').value.trim();

    // ── Construction du message WhatsApp ──
    const waMsg =
  '🔧 Nouvelle demande DFAD\n' +
  '👤 Nom : ' + prenom + ' ' + nom + '\n' +
  '📱 Téléphone : ' + telephone + '\n' +
  '⚙️ Service : ' + service + '\n' +
  '💬 Message : ' + message;

      '+_Site DFAD Mécatronique_+';

    const waURL = 'https://wa.me/237690304985?text=' + encodeURIComponent(waMsg);

    // ── Afficher la modale ──
    afficherModale(waURL, prenom);
    form.reset();
    btn.innerHTML = '<i class="ti ti-send"></i> Envoyer par WhatsApp & Email';
    btn.disabled = false;
  });
})();

/* ════════════════════════════════════
   MODALE WHATSAPP — lien <a> direct
════════════════════════════════════ */
function afficherModale(waURL, prenom) {
  const ancien = document.getElementById('modal-wa');
  if (ancien) ancien.remove();

  const div = document.createElement('div');
  div.id = 'modal-wa';
 div.innerHTML =
  '<div class="mwa-overlay">' +
    '<div class="mwa-box">' +
      '<div class="mwa-top">' +
        '<span class="mwa-emoji">✅</span>' +
        '<h3>Merci ' + prenom + ' !</h3>' +
        '<p>Votre demande est prête.<br>Cliquez sur le bouton vert pour envoyer directement le message sur WhatsApp DFAD.</p>' +
      '</div>' +
      '<a href="' + waURL + '" target="_blank" rel="noopener" class="mwa-wa-btn" id="btn-wa-link">' +
        '<svg ...></svg>' +
        'Envoyer sur WhatsApp · 690 304 985' +
      '</a>' +
      '<p class="mwa-hint">👆 Appuyez sur ce bouton — WhatsApp s\'ouvre avec le message prêt à envoyer</p>' +
    '</div>' +
  '</div>';

  // Styles
const st = document.createElement('style');
st.id = 'style-modal-wa';
st.textContent =
    '.mwa-overlay{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.7);' +
    'backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px;}' +
    '.mwa-box{background:#fff;border-radius:20px;padding:36px 28px;max-width:400px;width:100%;' +
    'text-align:center;box-shadow:0 32px 80px rgba(0,0,0,.35);animation:popIn .28s cubic-bezier(.34,1.56,.64,1);}' +
    '@keyframes popIn{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}' +
    '.mwa-top .mwa-emoji{font-size:3.2rem;display:block;margin-bottom:10px;}' +
    '.mwa-box h3{font-size:1.35rem;font-weight:700;color:#0b1f3a;margin-bottom:8px;}' +
    '.mwa-box p{font-size:.9rem;color:#64748b;line-height:1.6;margin-bottom:0;}' +
    '.mwa-wa-btn{display:flex;align-items:center;justify-content:center;gap:10px;' +
    'background:#25d366;color:#fff;font-size:1.05rem;font-weight:700;' +
    'padding:16px 24px;border-radius:12px;text-decoration:none;' +
    'margin:24px 0 10px;box-shadow:0 6px 20px rgba(37,211,102,.4);' +
    'transition:all .2s;border:none;cursor:pointer;}' +
    '.mwa-wa-btn:hover{background:#1ebe5d;transform:translateY(-2px);box-shadow:0 10px 28px rgba(37,211,102,.5);}' +
    '.mwa-hint{font-size:.78rem;color:#94a3b8;margin-bottom:20px;}' +
    '.mwa-close{background:none;border:1.5px solid #e2e8f0;color:#94a3b8;' +
    'font-size:.85rem;padding:9px 28px;border-radius:8px;cursor:pointer;transition:all .2s;}' +
    '.mwa-close:hover{background:#f8fafc;color:#475569;}';

  const ancienStyle = document.getElementById('style-modal-wa');
  if (ancienStyle) ancienStyle.remove();
  document.head.appendChild(st);
  document.body.appendChild(div);

  document.getElementById('btn-mwa-close').onclick = function() {
    div.remove(); st.remove();
  };
  div.querySelector('.mwa-overlay').addEventListener('click', function(e) {
    if (e.target === this) { div.remove(); st.remove(); }
  });
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
