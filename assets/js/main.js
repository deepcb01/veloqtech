// ===== Veloqtech — main.js =====
// Populates dynamic content and wires up all interactions.

// ---- helpers ----
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
const icon = (name) => ICONS[name] || '';

// ---- announcement + header ----
(function initHeader() {
  const header = $('#siteHeader');
  const bar = $('#headerBar');
  let last = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    bar.classList.toggle('scrolled', y > 24);
    if (y > 120 && y > last) header.classList.add('hidden');
    else header.classList.remove('hidden');
    last = y;
  }, { passive: true });

  // mobile menu
  const menu = $('#mobileMenu');
  const open = () => menu.classList.remove('closed');
  const close = () => menu.classList.add('closed');
  $('#menuOpen')?.addEventListener('click', open);
  $('#menuClose')?.addEventListener('click', close);
  $$('.mobile-menu-overlay, [data-menu-close]').forEach((n) => n.addEventListener('click', close));

  // active nav highlight via IntersectionObserver
  const navLinks = $$('#primaryNav a[data-section]');
  const sections = navLinks.map((a) => document.getElementById(a.dataset.section)).filter(Boolean);
  if (sections.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = e.target.id;
          navLinks.forEach((a) => a.classList.toggle('active', a.dataset.section === id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => io.observe(s));
  }
})();

