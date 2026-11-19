"use strict";
(() => {
  const kind = document.body.dataset.page;
  if (kind !== 'wiki' && kind !== 'news') return;
  const COPY = {
    wiki: {
      ua: { title:'Вікі NorthSMP', crumb:'Вікі', heading:'Вікі' },
      en: { title:'NorthSMP Wiki', crumb:'Wiki', heading:'Wiki' }
    },
    news: {
      ua: { title:'Новини NorthSMP', heading:'Новини' },
      en: { title:'NorthSMP News', heading:'News' }
    }
  };
  function render(lang) {
    const dict = COPY[kind][lang === 'en' ? 'en' : 'ua'];
    document.title = dict.title;
    const newsFeed = document.querySelector('[data-news-label]');
    if (newsFeed) newsFeed.setAttribute('aria-label', lang === 'en' ? 'NorthSMP News' : 'Новини NorthSMP');
    for (const el of document.querySelectorAll('[data-page-i18n]')) {
      el.textContent = dict[el.dataset.pageI18n];
    }
  }
  render(window.NorthSMPNavigation?.getLang() || 'ua');
  document.addEventListener('northsmp:languageChanged', event => render(event.detail.lang));
})();
