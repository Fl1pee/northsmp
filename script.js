(function () {
  'use strict';

  const SERVER_IP = 'north.mcbuild.fun';
  const STATUS_API = `https://api.mcsrvstat.us/3/${SERVER_IP}`;
  
  const ROLE_ICONS = {
    'roles.owner': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 8 3.5 3L12 5l5.5 6L21 8l-1.5 10h-15L3 8Z"/></svg>',
    'roles.techadmin': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4Z"/><path d="m9 12 2 2 4-4"/></svg>',
    'roles.designer': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h1.5c2.2 0 4-1.8 4-4C20.5 6 16.7 3 12 3Z"/><circle cx="7.5" cy="11" r="1" fill="currentColor" stroke="none"/><circle cx="10" cy="7.5" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="8" r="1" fill="currentColor" stroke="none"/></svg>',
    'roles.moderator': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4Z"/></svg>',
    'roles.admin': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4Z"/><path d="M12 8v4M12 16h.01"/></svg>'
  };
  
  const ROLE_COLORS = {
    'roles.owner': { bg: 'var(--amber-bg)', fg: 'var(--amber-fg)' },
    'roles.techadmin': { bg: 'var(--blue-bg)', fg: 'var(--blue-fg)' },
    'roles.designer': { bg: 'var(--pink-bg)', fg: 'var(--pink-fg)' },
    'roles.moderator': { bg: 'var(--green-bg)', fg: 'var(--green-fg)' },
    'roles.admin': { bg: 'var(--coral-bg)', fg: 'var(--coral-fg)' }
  };
  
  const GLOBE_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9Z"/></svg>';
  const TELEGRAM_ICON_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>';
  
  const YOUTUBE_ICON_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>';
  const TWITCH_ICON_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>';
  const TIKTOK_ICON_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>';

  const TEAM = [
    { name: 'Fl1pee',    nick: 'Fl1pee',      roleKey: 'roles.owner',     socials: [{ key: 'social.website', icon: GLOBE_ICON_SVG, url: 'https://fl1pee.carrd.co/' }] },
    { name: 'iPrudent',  nick: 'iPrudent',    roleKey: 'roles.techadmin', socials: [] },
    { name: 'As0rp',     nick: 'l_As0rp_l',   roleKey: 'roles.techadmin', socials: [] },
    { name: 'Neo_Aleks', nick: 'Neo_Aleks',   roleKey: 'roles.admin',     socials: [
      { key: 'social.youtube', icon: YOUTUBE_ICON_SVG, url: 'https://www.youtube.com/@Neo_Aleks' },
      { key: 'social.twitch', icon: TWITCH_ICON_SVG, url: 'https://www.twitch.tv/neo_aleks' },
      { key: 'social.tiktok', icon: TIKTOK_ICON_SVG, url: 'https://www.tiktok.com/@neo_aleks' },
      { key: 'social.telegram', icon: TELEGRAM_ICON_SVG, url: 'https://t.me/TheNeoAleks' }
    ] },
    { name: 'Dushenka',  nick: 'dushenkaaa_', roleKey: 'roles.designer',  socials: [] },
    { name: 'Jack_835_', nick: 'Jack_835_',   roleKey: 'roles.moderator', socials: [{ key: 'social.telegram', icon: TELEGRAM_ICON_SVG, url: 'https://t.me/sesepakun' }] },
    { name: 'Keady',     nick: 'keady_837',   roleKey: 'roles.moderator', socials: [{ key: 'social.telegram', icon: TELEGRAM_ICON_SVG, url: 'https://t.me/bulochka313' }] }
  ];

  const AVATAR_LOCAL_DIR = 'avatars/';
  const AVATAR_API = (nick) => `https://mc-heads.net/avatar/${encodeURIComponent(nick)}/240`;
  const LANG_CYCLE = ['ua', 'en'];
  const LANG_BUTTON_LABEL = { ua: 'UA', en: 'ENG' };
  const LANG_HTML_ATTR = { ua: 'uk', en: 'en' };

  const state = {
    lang: localStorage.getItem('northsmp-lang') || 'ua',
    theme: localStorage.getItem('northsmp-theme') || 'dark'
  };

  if (!I18N[state.lang]) state.lang = 'ua';

  function t(key) {
    return (I18N[state.lang] && I18N[state.lang][key]) || key;
  }

  function nextLang() {
    const idx = LANG_CYCLE.indexOf(state.lang);
    return LANG_CYCLE[(idx + 1) % LANG_CYCLE.length];
  }

  function applyTranslations() {
    document.documentElement.lang = LANG_HTML_ATTR[state.lang] || 'uk';

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });

    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
    });

    const langToggleText = document.getElementById('langToggleText');
    if (langToggleText) langToggleText.textContent = LANG_BUTTON_LABEL[nextLang()] || nextLang();

    renderTeam();
    updateStatusUI(lastStatus);
  }

  function setLang(lang) {
    state.lang = lang;
    localStorage.setItem('northsmp-lang', lang);
    applyTranslations();
  }

  function setTheme(theme) {
    state.theme = theme;
    localStorage.setItem('northsmp-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    const sun = document.querySelector('.theme-icon-sun');
    const moon = document.querySelector('.theme-icon-moon');
    if (sun && moon) {
      sun.style.display = theme === 'dark' ? '' : 'none';
      moon.style.display = theme === 'dark' ? 'none' : '';
    }
  }

  document.documentElement.setAttribute('data-theme', state.theme);
  let toastTimer = null;

  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toastText');
    if (!toast || !toastText) return;

    toastText.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  async function copyIp() {
    try {
      await navigator.clipboard.writeText(SERVER_IP);
      showToast(t('ip.copied'));
    } catch (err) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = SERVER_IP;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(t('ip.copied'));
      } catch (e) {
        showToast(t('ip.copyFailed').replace('{ip}', SERVER_IP));
      }
    }
  }
  let lastStatus = null;

  function updateStatusUI(data) {
    const dot = document.getElementById('statusDot');
    const valueText = document.getElementById('statusValueText');
    const playersValue = document.getElementById('playersValue');

    if (!data) {
      if (valueText) valueText.textContent = t('status.checking');
      return;
    }

    const isOnline = !!data.online;

    if (dot) {
      dot.classList.remove('online', 'offline');
      dot.classList.add(isOnline ? 'online' : 'offline');
    }

    if (valueText) valueText.textContent = isOnline ? t('status.online') : t('status.offline');

    if (playersValue) {
      if (isOnline && data.players) {
        playersValue.textContent = `${data.players.online ?? 0} / ${data.players.max ?? '-'}`;
      } else {
        playersValue.textContent = t('status.unknown');
      }
    }

    const playersBadge = document.getElementById('playersValueBadge');
    if (playersBadge) {
      if (isOnline && data.players) {
        playersBadge.textContent = `${data.players.online ?? 0}/${data.players.max ?? '-'}`;
      } else {
        playersBadge.textContent = t('status.unknown');
      }
    }
  }

  async function fetchServerStatus() {
    try {
      const res = await fetch(STATUS_API, { cache: 'no-store' });
      if (!res.ok) throw new Error('Status request failed');
      lastStatus = await res.json();
      updateStatusUI(lastStatus);
    } catch (err) {
      lastStatus = { online: false };
      updateStatusUI(lastStatus);
    }
  }

  function renderTeam() {
    const grid = document.getElementById('teamGrid');
    if (!grid) return;

    grid.innerHTML = TEAM.map((member) => {
      const localSrc = `${AVATAR_LOCAL_DIR}${member.nick}.png`;
      const apiSrc = AVATAR_API(member.nick);
      const roleIcon = ROLE_ICONS[member.roleKey] || '';
      const roleColor = ROLE_COLORS[member.roleKey] || { bg: 'var(--bg-panel-alt)', fg: 'var(--text-secondary)' };

      const socialsHtml = (member.socials && member.socials.length)
        ? `<div class="team-socials">${member.socials.map((s) => `
            <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="team-social-btn" aria-label="${member.name} ${t(s.key)}" title="${t(s.key)}">${s.icon}</a>
          `).join('')}</div>`
        : '';

      return `
        <article class="team-card spotlight-card reveal">
          <div class="team-avatar-frame">
            <img
              src="${localSrc}"
              alt="${member.name}"
              loading="lazy"
              onerror="this.onerror=null;this.src='${apiSrc}';"
            >
            <span class="team-role-badge" style="background:${roleColor.bg};color:${roleColor.fg};">${roleIcon}</span>
          </div>
          <h3 class="team-name">${member.name}</h3>
          <p class="team-nick">${member.nick}</p>
          <span class="team-role">${t(member.roleKey)}</span>
          ${socialsHtml}
        </article>
      `;
    }).join('');

    grid.querySelectorAll('.reveal').forEach(observeReveal);
  }
  
  function initAccordion() {
    document.querySelectorAll('.accordion-header').forEach((btn) => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        document.querySelectorAll('.accordion-header').forEach((b) => b.setAttribute('aria-expanded', 'false'));
        btn.setAttribute('aria-expanded', String(!expanded));
      });
    });
  }
  
  function initNavIndicator() {
    const nav = document.getElementById('mainNav');
    const indicator = document.getElementById('navIndicator');
    if (!nav || !indicator) return;

    const pills = () => Array.from(nav.querySelectorAll('.nav-pill'));

    function moveTo(el) {
      indicator.style.width = `${el.offsetWidth}px`;
      indicator.style.transform = `translateX(${el.offsetLeft}px)`;
    }

    pills().forEach((pill) => {
      pill.addEventListener('mouseenter', () => moveTo(pill));
    });

    nav.addEventListener('mouseleave', () => {
      indicator.style.opacity = '0';
    });
  }
  
  function initMobileNav() {
    const burger = document.getElementById('burgerBtn');
    const nav = document.getElementById('mainNav');
    if (!burger || !nav) return;

    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    nav.querySelectorAll('.nav-pill').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }
  
  let revealObserver = null;

  function observeReveal(el) {
    if (el.classList.contains('is-visible')) return;
    if (revealObserver) {
      revealObserver.observe(el);
    } else {
      el.classList.add('is-visible');
    }
  }

  // Оновлена функція для плавної появи
  function initScrollReveal() {
    const items = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px 0px 0px' });

    items.forEach((el) => revealObserver.observe(el));

    // Примусово показуємо Hero-елементи, які вже у в'юпорті, з невеликою затримкою
    setTimeout(() => {
      items.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('is-visible');
        }
      });
    }, 150); // Невелика затримка для кращого ефекту
  }

  function initSpotlight() {
    const cards = document.querySelectorAll('.spotlight-card');
    cards.forEach(card => {
      card.style.setProperty('--mouse-x', '-100px');
      card.style.setProperty('--mouse-y', '-100px');

      card.addEventListener('mouseenter', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--mouse-x', '-100px');
        card.style.setProperty('--mouse-y', '-100px');
      });
    });
  }

  function initScrollTopButton() {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initLogoScroll() {
    const brand = document.getElementById('brandLink');
    if (!brand) return;

    brand.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function init() {
    const yearEl = document.getElementById('footerYear');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }

    setTheme(state.theme);

    const ipHero = document.getElementById('ipBtnHero');
    if (ipHero) {
      ipHero.addEventListener('click', copyIp);
      ipHero.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copyIp(); }
      });
    }

    document.getElementById('langToggle')?.addEventListener('click', () => {
      setLang(nextLang());
    });

    document.getElementById('themeToggle')?.addEventListener('click', () => {
      setTheme(state.theme === 'dark' ? 'light' : 'dark');
    });

    initMobileNav();
    initNavIndicator();
    initAccordion();
    initSpotlight();
    initScrollTopButton();
    initLogoScroll();

    applyTranslations();
    initScrollReveal();
    fetchServerStatus();
    setInterval(fetchServerStatus, 60000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();