// ---- scroll progress ----
(function initScrollProgress() {
  const bar = $('#scrollBar');
  if (!bar) return;
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ---- reveal on scroll ----
(function initReveal() {
  const seen = new WeakSet();
  const reveal = (node) => {
    if (seen.has(node)) return;
    seen.add(node);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || '0', 10);
          setTimeout(() => entry.target.classList.add('is-visible'), delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    io.observe(node);
  };
  const scan = () => $$('.reveal:not(.is-visible)').forEach((n) => { if (!seen.has(n)) reveal(n); });
  scan();
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
})();

// ---- marquee ----
(function initMarquee() {
  const track = $('#marqueeTrack');
  if (!track) return;
  const row = [...MARQUEE, ...MARQUEE];
  track.innerHTML = row.map((c) =>
    `<div class="marquee-item">${icon(c.icon)}<span style="font-size:0.875rem;font-weight:600;color:var(--primary-700);white-space:nowrap">${c.label}</span></div>`
  ).join('');
})();

// ---- why choose us ----
(function initWhy() {
  const grid = $('#whyGrid');
  if (!grid) return;
  grid.innerHTML = WHY.map((r, i) => `
    <article class="reveal card card-hover" style="padding:1.75rem;position:relative;overflow:hidden" data-delay="${i * 70}">
      <div style="position:absolute;right:-2.5rem;top:-2.5rem;height:7rem;width:7rem;border-radius:999px;background:rgba(37,99,235,0.05);transition:transform 0.5s" onmouseover="this.style.transform='scale(1.5)'" onmouseout="this.style.transform='scale(1)'"></div>
      <div style="position:relative">
        <span style="display:grid;place-items:center;height:3rem;width:3rem;border-radius:0.75rem;background:linear-gradient(135deg,rgba(37,99,235,0.1),rgba(6,182,212,0.1));color:var(--color-secondary);ring:1px solid rgba(37,99,235,0.1)">${icon(r.icon)}</span>
        <h3 style="margin-top:1.25rem;font-size:1.25rem;font-weight:700;color:var(--primary-900)">${r.title}</h3>
        <p style="margin-top:0.5rem;font-size:0.9375rem;color:var(--primary-600);line-height:1.6">${r.desc}</p>
      </div>
    </article>
  `).join('');
})();

// ---- services preview ----
(function initServices() {
  const grid = $('#servicesGrid');
  if (!grid) return;
  grid.innerHTML = SERVICES.map((s, i) => `
    <article class="reveal card card-hover" style="padding:1.75rem" data-delay="${(i % 3) * 70}">
      <div style="display:flex;align-items:flex-start;justify-content:space-between">
        <span style="display:grid;place-items:center;height:3rem;width:3rem;border-radius:0.75rem;background:linear-gradient(135deg,var(--color-secondary),var(--color-accent));color:#fff;box-shadow:var(--shadow-glow)">${icon(s.icon)}</span>
        <span style="color:var(--primary-300);transition:all 0.3s" onmouseover="this.style.color='var(--color-secondary)';this.style.transform='translateX(4px)'" onmouseout="this.style.color='var(--primary-300)';this.style.transform=''">${I.arrowRight}</span>
      </div>
      <h3 style="margin-top:1.25rem;font-size:1.125rem;font-weight:700;color:var(--primary-900)">${s.title}</h3>
      <p style="margin-top:0.5rem;font-size:0.9375rem;color:var(--primary-600);line-height:1.6">${s.desc}</p>
    </article>
  `).join('');
})();

// ---- creative services ----
(function initCreative() {
  const grid = $('#creativeGrid');
  if (!grid) return;
  grid.innerHTML = CREATIVE.map((cat, i) => `
    <article class="reveal" style="border-radius:var(--radius-xl3);overflow:hidden;border:1px solid var(--color-border);background:#fff;box-shadow:var(--shadow-card);transition:all 0.5s var(--ease-smooth);display:flex;flex-direction:column" data-delay="${i * 90}" onmouseover="this.style.boxShadow='var(--shadow-lift)';this.style.transform='translateY(-6px)'" onmouseout="this.style.boxShadow='var(--shadow-card)';this.style.transform=''">
      <div style="position:relative;aspect-ratio:16/10;overflow:hidden">
        <img src="${cat.image}" alt="${cat.title} by Veloqtech" loading="lazy" style="height:100%;width:100%;object-fit:cover;transition:transform 0.7s" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" />
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(15,23,42,0.7),rgba(15,23,42,0.1),transparent)"></div>
        <div style="position:absolute;top:0.75rem;left:0.75rem;display:flex;align-items:center;gap:0.5rem;border-radius:999px;background:rgba(255,255,255,0.9);padding:0.375rem 0.75rem;backdrop-filter:blur(8px)">
          <span style="color:var(--color-secondary);display:grid;place-items:center;width:16px;height:16px">${icon(cat.icon)}</span>
          <span style="font-size:0.75rem;font-weight:600;color:var(--primary-900)">${cat.title}</span>
        </div>
      </div>
      <div style="padding:1.5rem;display:flex;flex-direction:column;flex:1">
        <h3 style="font-size:1.125rem;font-weight:700;color:var(--primary-900)">${cat.title}</h3>
        <p style="margin-top:0.375rem;font-size:0.875rem;color:var(--primary-600);line-height:1.6">${cat.tagline}</p>
        <ul style="margin-top:1.25rem;display:grid;grid-template-columns:1fr 1fr;gap:0.625rem">
          ${cat.subs.map((s) => `<li style="display:flex;align-items:center;gap:0.5rem;font-size:0.875rem;color:var(--primary-700)"><span style="display:grid;place-items:center;height:1.5rem;width:1.5rem;border-radius:0.375rem;background:rgba(37,99,235,0.1);color:var(--color-secondary)">${icon(s.icon)}</span>${s.label}</li>`).join('')}
        </ul>
        <a href="contact.html" style="margin-top:1.5rem;display:inline-flex;align-items:center;gap:0.375rem;font-size:0.875rem;font-weight:600;color:var(--color-secondary)">Get Started ${I.arrowRight}</a>
      </div>
    </article>
  `).join('');
})();

// ---- process ----
(function initProcess() {
  const grid = $('#processGrid');
  if (!grid) return;
  grid.innerHTML = PROCESS.map((s, i) => `
    <div class="reveal" style="position:relative" data-delay="${i * 60}">
      <div class="process-step">
        <div style="position:relative">
          <div class="process-icon">${icon(s.icon)}</div>
          <span class="process-num">${i + 1}</span>
        </div>
        <h3 style="margin-top:1rem;font-size:1rem;font-weight:700;color:var(--primary-900)">${s.title}</h3>
        <p style="margin-top:0.375rem;font-size:0.875rem;color:var(--primary-600);max-width:15rem">${s.desc}</p>
      </div>
    </div>
  `).join('');
})();

// ---- live demo showcase ----
(function initDemos() {
  const grid = $('#demoGrid');
  if (!grid) return;
  grid.innerHTML = DEMOS.map((d, i) => `
    <article class="reveal" style="border-radius:var(--radius-xl3);overflow:hidden;border:1px solid var(--color-border);background:#fff;box-shadow:var(--shadow-card);transition:all 0.5s var(--ease-smooth)" data-delay="${(i % 3) * 80}" onmouseover="this.style.boxShadow='var(--shadow-lift)';this.style.transform='translateY(-6px)'" onmouseout="this.style.boxShadow='var(--shadow-card)';this.style.transform=''">
      <div style="position:relative;aspect-ratio:16/10;overflow:hidden">
        <img src="${d.img}" alt="${d.label} website demo preview" loading="lazy" style="height:100%;width:100%;object-fit:cover;transition:transform 0.7s" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" />
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(15,23,42,0.7),rgba(15,23,42,0.1),transparent)"></div>
        <div style="position:absolute;top:0.75rem;left:0.75rem;display:flex;align-items:center;gap:0.5rem;border-radius:999px;background:rgba(255,255,255,0.9);padding:0.375rem 0.75rem;backdrop-filter:blur(8px)">
          <span style="color:var(--color-secondary);display:grid;place-items:center;width:16px;height:16px">${icon(d.icon)}</span>
          <span style="font-size:0.75rem;font-weight:600;color:var(--primary-900)">${d.label}</span>
        </div>
      </div>
      <div style="padding:1.25rem">
        <h3 style="font-size:1rem;font-weight:700;color:var(--primary-900)">${d.label} Website</h3>
        <p style="margin-top:0.25rem;font-size:0.875rem;color:var(--primary-600)">A premium, conversion-focused design tailored for ${d.label.toLowerCase()} businesses.</p>
      </div>
    </article>
  `).join('');
})();

// ---- portfolio ----
(function initPortfolio() {
  const grid = $('#portfolioGrid');
  const filtersEl = $('#portfolioFilters');
  if (!grid || !filtersEl) return;
  let filter = 'All';

  const render = () => {
    const visible = filter === 'All' ? PORTFOLIO : PORTFOLIO.filter((p) => p.industry === filter);
    grid.innerHTML = visible.map((p, i) => `
      <article class="reveal" style="border-radius:var(--radius-xl3);overflow:hidden;border:1px solid var(--color-border);background:#fff;box-shadow:var(--shadow-card);transition:all 0.5s var(--ease-smooth)" data-delay="${(i % 3) * 70}" onmouseover="this.style.boxShadow='var(--shadow-lift)';this.style.transform='translateY(-6px)'" onmouseout="this.style.boxShadow='var(--shadow-card)';this.style.transform=''">
        <div style="position:relative;aspect-ratio:16/10;overflow:hidden">
          <img src="${p.img}" alt="${p.name} — ${p.industry} website by Veloqtech" loading="lazy" style="height:100%;width:100%;object-fit:cover;transition:transform 0.7s" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" />
          <span style="position:absolute;top:0.75rem;left:0.75rem;border-radius:999px;background:rgba(255,255,255,0.9);padding:0.25rem 0.75rem;font-size:0.75rem;font-weight:600;color:var(--primary-800);backdrop-filter:blur(8px)">${p.industry}</span>
        </div>
        <div style="padding:1.5rem">
          <h3 style="font-size:1.125rem;font-weight:700;color:var(--primary-900)">${p.name}</h3>
          <p style="margin-top:0.375rem;font-size:0.875rem;color:var(--primary-600);line-height:1.6">${p.desc}</p>
          <div style="margin-top:1rem;display:flex;flex-wrap:wrap;gap:0.375rem">
            ${p.tech.map((t) => `<span style="border-radius:0.375rem;background:var(--primary-50);padding:0.25rem 0.5rem;font-size:0.6875rem;font-weight:500;color:var(--primary-600)">${t}</span>`).join('')}
          </div>
          <div style="margin-top:1rem;display:flex;flex-wrap:wrap;gap:0.75rem">
            ${p.features.map((f) => `<span style="font-size:0.6875rem;font-weight:500;color:var(--color-secondary)">· ${f}</span>`).join('')}
          </div>
        </div>
      </article>
    `).join('');
    // re-scan reveals for new nodes
    setTimeout(() => $$('.reveal:not(.is-visible)', grid).forEach((n) => n.classList.add('is-visible')), 50);
  };

  filtersEl.innerHTML = PORTFOLIO_FILTERS.map((f) => `<button data-filter="${f}" style="border-radius:999px;padding:0.5rem 1rem;font-size:0.875rem;font-weight:600;transition:all 0.3s;background:var(--primary-50);color:var(--primary-600)">${f}</button>`).join('');
  filtersEl.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    filter = btn.dataset.filter;
    $$('#portfolioFilters button').forEach((b) => {
      const active = b.dataset.filter === filter;
      b.style.background = active ? 'var(--primary-900)' : 'var(--primary-50)';
      b.style.color = active ? '#fff' : 'var(--primary-600)';
      b.style.boxShadow = active ? 'var(--shadow-card)' : 'none';
    });
    render();
  });
  // set initial active
  $$('#portfolioFilters button').forEach((b) => {
    if (b.dataset.filter === 'All') { b.style.background = 'var(--primary-900)'; b.style.color = '#fff'; b.style.boxShadow = 'var(--shadow-card)'; }
  });
  render();
})();

