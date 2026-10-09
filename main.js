(() => {
  'use strict';

  const root = document.documentElement;
  // Honour the OS setting, unless the owner previews with ?motion=full.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    && !root.classList.contains('force-motion');
  const canHover = window.matchMedia('(hover: hover)').matches;

  const store = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* storage unavailable */ } },
  };

  /* ------------------------------------------------------------------
     i18n. Russian text lives in index.html (it is also the no-JS fallback);
     the English version of every [data-i18n] element is listed here.
     ------------------------------------------------------------------ */
  const EN = {
    'skip': 'Skip to projects',
    'nav-projects': 'Projects',
    'nav-stack': 'Stack',
    'nav-contact': 'Contact',
    'aria-lang': 'Language',
    'aria-theme': 'Dark theme',

    'status': 'Almaty · open to internships and full-time roles',
    'name': '<span class="mask" style="--m: 0"><span>Vadim</span></span> <span class="mask" style="--m: 1"><span class="grad">Grushin</span></span>',
    'name-plain': 'Vadim Grushin',
    'role': 'Go Developer · Backend / DevOps',
    'lead': 'I build backend services in Go: REST APIs and real-time systems on PostgreSQL, Redis and WebSocket. I cover them with tests, ship them in Docker and deploy to Kubernetes — with CI/CD and monitoring.',
    'cta-cv': 'Résumé (PDF)',
    'cta-contact': 'Get in touch',
    'm-loc': 'Almaty, Kazakhstan',
    'm-eng': 'English C1 · EF certificate',
    'm-edu': 'Secondary vocational education',

    'con-title': 'fintracker · request path',
    't-client': 'HTTPS request',
    't-service': 'business logic',
    't-cache': 'cache',
    't-repo': 'pgx · transactions',
    't-db': 'migrations · indexes',
    'con-mon': 'monitoring',

    'st1': 'Writing Go since 2024',
    'st2': 'REST endpoints in the messenger',
    'st3': 'IDOR vulnerabilities found and fixed',
    'st4': 'tests in the Flutter client + a separate CI pipeline',

    'p-eyebrow': '01 · Projects',
    'p-title': 'What I’ve built',
    'p-code': 'Source on GitHub',

    'p1-kind': 'Pet project · Backend',
    'p1-date': 'Jan 2025 — present',
    'p1-badge': 'In progress',
    'p1-desc': 'Backend service for a finance tracker: authentication, balance operations and analytical queries. Under active development.',
    'p1-dlabel': 'From commit to alert',
    'p1-f1t': 'Architecture & API',
    'p1-f1': 'Three layers: handler → service → repository. Migrations, indexes tuned for analytical queries, endpoints documented in OpenAPI.',
    'p1-f2t': 'Security & integrity',
    'p1-f2': 'JWT with refresh-token rotation, bcrypt. Balance operations are atomic thanks to database transactions.',
    'p1-f3t': 'Performance',
    'p1-f3': 'Redis caching and rate limiting on the analytics endpoints. k6 load testing, pprof profiling.',
    'p1-f4t': 'Delivery & monitoring',
    'p1-f4': 'CI/CD on GitHub Actions, deployment to a VPS (Nginx, HTTPS) and to Kubernetes via Helm. Prometheus and Grafana with alerts.',

    'p2-kind': 'Pet project · Fullstack (Go + Flutter)',
    'p2-date': 'May 2025 — present',
    'p2-desc': 'A messenger with a shared task manager: a Go backend and a cross-platform Flutter client.',
    'p2-dlabel': 'Architecture',
    'p2-d1': 'Flutter client',
    'p2-d2': 'Go server',
    'p2-f1t': 'Real-time backend',
    'p2-f1': '~20 REST endpoints and a WebSocket channel: rooms, online status, read receipts, files, live task updates.',
    'p2-f2t': 'Security',
    'p2-f2': 'JWT with refresh tokens (rotation, revocation). Found and fixed two IDOR vulnerabilities in the WebSocket and REST task endpoints.',
    'p2-f3t': 'Data & domain',
    'p2-f3': 'PostgreSQL schema and a shared task manager with two-sided task confirmation.',
    'p2-f4t': 'Quality & client',
    'p2-f4': 'Tests for services, handlers and the WebSocket hub; CI with the race detector and dependency scanning; Docker (non-root, healthcheck). Flutter client with Riverpod (Windows / Web / Android), 60+ tests.',

    's-eyebrow': '02 · Stack',
    's-title': 'What I work with',
    'sk-lang': 'Languages',
    'sk-go': 'Go is my main language — I’ve been writing it since 2024.',
    'sk-db': 'Databases',
    'sk-mon': 'Monitoring',
    'sk-qa': 'Quality',
    'sk-tests': 'unit & integration tests',

    'c-eyebrow': '03 · Contact',
    'c-title': 'Let’s talk',
    'c-text': 'I’m looking for an internship or a Go developer role. Email or Telegram works best — I’d be glad to chat.',
    'c-mail': 'Email',

    'to-top': 'Back to top ↑',
  };

  const META = {
    ru: {
      title: 'Вадим Грушин — Go-разработчик (Backend / DevOps)',
      description: 'Портфолио Вадима Грушина, Go-разработчика (Backend / DevOps) из Алматы: REST API, WebSocket, PostgreSQL, Redis, Docker, Kubernetes. Ищу стажировку или работу.',
    },
    en: {
      title: 'Vadim Grushin — Go Developer (Backend / DevOps)',
      description: 'Portfolio of Vadim Grushin, a Go developer (Backend / DevOps) from Almaty: REST APIs, WebSocket, PostgreSQL, Redis, Docker, Kubernetes. Looking for an internship or a full-time role.',
    },
  };

  const UI = {
    ru: { copy: 'Копировать', copied: 'Скопировано' },
    en: { copy: 'Copy', copied: 'Copied' },
  };

  const LANGS = ['ru', 'en'];
  const i18nNodes = [...document.querySelectorAll('[data-i18n]')];
  const ariaNodes = [...document.querySelectorAll('[data-i18n-aria]')];
  const langButtons = [...document.querySelectorAll('[data-lang]')];
  const metaDescription = document.querySelector('meta[name="description"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const copyBtn = document.querySelector('[data-copy]');
  const copyLabel = document.querySelector('[data-copy-label]');
  const live = document.getElementById('live');

  // Remember the original (Russian) markup so switching back is lossless.
  i18nNodes.forEach((el) => { el.dataset.ru = el.innerHTML; });
  ariaNodes.forEach((el) => { el.dataset.ruAria = el.getAttribute('aria-label'); });

  let lang = 'ru';

  function setLang(next, { persist = false } = {}) {
    lang = next;
    root.lang = next;

    for (const el of i18nNodes) {
      const value = next === 'en' ? EN[el.dataset.i18n] : el.dataset.ru;
      if (value === undefined) {
        console.warn(`Missing translation: ${el.dataset.i18n}`);
        continue;
      }
      el.innerHTML = value;
    }
    for (const el of ariaNodes) {
      const value = next === 'en' ? EN[el.dataset.i18nAria] : el.dataset.ruAria;
      if (value !== undefined) el.setAttribute('aria-label', value);
    }

    // The résumé button follows the page language.
    document.querySelectorAll('[data-cv]').forEach((a) => {
      a.setAttribute('href', `assets/Grushin_Vadim_Go_Developer_${next.toUpperCase()}.pdf`);
    });

    document.title = META[next].title;
    metaDescription?.setAttribute('content', META[next].description);
    ogTitle?.setAttribute('content', META[next].title);
    langButtons.forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.lang === next)));
    if (copyLabel && !copyBtn?.classList.contains('is-copied')) copyLabel.textContent = UI[next].copy;
    placeIndicator(activeLink(), false); // link widths change with the language

    if (persist) {
      store.set('lang', next);
      try {
        const url = new URL(location.href);
        url.searchParams.set('lang', next);
        history.replaceState(null, '', url);
      } catch { /* e.g. file:// — the URL can't be rewritten, that's fine */ }
    }
  }

  function detectLang() {
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (LANGS.includes(fromUrl)) return fromUrl;
    const saved = store.get('lang');
    if (LANGS.includes(saved)) return saved;
    return /^(ru|kk)\b/i.test(navigator.language || '') ? 'ru' : 'en';
  }

  /* ------------------------------------------------------------------
     View Transitions: the theme switch grows out of the toggle as a circle,
     the language switch cross-fades with a blur. Falls back to an instant
     change where the API is missing or motion is reduced.
     ------------------------------------------------------------------ */
  function transition(update, { type, origin } = {}) {
    if (reduceMotion || !document.startViewTransition) { update(); return; }

    root.dataset.vt = type;
    const vt = document.startViewTransition(update);
    // A skipped transition (e.g. the tab is hidden) rejects these promises; the page still updates.
    vt.ready.catch(() => {});
    vt.updateCallbackDone.catch(() => {});

    if (type === 'theme' && origin) {
      vt.ready.then(() => {
        const radius = Math.hypot(
          Math.max(origin.x, window.innerWidth - origin.x),
          Math.max(origin.y, window.innerHeight - origin.y),
        );
        root.animate(
          { clipPath: [`circle(0px at ${origin.x}px ${origin.y}px)`, `circle(${radius}px at ${origin.x}px ${origin.y}px)`] },
          { duration: 750, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
        );
      }).catch(() => {});
    }
    vt.finished.catch(() => {}).finally(() => { delete root.dataset.vt; });
  }

  langButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.lang === lang) return;
      transition(() => setLang(btn.dataset.lang, { persist: true }), { type: 'lang' });
    });
  });

  /* ---------- Theme (light by default) ---------- */
  const themeBtn = document.getElementById('theme-toggle');
  const themeColor = document.querySelector('meta[name="theme-color"]');

  function syncTheme() {
    const dark = root.dataset.theme === 'dark';
    themeBtn.setAttribute('aria-pressed', String(dark));
    themeColor?.setAttribute('content', dark ? '#070b12' : '#f5f7fa');
  }

  themeBtn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    const rect = themeBtn.getBoundingClientRect();
    transition(() => {
      root.dataset.theme = next;
      store.set('theme', next);
      syncTheme();
    }, { type: 'theme', origin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } });
  });

  /* ---------- Copy e-mail ---------- */
  let copyTimer;

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(area);
      area.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { /* ignore */ }
      area.remove();
      return ok;
    }
  }

  copyBtn?.addEventListener('click', async () => {
    if (!(await copyText(copyBtn.dataset.copy))) return;
    copyBtn.classList.add('is-copied');
    copyLabel.textContent = UI[lang].copied;
    live.textContent = UI[lang].copied;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copyBtn.classList.remove('is-copied');
      copyLabel.textContent = UI[lang].copy;
      live.textContent = '';
    }, 1800);
  });

  /* ------------------------------------------------------------------
     Motion
     ------------------------------------------------------------------ */

  // Stagger index for list children (read by the CSS as --i).
  document.querySelectorAll('.features, .tags, .stats, .dflow, .trace').forEach((list) => {
    [...list.children].forEach((child, i) => child.style.setProperty('--i', i));
  });

  // Numbers count up when the strip scrolls into view.
  function countUp(el) {
    if (reduceMotion) return;
    const to = Number(el.dataset.count);
    const from = Number(el.dataset.from || 0);
    const pre = el.dataset.pre || '';
    const post = el.dataset.post || '';
    const start = performance.now();
    const render = (value) => { el.textContent = `${pre}${Math.round(value)}${post}`; };
    render(from);
    const tick = (now) => {
      const k = Math.min(1, (now - start) / 1500);
      render(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Reveal on scroll.
  const revealNodes = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        entry.target.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    revealNodes.forEach((el) => io.observe(el));

    // Diagrams play their "run" animation once they are mostly visible.
    const diagramIo = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('run');
        diagramIo.unobserve(entry.target);
      }
    }, { threshold: 0.5 });
    document.querySelectorAll('.diagram').forEach((el) => diagramIo.observe(el));
  } else {
    revealNodes.forEach((el) => el.classList.add('is-in'));
    document.querySelectorAll('.diagram').forEach((el) => el.classList.add('run'));
  }

  /* ---------- Navigation: scroll-spy with a sliding indicator ---------- */
  const navWrap = document.querySelector('.nav-links');
  const indicator = document.querySelector('.nav-indicator');
  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const spyTargets = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const activeLink = () => navLinks.find((a) => a.getAttribute('aria-current') === 'true');

  function placeIndicator(target, animate = true) {
    if (!indicator) return;
    if (!target || !target.offsetWidth) { indicator.style.opacity = '0'; return; }
    // The first placement (from "hidden") jumps instead of sliding in from the left edge.
    navWrap.classList.toggle('no-anim', !animate || indicator.style.opacity !== '1');
    indicator.style.width = `${target.offsetWidth}px`;
    indicator.style.transform = `translateX(${target.offsetLeft}px)`;
    indicator.style.opacity = '1';
  }

  navLinks.forEach((a) => a.addEventListener('pointerenter', () => placeIndicator(a)));
  navWrap?.addEventListener('pointerleave', () => placeIndicator(activeLink()));

  function updateSpy() {
    const line = window.innerHeight * 0.35;
    let current = null;
    for (const section of spyTargets) {
      if (section.getBoundingClientRect().top <= line) current = section;
    }
    navLinks.forEach((a) => {
      const active = current !== null && a.getAttribute('href') === `#${current.id}`;
      if (active) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    if (!navWrap?.matches(':hover')) placeIndicator(activeLink());
  }

  /* ---------- Scroll: progress bar, parallax, spy ---------- */
  const progressBar = document.querySelector('.scroll-progress');
  const heroBg = document.querySelector('.hero-bg');
  const consoleEl = document.querySelector('.console');
  let scrollTicking = false;

  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const max = root.scrollHeight - window.innerHeight;
      if (progressBar) progressBar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max).toFixed(4) : 0})`;
      if (!reduceMotion && y < 1400) {
        if (heroBg) heroBg.style.transform = `translate3d(0, ${(y * 0.18).toFixed(1)}px, 0)`;
        if (consoleEl) consoleEl.style.translate = `0 ${(-y * 0.05).toFixed(1)}px`;
      }
      updateSpy();
      scrollTicking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { placeIndicator(activeLink(), false); onScroll(); });

  /* ---------- Smooth, eased scrolling to in-page anchors ---------- */
  let scrollToken = 0;
  ['wheel', 'touchstart', 'keydown'].forEach((type) => {
    window.addEventListener(type, () => { scrollToken += 1; }, { passive: true });
  });

  document.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
    if (!link || reduceMotion || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey) return;
    const id = link.getAttribute('href').slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    event.preventDefault();
    const offset = id === 'top' ? 0 : parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
    const from = window.scrollY;
    const to = Math.max(0, id === 'top' ? 0 : target.getBoundingClientRect().top + from - offset);
    const distance = Math.abs(to - from);
    const duration = Math.min(1100, 450 + distance * 0.3);
    const token = ++scrollToken;
    const start = performance.now();
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const step = (now) => {
      if (token !== scrollToken) return; // the user took over
      const k = Math.min(1, (now - start) / duration);
      window.scrollTo({ top: from + (to - from) * ease(k), behavior: 'instant' });
      if (k < 1) { requestAnimationFrame(step); return; }
      try { history.pushState(null, '', `#${id}`); } catch { /* ignore */ }
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    };
    requestAnimationFrame(step);
  });

  /* ---------- Hero console: 3D tilt with a glare ---------- */
  if (consoleEl && canHover && !reduceMotion) {
    consoleEl.addEventListener('pointermove', (event) => {
      const rect = consoleEl.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      consoleEl.classList.add('is-tilting');
      consoleEl.style.setProperty('--ry', `${((px - 0.5) * 10).toFixed(2)}deg`);
      consoleEl.style.setProperty('--rx', `${((0.5 - py) * 8).toFixed(2)}deg`);
      consoleEl.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
      consoleEl.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
    });
    consoleEl.addEventListener('pointerleave', () => consoleEl.classList.remove('is-tilting'));
  }

  /* ---------- Magnetic buttons ---------- */
  if (canHover && !reduceMotion) {
    document.querySelectorAll('.hero .btn, .hero .btn-icon, .link-btn, .btn-light').forEach((el) => {
      el.addEventListener('pointermove', (event) => {
        const rect = el.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        el.style.transition = 'transform 0.12s linear';
        el.style.transform = `translate(${(dx * 0.22).toFixed(1)}px, ${(dy * 0.3).toFixed(1)}px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transition = '';
        el.style.transform = '';
      });
    });
  }

  /* ---------- Cursor spotlight on cards ---------- */
  if (canHover) {
    document.addEventListener('pointermove', (event) => {
      const card = event.target instanceof Element ? event.target.closest('.spot') : null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    }, { passive: true });
  }

  /* ---------- Init ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
  syncTheme();
  setLang(detectLang());
  onScroll();

  // Start the intro once the fonts are in (but never hold the page back for more than half a second).
  const fontsReady = document.fonts
    ? Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 500))])
    : Promise.resolve();
  fontsReady.then(() => setTimeout(() => {
    root.classList.add('is-ready');
    setTimeout(() => root.classList.add('intro-done'), reduceMotion ? 0 : 2800);
  }, 30));
})();
