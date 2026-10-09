(() => {
  'use strict';

  const root = document.documentElement;

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
    'name': 'Vadim <span class="grad">Grushin</span>',
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

  langButtons.forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang, { persist: true }));
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
    root.dataset.theme = next;
    store.set('theme', next);
    syncTheme();
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

  /* ---------- Reveal on scroll ---------- */
  const revealNodes = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    revealNodes.forEach((el) => io.observe(el));
  } else {
    revealNodes.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Scroll-spy for the nav ---------- */
  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const spyTargets = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

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
  }
  window.addEventListener('scroll', updateSpy, { passive: true });
  window.addEventListener('resize', updateSpy);

  /* ---------- Cursor spotlight on cards ---------- */
  if (window.matchMedia('(hover: hover)').matches) {
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
  updateSpy();
})();