// ---- before/after slider ----
(function initBeforeAfter() {
  const slider = $('#baSlider');
  if (!slider) return;
  const before = $('#baBefore');
  const handle = $('#baHandle');
  let pos = 50, dragging = false;
  const update = (clientX) => {
    const r = slider.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    pos = Math.max(0, Math.min(100, p));
    before.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
    handle.style.left = pos + '%';
  };
  slider.addEventListener('mousedown', (e) => { dragging = true; update(e.clientX); });
  window.addEventListener('mousemove', (e) => { if (dragging) update(e.clientX); });
  window.addEventListener('mouseup', () => { dragging = false; });
  slider.addEventListener('touchstart', (e) => update(e.touches[0].clientX), { passive: true });
  slider.addEventListener('touchmove', (e) => update(e.touches[0].clientX), { passive: true });
})();

// ---- stats (count up) ----
(function initStats() {
  const grid = $('#statsGrid');
  if (!grid) return;
  grid.innerHTML = STATS.map((s, i) => `
    <div class="reveal" style="text-align:center" data-delay="${i * 80}" data-target="${s.value}" data-suffix="${s.suffix}">
      <div style="font-family:var(--font-heading);font-size:clamp(2.25rem,5vw,3rem);font-weight:800;color:#fff" class="stat-num">0<span style="color:var(--accent-400)">${s.suffix}</span></div>
      <div style="margin-top:0.5rem;font-size:0.875rem;font-weight:500;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.05em">${s.label}</div>
    </div>
  `).join('');

  const nodes = $$('.stat-num', grid);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const node = entry.target;
      const parent = node.closest('[data-target]');
      const target = parseInt(parent.dataset.target, 10);
      const suffix = parent.dataset.suffix;
      const start = performance.now();
      const dur = 2000;
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        node.innerHTML = Math.round(target * eased) + `<span style="color:var(--accent-400)">${suffix}</span>`;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(node);
    });
  }, { threshold: 0.4 });
  nodes.forEach((n) => io.observe(n));
})();

