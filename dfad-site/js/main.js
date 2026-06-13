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
   → WhatsApp 690304985 + Email via EmailJS
   → djoujesica86@gmail.com
══════════════════════════════════════════ */
(function initContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Retirer erreur au focus
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
    if (!valid) { showToast('⚠ Veuillez remplir tous les champs obligatoires.', 'error'); return; }

    // ── Récupération des valeurs ──
    const prenom    = (form.querySelector('#prenom')?.value || '').trim();
    const nom       = (form.querySelector('#nom')?.value || '').trim();
    const telephone = (form.querySelector('#telephone')?.value || '').trim();
    const service   = (form.querySelector('#service')?.value || 'Non précisé').trim();
    const message   = (form.querySelector('#message')?.value || '').trim();

    btn.disabled = true;
    btn.innerHTML = '<i class="ti ti-loader-2 spin"></i> Envoi en cours...';

    // ── 1. WHATSAPP ──
    // Ouvre WhatsApp avec le message pré-rempli vers le numéro DFAD
    const waText = encodeURIComponent(
      `🔧 *Nouvelle demande DFAD*

` +
      `👤 *Nom :* ${prenom} ${nom}
` +
      `📱 *Téléphone :* ${telephone}
` +
      `⚙️ *Service :* ${service}

` +
      `📝 *Message :*
${message}

` +
      `---
_Envoyé depuis le site DFAD Mécatronique_`
    );
    const waURL = `https://wa.me/237690304985?text=${waText}`;
    window.open(waURL, '_blank');

    // ── 2. EMAIL via EmailJS ──
    // EmailJS envoie directement vers djoujesica86@gmail.com
    // sans serveur backend. Paramètres à configurer sur emailjs.com :
    //   Service ID  : service_dfad
    //   Template ID : template_dfad
    //   Public Key  : à coller ci-dessous après création du compte
    const EMAILJS_PUBLIC_KEY  = 'VOTRE_CLE_PUBLIQUE_EMAILJS'; // ← à remplacer
    const EMAILJS_SERVICE_ID  = 'service_dfad';
    const EMAILJS_TEMPLATE_ID = 'template_dfad';

    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'VOTRE_CLE_PUBLIQUE_EMAILJS') {
      emailjs.init(EMAILJS_PUBLIC_KEY);
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name : `${prenom} ${nom}`,
        from_phone: telephone,
        service   : service,
        message   : message,
        to_email  : 'djoujesica86@gmail.com',
        reply_to  : telephone,
      })
      .then(() => {
        console.log('Email envoyé avec succès');
      })
      .catch(err => {
        console.warn('Erreur EmailJS :', err);
      });
    }

    // ── Confirmation finale ──
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="ti ti-send"></i> Envoyer le message';
      form.reset();
      showToast('✅ Message envoyé ! WhatsApp ouvert — nous vous contactons sous 24h.', 'success');
    }, 1200);
  });
})();


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
