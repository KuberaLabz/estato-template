/* ============================================================
   ESTATO — main.js  v2 (polished)
   Custom cursor · Build · Nav · Counters · GSAP · Modals · Vapi
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  initCursor();
  buildSite();
  initNavbar();
  initMobileDrawer();
  initForm();
  initModals();
  initAnimations();
  initCounters();
  initVapi();
  // Refresh after fonts/images settle so ScrollTrigger measures correct positions
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
});

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  // Use CSS transform3d so cursor is on its own compositor layer — no reflow
  let mx = -100, my = -100, rx = -100, ry = -100;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    rx = lerp(rx, mx, 0.1);
    ry = lerp(ry, my, 0.1);
    dot.style.transform  = `translate3d(calc(${mx}px - 50%), calc(${my}px - 50%), 0)`;
    ring.style.transform = `translate3d(calc(${rx}px - 50%), calc(${ry}px - 50%), 0)`;
    requestAnimationFrame(tick);
  }
  // Remove old left/top positioning — use transform only
  dot.style.left = '0'; dot.style.top = '0';
  ring.style.left = '0'; ring.style.top = '0';
  requestAnimationFrame(tick);

  const hoverEls = 'a, button, [data-hover], .listing-card, .agent-card, .journal-card, .area-row, .pillar-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverEls)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverEls)) document.body.classList.remove('cursor-hover');
  });

  const darkSections = ['#hero', '#stats-strip', '#approach', '#areas', '#contact', '#footer'];
  function updateCursorTheme() {
    const midY = window.scrollY + window.innerHeight * 0.5;
    let inDark = false;
    darkSections.forEach(sel => {
      const el = document.querySelector(sel);
      if (!el) return;
      if (midY >= el.offsetTop && midY < el.offsetTop + el.offsetHeight) inDark = true;
    });
    document.body.classList.toggle('cursor-dark', inDark);
  }
  window.addEventListener('scroll', updateCursorTheme, { passive: true });
  updateCursorTheme();

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
}

/* ============================================================
   BUILD SITE FROM CONFIG
   ============================================================ */