// ---- industries ----
(function initIndustries() {
  const grid = $('#industriesGrid');
  if (!grid) return;
  grid.innerHTML = INDUSTRIES.map((ind, i) => `
    <article class="reveal card card-hover" style="padding:1.5rem" data-delay="${(i % 4) * 60}">
      <span style="display:grid;place-items:center;height:3rem;width:3rem;border-radius:0.75rem;background:linear-gradient(135deg,rgba(37,99,235,0.1),rgba(6,182,212,0.1));color:var(--color-secondary)">${icon(ind.icon)}</span>
      <h3 style="margin-top:1rem;font-size:1rem;font-weight:700;color:var(--primary-900)">${ind.title}</h3>
      <p style="margin-top:0.375rem;font-size:0.875rem;color:var(--primary-600);line-height:1.6">${ind.desc}</p>
      <a href="contact.html" style="margin-top:1rem;display:inline-flex;align-items:center;gap:0.375rem;font-size:0.875rem;font-weight:600;color:var(--color-secondary)">Explore Solutions ${I.arrowRight}</a>
    </article>
  `).join('');
})();

// ---- comparison table ----
(function initCmp() {
  const rows = $('#cmpRows');
  if (!rows) return;
  rows.innerHTML = CMP_ROWS.map((r) => `
    <div class="cmp-table" style="align-items:center" onmouseover="this.style.background='rgba(248,250,252,0.4)'" onmouseout="this.style.background=''">
      <div style="padding:1rem;font-size:0.875rem;font-weight:500;color:var(--primary-800)">${r}</div>
      <div style="padding:1rem;display:flex;justify-content:center"><span style="display:grid;place-items:center;height:1.75rem;width:1.75rem;border-radius:999px;background:rgba(239,68,68,0.1);color:var(--color-danger)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span></div>
      <div style="padding:1rem;display:flex;justify-content:center"><span style="display:grid;place-items:center;height:1.75rem;width:1.75rem;border-radius:999px;background:rgba(16,185,129,0.1);color:var(--color-success)">${I.check}</span></div>
    </div>
  `).join('');
  // add divider borders
  $$('.cmp-table', rows).forEach((r) => { r.style.borderTop = '1px solid var(--primary-100)'; });
})();

