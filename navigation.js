"use strict";
(() => {
  if (/^https?:$/.test(location.protocol)) {
    const clean = location.pathname.replace(/index.html$/, '').replace(/.html$/, '');
    if (clean !== location.pathname) history.replaceState(null, '', clean + location.search + location.hash);
  }

  const mount = document.getElementById('siteNavigation');
  if (!mount) return;
  const selected = document.body.dataset.page || 'home';
  const TEXT = {
    ua: { home:'Головна', about:'Про сервер', join:'Вступ', support:'Підтримка', faq:'Питання', wiki:'Вікі', news:'Новини', pack:'Збірка', lang:'Мова · UA', menu:'Відкрити меню', nav:'Навігація сайту', switch:'Switch to English' },
    en: { home:'Home', about:'About', join:'Join', support:'Support', faq:'FAQ', wiki:'Wiki', news:'News', pack:'Modpack', lang:'Language · EN', menu:'Open menu', nav:'Site navigation', switch:'Перемкнути українською' }
  };
  const MODPACK_LINKS = {
    curseforge: 'https://edge.forgecdn.net/files/9700/399/NSMP.zip',
    modrinth: 'https://cdn.modrinth.com/data/cg4XKvE1/versions/xJ4OBVvj/NSMP.mrpack?mr_download_reason=standalone'
  };
  const icon = {
    pack: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
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
  } catch (_) { }
  const items = [
    ['home', './#home'], ['about', './#about'], ['join', './#join'],
    ['support', './#support'], ['faq', './#faq'],
    ['wiki', 'wiki'], ['news', 'news']
  ];
  const makeIcon = key => `<svg viewBox="0 0 24 24" aria-hidden="true">${icon[key]}</svg>`;
  mount.innerHTML = `<aside class="side drop" id="drop" aria-label="${TEXT[lang].nav}">
    ${items.map(([key, href]) => `<a href="${href}" class="side-item${key === 'support' ? ' drop-hot' : ''}${selected === key ? ' active' : ''}" data-side-href="${href}" ${selected===key?'aria-current="page"':''}>${makeIcon(key)}<small data-side-i18n="${key}"></small></a>`).join('')}
    <button type="button" class="side-item" id="packBtn" aria-haspopup="dialog">${makeIcon('pack')}<small data-side-i18n="pack"></small></button>
    <button type="button" class="side-item" id="langBtn">${makeIcon('lang')}<small data-side-i18n="lang"></small></button>
  </aside>
  <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="drop" aria-label="${TEXT[lang].menu}"><i></i><i></i><i></i></button>`;
  const burger = document.getElementById('burger'), drop = document.getElementById('drop'), langBtn = document.getElementById('langBtn');
  const mobile = () => matchMedia('(max-width: 960px)').matches;
  const setBurger = open => burger.setAttribute('aria-expanded', String(open));
  const packBtn = document.getElementById('packBtn');
  const packPop = document.createElement('div');
  packPop.className = 'pack-pop';
  packPop.id = 'packPop';
  packPop.innerHTML = `<a class="pack-choice cf" href="${MODPACK_LINKS.curseforge}" target="_blank" rel="noopener noreferrer"><img src="icons/curseforge.png" alt="" width="22" height="22">CurseForge</a>
    <a class="pack-choice mr" href="${MODPACK_LINKS.modrinth}" target="_blank" rel="noopener noreferrer"><img src="icons/modrinth.png" alt="" width="22" height="22">Modrinth</a>`;
  document.body.appendChild(packPop);
  packBtn.setAttribute('aria-expanded', 'false');
  packBtn.setAttribute('aria-controls', 'packPop');
  const closePack = () => {
    packPop.classList.remove('open');
    packBtn.setAttribute('aria-expanded', 'false');
  };
  const openPack = () => {
    const r = packBtn.getBoundingClientRect();
    packPop.style.top = r.top + r.height / 2 + 'px';
    packPop.style.left = r.right + 10 + 'px';
    packPop.classList.add('open');
    packBtn.setAttribute('aria-expanded', 'true');
  };
  packBtn.addEventListener('click', event => {
    event.stopPropagation();
    packPop.classList.contains('open') ? closePack() : openPack();
  });
  packPop.addEventListener('click', event => {
    if (event.target.closest('.pack-choice')) {
      closePack();
      if (matchMedia('(max-width: 960px)').matches) { drop.classList.remove('open'); setBurger(false); }
    }
  });
  document.addEventListener('click', event => {
    if (!packPop.contains(event.target)) closePack();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closePack(); });
  window.addEventListener('resize', closePack);
  drop.addEventListener('scroll', closePack);
  setBurger(!mobile());
  burger.addEventListener('click', event => {
    event.stopPropagation();
    closePack();
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
    if (mobile() && drop.classList.contains('open') && !drop.contains(event.target) && !burger.contains(event.target) && !packPop.contains(event.target)) {
      drop.classList.remove('open');setBurger(false);
    }
  });
  drop.addEventListener('click', event => {
    if (event.target.closest('a') && mobile()) {drop.classList.remove('open');setBurger(false);}
  });
  const pageName = url => {
    const name = url.pathname.split('/').pop();
    return !name || name === 'index.html' ? './' : name.replace(/.html$/, '');
  };
  const updateLinks = () => {
    const base = location.href === 'about:blank' ? 'https://northsmp.org/' : location.href;
    document.querySelectorAll('[data-side-href]').forEach(anchor => {
      const target = new URL(anchor.dataset.sideHref, base);
      target.searchParams.set('lang', lang);
      anchor.href = pageName(target) + target.search + target.hash;
    });
    document.querySelectorAll('[data-keep-lang]').forEach(anchor => {
      const target = new URL(anchor.dataset.keepLang, base);
      target.searchParams.set('lang', lang);
      anchor.href = pageName(target) + target.search + target.hash;
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