function buildSite() {
  q('[data-firm-name]',  el => el.textContent = CONFIG.firmName);
  q('[data-legal-name]', el => el.textContent = CONFIG.legalName);
  q('[data-legal-year]', el => el.textContent = CONFIG.legalYear);
  q('[data-email]',      el => { el.textContent = CONFIG.email; el.href = `mailto:${CONFIG.email}`; });
  q('[data-phone]',      el => { el.textContent = CONFIG.phone; el.href = `tel:${CONFIG.phone.replace(/\D/g,'')}`; });
  q('[data-address]',    el => el.textContent = CONFIG.address);
  q('[data-city]',       el => el.textContent = CONFIG.city);
  q('[data-calendar]',   el => el.setAttribute('href', CONFIG.calendarLink));
  q('[data-firm-tagline]', el => el.textContent = CONFIG.firmTagline);

  // Nav
  const navEl = document.getElementById('nav-links');
  if (navEl) navEl.innerHTML = CONFIG.navLinks.map(l => `<a href="${l.href}">${l.label}</a>`).join('');
  const mobileNavEl = document.getElementById('mobile-nav-links');
  if (mobileNavEl) mobileNavEl.innerHTML = CONFIG.navLinks.map(l => `<a href="${l.href}">${l.label}</a>`).join('');

  // Hero
  setHTML('hero-eyebrow',  CONFIG.heroEyebrow);
  setHTML('hero-headline', CONFIG.heroHeadline);
  setHTML('hero-sub',      CONFIG.heroSub);

  // Stats strip
  const statsEl = document.getElementById('stats-strip-inner');
  if (statsEl) statsEl.innerHTML = CONFIG.stats.map(s => `
    <div class="stat-cell">
      <div class="stat-number">
        <span class="counter" data-target="${s.value}" data-float="${s.value.includes('.') ? '1' : '0'}">${s.value}</span>
        <span class="suffix">${s.suffix}</span>
      </div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join('');

  // ---- LISTINGS — 9-card bento layout ----
  // Row 1: [large+tall L001] [L002] [L003]  (L001 spans 2 cols + 2 rows)
  // Row 2: [large+tall cont] [L004] [L005]
  // Row 3: [L006] [large L007 spans 2] [nothing — auto]
  // Row 4: [L007 cont? No — L007 normal large] ... actually:
  // Better bento for 9:
  // Row 1: [LARGE L001 col 1-2] [L002 col 3]
  // Row 2: [TALL  L001 row2   ] [L003 col 2] [L004 col 3]  ← L001 is large+tall = 2col 2row
  //   ... which means col layout for 9 cards:
  //   0: large+tall (col 1-2, row 1-2)
  //   1: normal (col 3, row 1)
  //   2: normal (col 3, row 2)  [sits right of tall card row 2]
  //   3: normal (col 1, row 3)
  //   4: normal (col 2, row 3)
  //   5: normal (col 3, row 3)
  //   6: normal (col 1, row 4)
  //   7: large (col 2-3, row 4)
  //   8: normal extra row

  const listEl = document.getElementById('listings-grid');
  if (listEl) listEl.innerHTML = CONFIG.listings.map((l, i) => {
    // Bento assignments for 9 cards
    const isLargeTall = i === 0;           // spans 2 cols + 2 rows — hero card
    const isLarge     = i === 7;           // spans 2 cols — penultimate row feature
    const isTall      = false;             // tall handled by isLargeTall only

    let cls = 'listing-card g-scale';
    if (isLargeTall) cls += ' large tall';
    else if (isLarge) cls += ' large';

    const tagCls = (l.tag === 'Off Market') ? 'listing-tag off-market' : 'listing-tag';

    return `
    <div class="${cls}" data-listing="${l.id}" role="button" tabindex="0" aria-label="View ${l.address}">
      <div class="listing-card-bg listing-bg-${l.bgIndex}">
        <div class="listing-overlay">
          ${l.tag ? `<div class="${tagCls}">${l.tag}</div>` : ''}
          <div class="listing-neighborhood">${l.neighborhood}</div>
          <div class="listing-address">${l.address}</div>
          <div class="listing-price">${l.price}</div>
          <div class="listing-specs">
            <span class="listing-spec"><span>${l.beds}</span> BD</span>
            <span class="listing-spec"><span>${l.baths}</span> BA</span>
            <span class="listing-spec"><span>${l.sqft}</span> SF</span>
            <span class="listing-spec">${l.type}</span>
          </div>
          <div class="listing-details">
            <div class="listing-desc">${l.desc}</div>
            <div class="listing-cta">
              Private Enquiry
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  // Approach pillars
  const pillarsEl = document.getElementById('approach-pillars');
  if (pillarsEl) pillarsEl.innerHTML = CONFIG.approachPillars.map(p => `
    <div class="pillar-card">
      <span class="pillar-number">${p.number}</span>
      <div class="pillar-title">${p.title}</div>
      <p class="pillar-desc">${p.desc}</p>
    </div>
  `).join('');
  setHTML('approach-headline-text', CONFIG.approachHeadline);
  setHTML('approach-text', CONFIG.approachText);

  // Testimonials
  const testEl = document.getElementById('testimonials-grid');
  if (testEl) testEl.innerHTML = CONFIG.testimonials.map(t => `
    <div class="testimonial-card g-up">
      <span class="tc-mark">"</span>
      <p class="tc-quote">${t.quote}</p>
      <div class="tc-author">
        <div class="tc-avatar">${t.initials}</div>
        <div>
          <div class="tc-name">${t.name}</div>
          <div class="tc-title">${t.title}</div>
        </div>
      </div>
    </div>
  `).join('');

  // Team
  const teamEl = document.getElementById('team-grid');
  if (teamEl) teamEl.innerHTML = CONFIG.team.map(a => `
    <div class="agent-card g-scale">
      <div class="agent-portrait">
        <div class="agent-portrait-bg agent-portrait-bg-${a.colorIndex}">
          <span class="agent-initials-large">${a.initials}</span>
        </div>
        <div class="agent-portrait-overlay"></div>
        <div class="agent-portrait-spec">${a.specialty}</div>
      </div>
      <div class="agent-info">
        <div class="agent-name">${a.name}</div>
        <div class="agent-title">${a.title}</div>
        <p class="agent-bio">${a.bio}</p>
        <div class="agent-closing">
          <div>
            <div class="agent-closing-val">${a.closings}</div>
            <div class="agent-closing-lbl">Career Volume</div>
          </div>
          <button class="agent-contact-btn" data-calendar>Contact</button>
        </div>
      </div>
    </div>
  `).join('');

  // Areas
  const areasEl = document.getElementById('areas-list');
  if (areasEl) areasEl.innerHTML = CONFIG.areas.map(a => `
    <div class="area-row g-up">
      <div class="area-name">${a.name}</div>
      <div class="area-desc">${a.desc}</div>
      <div style="display:flex;align-items:center;justify-content:flex-end;gap:16px;">
        <div class="area-count">${a.count}</div>
        <div class="area-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </div>
    </div>
  `).join('');

  // Journal
  const journalEl = document.getElementById('journal-posts');
  if (journalEl) journalEl.innerHTML = CONFIG.journalPosts.map((p, i) => `
    <div class="journal-card g-up">
      <div class="journal-card-img">
        <div class="journal-img-bg journal-img-${i}"></div>
      </div>
      <div class="journal-card-body">
        <div class="journal-category">${p.category}</div>
        <div class="journal-title">${p.title}</div>
        <div class="journal-meta">
          <span>${p.date}</span>
          <span>${p.read}</span>
        </div>
      </div>
    </div>
  `).join('');

  // Listing card click → modal
  document.addEventListener('click', e => {
    const card = e.target.closest('[data-listing]');
    if (!card) return;
    const listing = CONFIG.listings.find(l => l.id === card.getAttribute('data-listing'));
    if (listing) openListingModal(listing);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const card = e.target.closest('[data-listing]');
      if (card) card.click();
    }
  });
}