// ---- testimonials slider ----
(function initTestimonials() {
  const wrap = $('#testiWrap');
  if (!wrap) return;
  const content = $('#testiContent');
  let i = 0, paused = false, timer;
  const n = TESTIMONIALS.length;

  const render = () => {
    const t = TESTIMONIALS[i];
    content.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.25rem">${Array(t.rating).fill(I.star).join('')}</div>
      <p style="margin-top:1.25rem;font-size:1.125rem;color:var(--primary-800);line-height:1.6;font-weight:500">"${t.review}"</p>
      <div style="margin-top:1.75rem;display:flex;align-items:center;justify-content:space-between">
        <div style="display:flex;align-items:center;gap:0.75rem">
          <img src="${t.img}" alt="${t.name}" loading="lazy" style="height:3rem;width:3rem;border-radius:999px;object-fit:cover" />
          <div>
            <div style="font-family:var(--font-heading);font-weight:700;color:var(--primary-900)">${t.name}</div>
            <div style="font-size:0.875rem;color:var(--primary-500)">${t.business}</div>
          </div>
        </div>
        <span style="display:none;border-radius:999px;background:var(--primary-50);padding:0.25rem 0.75rem;font-size:0.75rem;font-weight:500;color:var(--primary-600)" class="show-lg">${t.project}</span>
      </div>
      <div style="margin-top:2rem;display:flex;align-items:center;justify-content:space-between">
        <div class="testi-dots">${TESTIMONIALS.map((_, d) => `<button class="testi-dot ${d === i ? 'active' : ''}" data-dot="${d}" aria-label="Go to testimonial ${d + 1}"></button>`).join('')}</div>
        <div style="display:flex;gap:0.5rem">
          <button class="icon-btn" data-prev aria-label="Previous">${I.chevL}</button>
          <button class="icon-btn" data-next aria-label="Next">${I.chevR}</button>
        </div>
      </div>
    `;
  };
  render();

  const go = (d) => { i = (i + d + n) % n; render(); reset(); };
  const reset = () => { clearInterval(timer); if (!paused) timer = setInterval(() => { i = (i + 1) % n; render(); }, 5000); };

  wrap.addEventListener('click', (e) => {
    if (e.target.closest('[data-prev]')) go(-1);
    if (e.target.closest('[data-next]')) go(1);
    const dot = e.target.closest('[data-dot]');
    if (dot) { i = parseInt(dot.dataset.dot, 10); render(); reset(); }
  });
  wrap.addEventListener('mouseenter', () => { paused = true; clearInterval(timer); });
  wrap.addEventListener('mouseleave', () => { paused = false; reset(); });
  reset();
})();

// ---- google reviews ----
(function initGR() {
  const grid = $('#grGrid');
  const stars = $('#grStars');
  if (!grid) return;
  if (stars) stars.innerHTML = Array(5).fill('<svg viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="2" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>').join('');
  grid.innerHTML = GR_REVIEWS.map((r, i) => `
    <div class="reveal card" style="padding:1.25rem" data-delay="${i * 70}">
      <div style="display:flex;align-items:center;gap:0.75rem">
        <img src="${r.img}" alt="${r.name}" loading="lazy" style="height:2.5rem;width:2.5rem;border-radius:999px;object-fit:cover" />
        <div>
          <div style="font-size:0.875rem;font-weight:700;color:var(--primary-900)">${r.name}</div>
          <div style="font-size:0.75rem;color:var(--primary-500)">${r.business}</div>
        </div>
      </div>
      <div style="margin-top:0.75rem;display:flex">${Array(5).fill('<svg viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="2" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>').join('')}</div>
      <p style="margin-top:0.5rem;font-size:0.875rem;color:var(--primary-600);line-height:1.6">"${r.text}"</p>
    </div>
  `).join('');
})();

// ---- awards ----
(function initAwards() {
  const grid = $('#awardsGrid');
  if (!grid) return;
  grid.innerHTML = AWARDS.map((b, i) => `
    <div class="reveal" style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:0.75rem;border-radius:1rem;border:1px solid var(--primary-100);background:#fff;padding:1.25rem" data-delay="${i * 50}">
      <span style="display:grid;place-items:center;height:3rem;width:3rem;border-radius:999px;background:linear-gradient(135deg,rgba(37,99,235,0.1),rgba(6,182,212,0.1));color:var(--color-secondary)">${icon(b.icon)}</span>
      <span style="font-size:0.75rem;font-weight:600;color:var(--primary-700);line-height:1.3">${b.label}</span>
    </div>
  `).join('');
})();

// ---- tech stack ----
(function initTech() {
  const grid = $('#techGrid');
  if (!grid) return;
  grid.innerHTML = TECH.map((t, i) => `
    <div class="reveal" style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:0.75rem;border-radius:1rem;border:1px solid var(--primary-100);background:rgba(248,250,252,0.3);padding:1.25rem;transition:all 0.3s" data-delay="${(i % 6) * 50}" onmouseover="this.style.background='#fff';this.style.boxShadow='var(--shadow-card)';this.style.transform='translateY(-4px)'" onmouseout="this.style.background='rgba(248,250,252,0.3)';this.style.boxShadow='none';this.style.transform=''">
      <span style="display:grid;place-items:center;height:3rem;width:3rem;border-radius:0.75rem;background:#fff;color:var(--color-secondary);box-shadow:var(--shadow-card)">${icon(t.icon)}</span>
      <div>
        <div style="font-size:0.875rem;font-weight:700;color:var(--primary-900)">${t.name}</div>
        <div style="font-size:0.75rem;color:var(--primary-500);margin-top:0.125rem">${t.desc}</div>
      </div>
    </div>
  `).join('');
})();

// ---- growth report (AI lead magnet) ----
(function initGrowthReport() {
  const form = $('#grForm');
  if (!form) return;
  let step = 0, done = false, loading = false;
  const data = { business: '', industry: GR_INDUSTRIES[0], website: '', gbp: 'No', instagram: 'No', challenge: GR_CHALLENGES[0], email: '' };

  const render = () => {
    if (done) {
      form.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:4rem 1.5rem">
          <span style="display:grid;place-items:center;height:4rem;width:4rem;border-radius:999px;background:rgba(16,185,129,0.1);color:var(--color-success)">${I.check.replace('width="12"','width="32"').replace('height="12"','height="32"')}</span>
          <h3 style="margin-top:1.25rem;font-size:1.5rem;font-weight:700;color:var(--primary-900)">Report on its way!</h3>
          <p style="margin-top:0.5rem;color:var(--primary-600);max-width:24rem">Thanks, ${data.business || 'there'}! We'll prepare your personalised growth report and email it within 24 hours.</p>
          <a href="contact.html" class="btn btn-primary" style="margin-top:1.5rem">Book a Free Consultation ${I.arrowRight}</a>
        </div>`;
      return;
    }
    const bars = [0,1,2,3].map((s) => `<div class="gr-bar ${s <= step ? 'active' : ''}"></div>`).join('');
    let body = '';
    if (step === 0) {
      body = `
        <h3 style="font-size:1.25rem;font-weight:700;color:var(--primary-900)">Tell us about your business</h3>
        <div style="margin-top:1rem"><label class="field-label">Business Name</label><input class="field" id="gr-business" placeholder="Your business name" value="${data.business}" /></div>
        <div style="margin-top:1rem"><label class="field-label">Industry</label><select class="field" id="gr-industry">${GR_INDUSTRIES.map((i) => `<option ${i === data.industry ? 'selected' : ''}>${i}</option>`).join('')}</select></div>
        <div style="margin-top:1.5rem;display:flex;justify-content:flex-end"><button class="btn btn-primary" data-next>Continue ${I.arrowRight}</button></div>`;
    } else if (step === 1) {
      body = `
        <h3 style="font-size:1.25rem;font-weight:700;color:var(--primary-900)">Your current online presence</h3>
        <div style="margin-top:1rem"><label class="field-label">Current Website (if any)</label><input class="field" id="gr-website" placeholder="https://yourwebsite.com" value="${data.website}" /></div>
        <div class="form-grid-2" style="margin-top:1rem">
          <div><label class="field-label">Google Business Profile?</label><select class="field" id="gr-gbp"><option ${data.gbp==='Yes'?'selected':''}>Yes</option><option ${data.gbp==='No'?'selected':''}>No</option><option ${data.gbp==='Not sure'?'selected':''}>Not sure</option></select></div>
          <div><label class="field-label">Instagram?</label><select class="field" id="gr-ig"><option ${data.instagram==='Yes'?'selected':''}>Yes</option><option ${data.instagram==='No'?'selected':''}>No</option></select></div>
        </div>
        <div style="margin-top:1.5rem;display:flex;justify-content:space-between"><button class="btn btn-secondary" data-back>Back</button><button class="btn btn-primary" data-next>Continue ${I.arrowRight}</button></div>`;
    } else if (step === 2) {
      body = `
        <h3 style="font-size:1.25rem;font-weight:700;color:var(--primary-900)">Your biggest challenge</h3>
        <div style="margin-top:1rem;display:grid;grid-template-columns:1fr 1fr;gap:0.625rem" class="form-grid-2">
          ${GR_CHALLENGES.map((c) => `<button class="gr-option ${c === data.challenge ? 'selected' : ''}" data-challenge="${c}">${c}</button>`).join('')}
        </div>
        <div style="margin-top:1.5rem;display:flex;justify-content:space-between"><button class="btn btn-secondary" data-back>Back</button><button class="btn btn-primary" data-next>Continue ${I.arrowRight}</button></div>`;
    } else {
      body = `
        <h3 style="font-size:1.25rem;font-weight:700;color:var(--primary-900)">Where should we send your report?</h3>
        <div style="margin-top:1rem"><label class="field-label">Email Address</label><input class="field" id="gr-email" type="email" placeholder="you@example.com" value="${data.email}" /></div>
        <div style="margin-top:1rem;border-radius:0.75rem;background:rgba(248,250,252,0.6);border:1px solid var(--primary-100);padding:1rem;display:flex;align-items:flex-start;gap:0.75rem">
          <span style="color:var(--color-secondary);flex-shrink:0;margin-top:0.125rem">${icon('fileBar')}</span>
          <p style="font-size:0.875rem;color:var(--primary-600)">Your report includes a website review, SEO opportunities, and 3 quick wins for ${data.industry.toLowerCase()} businesses.</p>
        </div>
        <div style="margin-top:1.5rem;display:flex;justify-content:space-between"><button class="btn btn-secondary" data-back>Back</button><button class="btn btn-primary" data-submit>${loading ? I.loader + ' Preparing...' : I.sparkles + ' Get My Report'}</button></div>`;
    }
    form.innerHTML = `<div class="gr-progress">${bars}</div><div style="padding:1.5rem">${body}</div>`;
  };

  form.addEventListener('click', (e) => {
    const t = e.target.closest('[data-next],[data-back],[data-submit],[data-challenge]');
    if (!t) return;
    if (t.dataset.next) {
      if (step === 0) { data.business = $('#gr-business')?.value || ''; data.industry = $('#gr-industry')?.value || data.industry; if (!data.business) return; }
      if (step === 1) { data.website = $('#gr-website')?.value || ''; data.gbp = $('#gr-gbp')?.value || 'No'; data.instagram = $('#gr-ig')?.value || 'No'; }
      step = Math.min(step + 1, 3);
    }
    if (t.dataset.back) step = Math.max(step - 1, 0);
    if (t.dataset.challenge) data.challenge = t.dataset.challenge;
    if (t.dataset.submit) {
      data.email = $('#gr-email')?.value || '';
      if (!data.email) return;
      loading = true; render();
      setTimeout(() => { loading = false; done = true; render(); }, 1400);
      return;
    }
    render();
  });
  render();
})();

