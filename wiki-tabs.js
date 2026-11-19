"use strict";
/* Вкладки всередині сторінки вікі та їхній переклад. */
(() => {
  const tabs = [...document.querySelectorAll('.wiki-tab')];
  const panels = [...document.querySelectorAll('.wiki-panel')];
  if (!tabs.length) return;
  const TEXT = {
    ua: {
      recipes: ['Рецепти', "Тут з'являться рецепти крафтів та предметів сервера."],
      story: ['Сюжет', '0 епізод вже йде...'],
      mechanics: ['Механіка', 'Поки що гравці не написали адмінам про знайдену механіку...']
    },
    en: {
      recipes: ['Recipes', 'Crafting recipes and items on the server will appear here.'],
      story: ['Story', 'Episode 0 is already underway...'],
      mechanics: ['Mechanics', 'So far, players have not told the admins about any discovered mechanics...']
    }
  };
  const SECTION_LABEL = { ua: 'Розділи вікі', en: 'Wiki sections' };
  const show = key => {
    for (const tab of tabs) {
      const active = tab.dataset.tab === key;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    }
    for (const panel of panels) panel.hidden = panel.dataset.panel !== key;
  };
  const render = lang => {
    const l = lang === 'en' ? 'en' : 'ua';
    document.querySelector('.wiki-tabs')?.setAttribute('aria-label', SECTION_LABEL[l]);
    for (const tab of tabs) tab.textContent = TEXT[l][tab.dataset.tab][0];
    for (const el of document.querySelectorAll('[data-wiki-i18n]')) {
      const [title, text] = TEXT[l][el.closest('.wiki-panel').dataset.panel];
      el.textContent = el.dataset.wikiI18n.endsWith('Title') ? title : text;
    }
  };
  tabs.forEach(tab => {
    tab.addEventListener('click', () => show(tab.dataset.tab));
    tab.addEventListener('keydown', event => {
      const i = tabs.indexOf(tab);
      let next = null;
      if (event.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (event.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (next) { next.focus(); show(next.dataset.tab); event.preventDefault(); }
    });
  });
  const recipeSearch = document.getElementById('recipeSearch');
  const recipeEmpty = document.getElementById('recipeEmpty');
  const filterRecipes = () => {
    const q = (recipeSearch?.value || '').trim().toLowerCase();
    let shown = 0;
    for (const card of document.querySelectorAll('.recipe')) {
      const match = !q || card.dataset.search.includes(q);
      card.hidden = !match;
      if (match) shown++;
    }
    if (recipeEmpty) recipeEmpty.hidden = shown > 0;
  };
  recipeSearch?.addEventListener('input', filterRecipes);
  render(window.NorthSMPNavigation?.getLang() || 'ua');
  document.addEventListener('northsmp:languageChanged', event => render(event.detail.lang));
})();