function q(sel, fn)      { document.querySelectorAll(sel).forEach(fn); }
function setHTML(id, val) { const el = document.getElementById(id); if (el && val !== undefined) el.innerHTML = val; }

/* ============================================================
   NAVBAR
   ============================================================ */
function initNavbar() {
  const nb    = document.getElementById('navbar');
  const links = document.querySelectorAll('#nav-links a');

  window.addEventListener('scroll', () => {
    nb.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveLink(links);
  }, { passive: true });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const yPos = target.getBoundingClientRect().top + window.scrollY - 76;
        window.scrollTo({ top: yPos, behavior: 'smooth' });
      }
    });
  });
}

function updateActiveLink(links) {
  const sections = ['hero','listings','approach','team','areas','journal','contact'];
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 140) current = id;
  });
  links.forEach(a => {
    const href = a.getAttribute('href').replace('#','');
    a.classList.toggle('active', href === current);
  });
}

/* ============================================================
   MOBILE DRAWER
   ============================================================ */
function initMobileDrawer() {
  const hamburger = document.getElementById('nav-hamburger');
  const drawer    = document.getElementById('mobile-drawer');
  const overlay   = document.getElementById('mobile-overlay');
  const closeBtn  = document.getElementById('mobile-drawer-close');

  const open  = () => { drawer.classList.add('open'); overlay.classList.add('open'); hamburger.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { drawer.classList.remove('open'); overlay.classList.remove('open'); hamburger.classList.remove('open'); document.body.style.overflow = ''; };

  if (hamburger) hamburger.addEventListener('click', open);
  if (closeBtn)  closeBtn.addEventListener('click', close);
  if (overlay)   overlay.addEventListener('click', close);
  document.querySelectorAll('#mobile-nav-links a').forEach(a => a.addEventListener('click', close));
}

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;
  const seen = new Set();
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || seen.has(entry.target)) return;
      seen.add(entry.target);
      const el      = entry.target;
      const isFloat = el.getAttribute('data-float') === '1';
      const target  = parseFloat(el.getAttribute('data-target'));
      const obj     = { v: 0 };
      gsap.to(obj, {
        v: target,
        duration: 2.2,
        ease: 'power3.out',
        onUpdate() { el.textContent = isFloat ? obj.v.toFixed(1) : Math.round(obj.v); },
        onComplete() { el.textContent = isFloat ? target.toFixed(1) : target; },
      });
    });
  }, { threshold: 0.5 });
  counters.forEach(el => obs.observe(el));
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('.form-submit-btn');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled    = true;
    setTimeout(() => {
      btn.textContent   = '✓ Received. We\'ll be in touch within 24 hours.';
      btn.style.background = '#2a6e3e';
      btn.style.color      = 'white';
      setTimeout(() => {
        btn.textContent   = orig;
        btn.style.background = '';
        btn.style.color      = '';
        btn.disabled         = false;
        form.reset();
      }, 5000);
    }, 1400);
  });
}

/* ============================================================
   LISTING MODAL
   ============================================================ */