// ---- pricing ----
(function initPricing() {
  const grid = $('#pricingGrid');
  if (!grid) return;
  grid.innerHTML = PRICING.map((p, i) => `
    <div class="reveal" style="position:relative;border-radius:var(--radius-xl3);padding:2rem;transition:all 0.5s var(--ease-smooth);${p.highlight ? 'background:var(--primary-900);color:#fff;box-shadow:var(--shadow-lift);border:1px solid var(--primary-800)' : 'background:#fff;border:1px solid var(--color-border);box-shadow:var(--shadow-card)'}" data-delay="${i * 80}" onmouseover="this.style.transform='translateY(-6px)'" onmouseout="this.style.transform=''">
      ${p.highlight ? '<span style="position:absolute;top:-0.75rem;left:50%;transform:translateX(-50%);border-radius:999px;background:linear-gradient(to right,var(--color-secondary),var(--color-accent));padding:0.25rem 1rem;font-size:0.75rem;font-weight:700;color:#fff;box-shadow:var(--shadow-glow)">Most Popular</span>' : ''}
      <div style="display:flex;align-items:center;gap:0.75rem">
        <span style="display:grid;place-items:center;height:2.75rem;width:2.75rem;border-radius:0.75rem;${p.highlight ? 'background:rgba(255,255,255,0.1);color:var(--accent-300)' : 'background:rgba(37,99,235,0.1);color:var(--color-secondary)'}">${icon(p.icon)}</span>
        <div>
          <h3 style="font-size:1.25rem;font-weight:700;${p.highlight ? 'color:#fff' : 'color:var(--primary-900)'}">${p.name}</h3>
          <p style="font-size:0.75rem;${p.highlight ? 'color:rgba(255,255,255,0.6)' : 'color:var(--primary-500)'}">${p.tagline}</p>
        </div>
      </div>
      <div style="margin-top:1.5rem">
        <span style="font-size:0.875rem;${p.highlight ? 'color:rgba(255,255,255,0.6)' : 'color:var(--primary-500)'}">Starting from</span>
        <div style="margin-top:0.25rem;font-family:var(--font-heading);font-size:1.875rem;font-weight:800;${p.highlight ? 'color:#fff' : 'color:var(--primary-900)'}">Custom Quote</div>
      </div>
      <ul style="margin-top:1.5rem;display:flex;flex-direction:column;gap:0.75rem">
        ${p.features.map((f) => `<li style="display:flex;align-items:flex-start;gap:0.625rem;font-size:0.875rem"><span style="margin-top:0.125rem;display:grid;place-items:center;height:1rem;width:1rem;flex-shrink:0;border-radius:999px;${p.highlight ? 'background:rgba(6,182,212,0.2);color:var(--accent-300)' : 'background:rgba(16,185,129,0.1);color:var(--color-success)'}">${I.check}</span><span style="${p.highlight ? 'color:rgba(255,255,255,0.8)' : 'color:var(--primary-700)'}">${f}</span></li>`).join('')}
      </ul>
      <a href="contact.html" class="btn ${p.highlight ? 'btn-primary' : 'btn-secondary'}" style="margin-top:2rem;width:100%">Get Free Quote ${I.arrowRight}</a>
    </div>
  `).join('');
})();

