"use strict";
// Спільна бічна панель NorthSMP — одна реалізація для всіх сторінок.
(() => {
  const mount = document.getElementById('siteNavigation');
  if (!mount) return;
  const selected = document.body.dataset.page || 'home';
  const TEXT = {
    ua: { home:'Головна', about:'Про сервер', join:'Вступ', support:'Підтримка', faq:'Питання', wiki:'Вікі', news:'Новини', lang:'Мова · UA', menu:'Відкрити меню', nav:'Навігація сайту', switch:'Switch to English' },
    en: { home:'Home', about:'About', join:'Join', support:'Support', faq:'FAQ', wiki:'Wiki', news:'News', lang:'Language · EN', menu:'Open menu', nav:'Site navigation', switch:'Перемкнути українською' }
  };
  const icon = {
    home: '<path d="M3 11.5 12 4l9 7.5V21H4V11.5"/><path d="M9 21v-7h6v7"/>',
    about: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    join: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M15 8l2 2"/>',
    support: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.8 1-1.1a5.5 5.5 0 0 0 0-7.7z"/>',
    faq: '<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4M12 17h.01"/>',
    wiki: '<path d="M12 6.5c-2.7-1.6-5.8-1.8-9-1v13c3.2-.8 6.3-.6 9 1 2.7-1.6 5.8-1.8 9-1v-13c-3.2-.8-6.3-.6-9 1z"/><path d="M12 6.5v13"/>',
    news: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h5v5H7zM15 8h3M15 11h3M7 16h11"/>',
    lang: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'
  };
  let lang = 'ua';
  try {
    const urlLang = new URLSearchParams(location.search).get('lang');
    const stored = localStorage.getItem('northsmp-lang');
    lang = urlLang === 'en' || urlLang === 'ua' ? urlLang : (stored === 'en' ? 'en' : 'ua');
  } catch (_) { /* Доступ до localStorage може бути обмежений. */ }
  const items = [
    ['home', 'index.html#home'], ['about', 'index.html#about'], ['join', 'index.html#join'],
    ['support', 'index.html#support'], ['faq', 'index.html#faq'],
    ['wiki', 'wiki.html'], ['news', 'gazeta.html']
  ];
  const makeIcon = key => `<svg viewBox="0 0 24 24" aria-hidden="true">${icon[key]}</svg>`;
  mount.innerHTML = `<aside class="side drop" id="drop" aria-label="${TEXT[lang].nav}">
    ${items.map(([key, href]) => `<a href="${href}" class="side-item${key === 'support' ? ' drop-hot' : ''}${selected === key ? ' active' : ''}" data-side-href="${href}" ${selected===key?'aria-current="page"':''}>${makeIcon(key)}<small data-side-i18n="${key}"></small></a>`).join('')}
    <button type="button" class="side-item" id="langBtn">${makeIcon('lang')}<small data-side-i18n="lang"></small></button>
  </aside>
  <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="drop" aria-label="${TEXT[lang].menu}"><i></i><i></i><i></i></button>`;
  const burger = document.getElementById('burger'), drop = document.getElementById('drop'), langBtn = document.getElementById('langBtn');
  const mobile = () => matchMedia('(max-width: 960px)').matches;
  const setBurger = open => burger.setAttribute('aria-expanded', String(open));
  setBurger(!mobile());
  burger.addEventListener('click', event => {
    event.stopPropagation();
    if (mobile()) {
      const open = !drop.classList.contains('open');
      drop.classList.toggle('open', open);
      setBurger(open);
    } else {
      const hidden = !drop.classList.contains('collapsed');
      drop.classList.toggle('collapsed', hidden);
      document.body.classList.toggle('side-collapsed', hidden);
      setBurger(!hidden);
    }
  });
  document.addEventListener('click', event => {
    if (mobile() && drop.classList.contains('open') && !drop.contains(event.target) && !burger.contains(event.target)) {
      drop.classList.remove('open');setBurger(false);
    }
  });
  drop.addEventListener('click', event => {
    if (event.target.closest('a') && mobile()) {drop.classList.remove('open');setBurger(false);}
  });
  const updateLinks = () => {
    const base = location.href === 'about:blank' ? 'https://northsmp.org/index.html' : location.href;
    document.querySelectorAll('[data-side-href]').forEach(anchor => {
      const target = new URL(anchor.dataset.sideHref, base);
      target.searchParams.set('lang', lang);
      anchor.href = target.pathname.split('/').pop() + target.search + target.hash;
    });
    document.querySelectorAll('[data-keep-lang]').forEach(anchor => {
      const target = new URL(anchor.dataset.keepLang, base);
      target.searchParams.set('lang', lang);
      anchor.href = target.pathname.split('/').pop() + target.search + target.hash;
    });
  };
  function render() {
    document.documentElement.lang = lang === 'ua' ? 'uk' : 'en';
    drop.setAttribute('aria-label', TEXT[lang].nav);
    burger.setAttribute('aria-label', TEXT[lang].menu);
    for (const el of drop.querySelectorAll('[data-side-i18n]')) el.textContent = TEXT[lang][el.dataset.sideI18n];
    langBtn.title = TEXT[lang].switch;
    langBtn.setAttribute('aria-label', TEXT[lang].switch);
    updateLinks();
  }
  langBtn.addEventListener('click', () => {
    lang = lang === 'ua' ? 'en' : 'ua';
    try { localStorage.setItem('northsmp-lang', lang); } catch (_) {}
    render();
    document.dispatchEvent(new CustomEvent('northsmp:languageChanged', { detail: { lang } }));
  });
  window.NorthSMPNavigation = { getLang: () => lang };
  render();
})();