function openListingModal(listing) {
  const backdrop = document.getElementById('modal-backdrop');
  const panel    = document.getElementById('modal-panel');
  const title    = document.getElementById('modal-panel-title');
  const body     = document.getElementById('modal-panel-body');
  if (!backdrop) return;

  title.textContent = listing.address;
  body.innerHTML = `
    <div style="display:flex;align-items:baseline;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid var(--bl);">
      <span style="font-family:var(--serif);font-size:2.2rem;font-weight:300;color:var(--ink);letter-spacing:-0.03em;">${listing.price}</span>
      <span style="font-size:0.65rem;font-weight:600;text-transform:uppercase;letter-spacing:2.5px;color:var(--gold);">${listing.neighborhood}</span>
    </div>
    <p style="font-size:0.92rem;color:var(--ink-3);line-height:1.85;margin-bottom:24px;">${listing.desc}</p>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid var(--bl);">
      <div style="text-align:center;padding:16px;background:var(--parchment-2);border-radius:var(--r-sm);">
        <div style="font-family:var(--serif);font-size:1.6rem;font-weight:300;color:var(--ink);">${listing.beds}</div>
        <div style="font-size:0.62rem;text-transform:uppercase;letter-spacing:2px;color:var(--ink-3);margin-top:3px;">Bedrooms</div>
      </div>
      <div style="text-align:center;padding:16px;background:var(--parchment-2);border-radius:var(--r-sm);">
        <div style="font-family:var(--serif);font-size:1.6rem;font-weight:300;color:var(--ink);">${listing.baths}</div>
        <div style="font-size:0.62rem;text-transform:uppercase;letter-spacing:2px;color:var(--ink-3);margin-top:3px;">Bathrooms</div>
      </div>
      <div style="text-align:center;padding:16px;background:var(--parchment-2);border-radius:var(--r-sm);">
        <div style="font-family:var(--serif);font-size:1.6rem;font-weight:300;color:var(--ink);">${listing.sqft}</div>
        <div style="font-size:0.62rem;text-transform:uppercase;letter-spacing:2px;color:var(--ink-3);margin-top:3px;">Sq Ft</div>
      </div>
    </div>
    <h3 style="font-family:var(--serif);font-size:1rem;font-weight:400;color:var(--ink);margin-bottom:12px;">Property Highlights</h3>
    <ul style="margin-bottom:28px;">
      ${listing.features.map(f => `
      <li style="display:flex;align-items:center;gap:10px;font-size:0.88rem;color:var(--ink-3);padding:8px 0;border-bottom:1px solid var(--bl);line-height:1.5;">
        <span style="width:4px;height:4px;background:var(--gold);border-radius:50%;flex-shrink:0;"></span>${f}
      </li>`).join('')}
    </ul>
    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      <a href="${CONFIG.calendarLink}" class="btn-gold" style="flex:1;justify-content:center;">Request Private Viewing</a>
      <a href="mailto:${CONFIG.email}" class="btn-outline" style="flex:1;justify-content:center;">Email Our Team</a>
    </div>
    <p style="font-size:0.72rem;color:var(--ink-4);text-align:center;margin-top:12px;">Handled by ${listing.agent} · Listed by Estato Realty Group</p>
  `;
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  panel.scrollTop = 0;
}

/* ============================================================
   MODALS — Privacy / Terms / Legal
   ============================================================ */
const PRIVACY_HTML = `
<h3>Privacy Policy</h3>
<p>Last updated: January 2026. ${CONFIG.legalName} ("we", "our") is committed to protecting your privacy.</p>
<h3>Information We Collect</h3>
<p>We collect information you voluntarily provide: name, email, phone number, and inquiry details submitted through our contact form.</p>
<ul>
  <li>Contact form submissions and inquiries</li>
  <li>Viewing appointment requests</li>
  <li>Usage data (pages visited, time on site) via analytics</li>
</ul>
<h3>How We Use Your Information</h3>
<p>Your information is used solely to respond to your real estate inquiries and provide our services. We do not sell or share your data with third parties outside of transaction-required parties (title, escrow, lenders).</p>
<h3>Confidentiality</h3>
<p>All client information is held in strict confidence. We treat all inquiries with the same discretion we extend to our most private clients.</p>
<h3>Communications</h3>
<p>If you provide your email, we may send market updates. You may unsubscribe at any time by contacting <a href="mailto:${CONFIG.privacyEmail}">${CONFIG.privacyEmail}</a>.</p>
<h3>Your Rights</h3>
<p>You have the right to access, correct, or delete your personal data. Contact us at <a href="mailto:${CONFIG.privacyEmail}">${CONFIG.privacyEmail}</a>.</p>
`;