// ---- FAQ ----
(function initFAQ() {
  const list = $('#faqList');
  if (!list) return;
  list.innerHTML = FAQS.map((f, i) => `
    <div class="faq-item" data-faq="${i}">
      <button class="faq-q" aria-expanded="${i === 0}">
        <span>${f.q}</span>
        <span class="faq-icon">${I.plus}</span>
      </button>
      <div class="faq-a ${i === 0 ? 'open' : ''}"><div><p>${f.a}</p></div></div>
    </div>
  `).join('');
  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-q');
    if (!btn) return;
    const item = btn.closest('.faq-item');
    const ans = item.querySelector('.faq-a');
    const icon2 = item.querySelector('.faq-icon');
    const open = ans.classList.contains('open');
    $$('.faq-a', list).forEach((a) => a.classList.remove('open'));
    $$('.faq-item', list).forEach((f) => f.classList.remove('open'));
    $$('.faq-q', list).forEach((q) => q.setAttribute('aria-expanded', 'false'));
    if (!open) { ans.classList.add('open'); item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
  });
})();

// ---- contact info ----
(function initContactInfo() {
  const wrap = $('#contactInfo');
  if (!wrap) return;
  wrap.innerHTML = CONTACT_INFO.map((c) => {
    const inner = `
      <span style="display:grid;place-items:center;height:2.75rem;width:2.75rem;flex-shrink:0;border-radius:0.75rem;background:#fff;color:var(--color-secondary);box-shadow:var(--shadow-card)">${icon(c.icon)}</span>
      <div>
        <div style="font-size:0.75rem;font-weight:500;text-transform:uppercase;letter-spacing:0.05em;color:var(--primary-400)">${c.label}</div>
        <div style="font-size:0.9375rem;font-weight:600;color:var(--primary-900)">${c.value}</div>
      </div>`;
    const cls = `style="display:flex;align-items:center;gap:1rem;border-radius:1rem;border:1px solid var(--primary-100);background:rgba(248,250,252,0.4);padding:1rem;transition:all 0.2s" onmouseover="this.style.background='var(--primary-50)';this.style.borderColor='var(--primary-200)'" onmouseout="this.style.background='rgba(248,250,252,0.4)';this.style.borderColor='var(--primary-100)'"`;
    return c.href ? `<a href="${c.href}" ${c.href.startsWith('http') ? 'target="_blank" rel="noreferrer"' : ''} ${cls}>${inner}</a>` : `<div ${cls}>${inner}</div>`;
  }).join('');
})();

// ---- contact form ----
(function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;
  const fields = $('#formFields');
  const success = $('#formSuccess');
  const submit = $('#cfSubmit');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (submit.disabled) return;
    submit.disabled = true;
    submit.innerHTML = I.loader + ' Sending...';
    setTimeout(() => {
      fields.style.display = 'none';
      success.style.display = 'flex';
      form.reset();
      setTimeout(() => {
        fields.style.display = 'flex';
        success.style.display = 'none';
        submit.disabled = false;
        submit.innerHTML = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send My Enquiry';
      }, 5000);
    }, 1200);
  });
})();