const TERMS_HTML = `
<h3>Terms &amp; Conditions</h3>
<p>Last updated: January 2026. By using this website and engaging ${CONFIG.legalName}, you agree to the following.</p>
<h3>Services</h3>
<p>Estato Realty Group provides residential real estate representation in California. All listings are subject to change, withdrawal, or prior sale without notice.</p>
<h3>Property Information</h3>
<p>All property information is believed accurate but not guaranteed. Square footage, features, and pricing are subject to verification. Buyers are encouraged to conduct independent due diligence.</p>
<h3>Limitation of Liability</h3>
<p>${CONFIG.legalName} is not liable for errors in property descriptions, market valuations, or outcomes of transactions.</p>
<h3>Governing Law</h3>
<p>These terms are governed by the laws of the State of California.</p>
<h3>Contact</h3>
<p>Questions? Reach us at <a href="mailto:${CONFIG.email}">${CONFIG.email}</a>.</p>
`;

function initModals() {
  const backdrop = document.getElementById('modal-backdrop');
  const panel    = document.getElementById('modal-panel');
  const title    = document.getElementById('modal-panel-title');
  const body     = document.getElementById('modal-panel-body');
  const closeBtn = document.getElementById('modal-panel-close');

  const closeModal = () => { backdrop.classList.remove('open'); document.body.style.overflow = ''; };

  document.querySelectorAll('[data-modal]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const which = el.getAttribute('data-modal');
      if (which === 'privacy') { title.textContent = 'Privacy Policy'; body.innerHTML = PRIVACY_HTML; }
      if (which === 'terms')   { title.textContent = 'Terms & Conditions'; body.innerHTML = TERMS_HTML; }
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      panel.scrollTop = 0;
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ============================================================
   GSAP ANIMATIONS — smooth, GPU-composited
   ============================================================ */
function initAnimations() {

  // Helper — release will-change after animation completes to free GPU memory
  const onDone = (targets) => {
    gsap.set(targets, { willChange: 'auto' });
  };

  // Safety: ensure all elements visible before GSAP takes over
  ['.stat-cell','.listing-card','.approach-left','.pillar-card',
   '.testimonial-card','.agent-card','.area-row','.journal-card',
   '.contact-left','.contact-form-box'].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => { el.style.opacity = '1'; });
  });

  // ---- Hero entrance ----
  const htl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  htl
    .from('.hero-bg',             { opacity: 0, duration: 1.2, ease: 'power1.out' })
    .from('#hero-eyebrow',        { y: 20, opacity: 0, duration: 0.8 }, '-=0.8')
    .from('#hero-headline',       { y: 52, opacity: 0, duration: 1.1 }, '-=0.55')
    .from('#hero-sub',            { y: 24, opacity: 0, duration: 0.9 }, '-=0.6')
    .from('#hero-actions',        { y: 20, opacity: 0, duration: 0.75 }, '-=0.55')
    .from('.hero-illustration',   { opacity: 0, x: 40, duration: 1.0, ease: 'power2.out' }, '<-0.3')
    .from('.hero-property-count', { opacity: 0, y: 14, duration: 0.65 }, '-=0.4')
    .from('.hero-scroll-cue',     { opacity: 0, y: 10, duration: 0.5 }, '-=0.2');

  // ---- Stats strip ----
  gsap.from('.stat-cell', {
    opacity: 0, y: 28, stagger: 0.1, duration: 0.75, ease: 'power2.out',
    immediateRender: false,
    scrollTrigger: { trigger: '#stats-strip', start: 'top 95%', once: true, invalidateOnRefresh: true },
  });

  // ---- Listings ----
  gsap.from('.listing-card', {
    opacity: 0, y: 32, scale: 0.97, stagger: 0.08, duration: 0.7, ease: 'power2.out',
    immediateRender: false,
    scrollTrigger: { trigger: '#listings', start: 'top 95%', once: true, invalidateOnRefresh: true },
    onComplete() { onDone('.listing-card'); }
  });

  // ---- Approach ----
  gsap.from('.approach-left', {
    opacity: 0, x: -32, duration: 0.9, ease: 'power2.out',
    immediateRender: false,
    scrollTrigger: { trigger: '#approach', start: 'top 95%', once: true, invalidateOnRefresh: true },
  });
  gsap.from('.pillar-card', {
    opacity: 0, y: 24, stagger: 0.12, duration: 0.7, ease: 'power2.out',
    immediateRender: false,
    scrollTrigger: { trigger: '#approach', start: 'top 95%', once: true, invalidateOnRefresh: true },
    onComplete() { onDone('.pillar-card'); }
  });

  // ---- Testimonials ----
  gsap.from('.testimonial-card', {
    opacity: 0, y: 28, stagger: 0.15, duration: 0.75, ease: 'power2.out',
    immediateRender: false,
    scrollTrigger: { trigger: '#testimonials', start: 'top 95%', once: true, invalidateOnRefresh: true },
    onComplete() { onDone('.testimonial-card'); }
  });

  // ---- Team ----
  gsap.from('.agent-card', {
    opacity: 0, y: 28, scale: 0.97, stagger: 0.12, duration: 0.75, ease: 'power2.out',
    immediateRender: false,
    scrollTrigger: { trigger: '#team', start: 'top 95%', once: true, invalidateOnRefresh: true },
    onComplete() { onDone('.agent-card'); }
  });

  // ---- Areas rows — slide in from left ----
  gsap.from('.area-row', {
    opacity: 0, x: -24, stagger: 0.1, duration: 0.7, ease: 'power2.out',
    immediateRender: false,
    scrollTrigger: { trigger: '#areas', start: 'top 95%', once: true, invalidateOnRefresh: true },
    onComplete() { onDone('.area-row'); }
  });

  // ---- Journal ----
  gsap.from('.journal-card', {
    opacity: 0, y: 24, stagger: 0.12, duration: 0.7, ease: 'power2.out',
    immediateRender: false,
    scrollTrigger: { trigger: '#journal', start: 'top 95%', once: true, invalidateOnRefresh: true },
    onComplete() { onDone('.journal-card'); }
  });

  // ---- Contact ----
  gsap.from('.contact-left', {
    opacity: 0, x: -28, duration: 0.9, ease: 'power2.out',
    immediateRender: false,
    scrollTrigger: { trigger: '#contact', start: 'top 95%', once: true, invalidateOnRefresh: true },
  });
  gsap.from('.contact-form-box', {
    opacity: 0, x: 28, duration: 0.9, ease: 'power2.out',
    immediateRender: false,
    scrollTrigger: { trigger: '#contact', start: 'top 95%', once: true, invalidateOnRefresh: true },
  });

  // ---- CTA watermark drift — static, no scrub (avoids jitter in iframe) ----
  gsap.set('.cta-bg-watermark', { x: 40 });

  // ---- Section headers (eyebrow + headline) ----
  document.querySelectorAll('.eyebrow, .display-headline').forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 18, duration: 0.75, ease: 'power2.out',
      immediateRender: false,
      scrollTrigger: { trigger: el, start: 'top 98%', once: true, invalidateOnRefresh: true },
    });
  });
}

/* ============================================================
   VAPI
   ============================================================ */
function initVapi() {
  if (!CONFIG.vapiPublicKey || CONFIG.vapiPublicKey === 'YOUR_VAPI_PUBLIC_KEY') return;
  const script = document.createElement('script');
  script.src   = 'https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js';
  script.async = true;
  script.onload = () => {
    const w = document.createElement('vapi-widget');
    w.setAttribute('public-key',          CONFIG.vapiPublicKey);
    w.setAttribute('assistant-id',        CONFIG.vapiAssistantId);
    w.setAttribute('mode',                'chat');
    w.setAttribute('theme',               'dark');
    w.setAttribute('position',            'bottom-right');
    w.setAttribute('size',                'full');
    w.setAttribute('base-color',          '#161210');
    w.setAttribute('accent-color',        '#C9A96E');
    w.setAttribute('button-base-color',   '#C9A96E');
    w.setAttribute('button-accent-color', '#0E0C0A');
    w.setAttribute('main-label',          'AI Concierge');
    w.setAttribute('empty-chat-message',  CONFIG.chatWelcome);
    document.body.appendChild(w);
  };
  document.head.appendChild(script);

  document.querySelectorAll('.vapi-voice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = document.createElement('vapi-widget');
      v.setAttribute('public-key',   CONFIG.vapiPublicKey);
      v.setAttribute('assistant-id', CONFIG.vapiAssistantId);
      v.setAttribute('mode',         'voice');
      v.setAttribute('theme',        'dark');
      v.setAttribute('position',     'bottom-left');
      v.setAttribute('size',         'compact');
      v.setAttribute('accent-color', '#C9A96E');
      document.body.appendChild(v);
      v.addEventListener('call-end', () => setTimeout(() => v.remove(), 1000));
    });
  });
}