// ---- newsletter ----
(function initNewsletter() {
  const form = $('#newsletterForm');
  if (!form) return;
  const inner = $('#nlInner');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#nlEmail').value;
    if (!email) return;
    inner.innerHTML = `<div style="display:inline-flex;align-items:center;gap:0.5rem;border-radius:999px;background:rgba(16,185,129,0.1);padding:0.75rem 1.25rem;color:var(--color-success);font-weight:600">${I.check} You're subscribed. Welcome aboard!</div>`;
    setTimeout(() => {
      inner.innerHTML = `<input type="email" required placeholder="Your email address" class="field" style="border-radius:999px" id="nlEmail" /><button type="submit" class="btn btn-primary">${I.arrowRight.replace('width="16"','width="16"')} Subscribe</button>`;
      inner.style.flexDirection = 'column';
    }, 4000);
  });
})();

// ---- footer ----
(function initFooter() {
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  const social = $('#footerSocial');
  if (social) {
    social.innerHTML = FOOTER_SOCIAL.map((s) => `
      <a href="${s.href}" target="_blank" rel="noreferrer" aria-label="${s.label}" style="display:grid;place-items:center;height:2.25rem;width:2.25rem;border-radius:999px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.7);transition:all 0.2s" onmouseover="this.style.background='var(--color-secondary)';this.style.color='#fff';this.style.borderColor='var(--color-secondary)'" onmouseout="this.style.background='rgba(255,255,255,0.05)';this.style.color='rgba(255,255,255,0.7)';this.style.borderColor='rgba(255,255,255,0.1)'">${icon(s.icon)}</a>
    `).join('');
  }

  const svc = $('#footerServices');
  if (svc) {
    svc.innerHTML = `<h3 style="font-size:0.875rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:rgba(255,255,255,0.9)">Services</h3><ul style="margin-top:1rem;display:flex;flex-direction:column;gap:0.625rem">${FOOTER_SERVICES.map((l) => `<li><a href="services.html" style="font-size:0.875rem;color:rgba(255,255,255,0.6);transition:color 0.2s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">${l}</a></li>`).join('')}</ul>`;
  }
  const ind = $('#footerIndustries');
  if (ind) {
    ind.innerHTML = `<h3 style="font-size:0.875rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:rgba(255,255,255,0.9)">Industries</h3><ul style="margin-top:1rem;display:flex;flex-direction:column;gap:0.625rem">${FOOTER_INDUSTRIES.map((l) => `<li><a href="#industries" style="font-size:0.875rem;color:rgba(255,255,255,0.6);transition:color 0.2s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">${l}</a></li>`).join('')}</ul>`;
  }
  const ct = $('#footerContact');
  if (ct) {
    ct.innerHTML = `<h3 style="font-size:0.875rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:rgba(255,255,255,0.9)">Get in Touch</h3><ul style="margin-top:1rem;display:flex;flex-direction:column;gap:0.75rem;font-size:0.875rem;color:rgba(255,255,255,0.6)">
      <li style="display:flex;align-items:flex-start;gap:0.625rem"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="var(--accent-400)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" style="margin-top:0.125rem;flex-shrink:0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Agartala, Tripura, India</li>
      <li><a href="mailto:hello@veloqtech.com" style="display:flex;align-items:center;gap:0.625rem;transition:color 0.2s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.6)'"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="var(--accent-400)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" style="flex-shrink:0"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>hello@veloqtech.com</a></li>
      <li><a href="tel:+919000000000" style="display:flex;align-items:center;gap:0.625rem;transition:color 0.2s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.6)'"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="var(--accent-400)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" style="flex-shrink:0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>+91 90000 00000</a></li>
      <li><a href="https://wa.me/919000000000" target="_blank" rel="noreferrer" style="display:flex;align-items:center;gap:0.625rem;transition:color 0.2s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.6)'"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="var(--accent-400)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" style="flex-shrink:0"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>WhatsApp Us</a></li>
    </ul>`;
  }
})();

// ---- floating WhatsApp ----
(function initFloatingWA() {
  const wa = $('#floatingWa');
  if (!wa) return;
  const tooltip = $('#waTooltip');
  let shown = false;
  window.addEventListener('scroll', () => {
    const s = window.scrollY > 400;
    wa.classList.toggle('hidden', !s);
    if (s && !shown) { shown = true; setTimeout(() => tooltip?.classList.add('show'), 1500); }
  }, { passive: true });
  $('#waDismiss')?.addEventListener('click', (e) => { e.preventDefault(); tooltip?.classList.remove('show'); });
})();

// ---- hero parallax ----
(function initHeroParallax() {
  const stage = $('#heroStage');
  if (!stage) return;
  const cards = $$('[data-depth]', stage);
  if (!cards.length) return;
  stage.addEventListener('mousemove', (e) => {
    const r = stage.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / r.width;
    const dy = (e.clientY - cy) / r.height;
    cards.forEach((c) => {
      const depth = parseFloat(c.dataset.depth || '1');
      c.style.transform = `translate(${dx * depth * 18}px, ${dy * depth * 18}px)`;
    });
  });
})();
