"use strict";
(() => {
  const list = document.getElementById('recipeList');
  if (!list) return;

    const RECIPES = [
    { slug: 'pillow', name: { ua: 'Подушка', en: 'Pillow' } },
    { slug: 'light', name: { ua: 'Світло', en: 'Light' } },
    { slug: 'invisible-frame', name: { ua: 'Невидима рамка', en: 'Invisible Item Frame' } },
    { slug: 'invisible-glow-frame', name: { ua: 'Невидима сяйна рамка', en: 'Invisible Glow Item Frame' } },
    { slug: 'dice', name: { ua: 'Гральний кубик', en: 'Dice' } },
    { slug: 'chessboard', name: { ua: 'Шахматна дошка', en: 'Chessboard' } },
    { slug: 'backgammon-board', name: { ua: 'Дошка для нард', en: 'Backgammon Board' } },
    { slug: 'backgammon-pouch', name: { ua: 'Мішечок для нардів', en: 'Backgammon Pouch' } },
    { slug: '36-card-pouch', name: { ua: 'Мішечок для карт 36', en: '36-Card Pouch' } },
    { slug: '52-card-pouch', name: { ua: 'Мішечок для карт 52', en: '52-Card Pouch' } },
    { slug: '54-card-pouch', name: { ua: 'Мішечок для карт 54', en: '54-Card Pouch' } },
    { slug: 'checkers-pouch', name: { ua: 'Мішечок для шашок', en: 'Checkers Pouch' } },
    { slug: 'chess-pouch', name: { ua: 'Мішечок для шахмат', en: 'Chess Pouch' } },
    { slug: 'domino-pouch', name: { ua: 'Мішечок для доміно', en: 'Domino Pouch' } },
    { slug: 'copper-disc', name: { ua: 'Мідний метальний диск', en: 'Copper Throwing Disc' } },
    { slug: 'iron-disc', name: { ua: 'Залізний метальний диск', en: 'Iron Throwing Disc' } },
    { slug: 'gold-disc', name: { ua: 'Золотий метальний диск', en: 'Gold Throwing Disc' } },
    { slug: 'diamond-disc', name: { ua: 'Діамантовий метальний диск', en: 'Diamond Throwing Disc' } }
  ];

  const UI = {
    ua: { open: 'Натисніть, щоб побачити рецепт', close: 'Закрити', noScheme: 'Схему ще не додано.', search: 'Пошук рецепта...' },
    en: { open: 'Click to see the recipe', close: 'Close', noScheme: 'Recipe diagram not added yet.', search: 'Search recipes...' }
  };

  const lang = () => (window.NorthSMPNavigation?.getLang() === 'en' ? 'en' : 'ua');
  const t = (obj, l) => (obj && (obj[l] || obj.ua)) || '';
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  };

    const modal = el('div', 'recipe-modal');
  modal.hidden = true;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'recipeModalTitle');
  const wb = el('div', 'wb');
  const closeBtn = el('button', 'wb-close', '×');
  closeBtn.type = 'button';
  const wbTitle = el('h2', 'wb-title');
  wbTitle.id = 'recipeModalTitle';
  const wbBody = el('div');
  wb.append(closeBtn, wbTitle, wbBody);
  modal.append(wb);
  document.body.append(modal);

  let current = null;
  const renderModal = l => {
    if (!current) return;
    wbTitle.textContent = t(current.name, l);
    closeBtn.setAttribute('aria-label', UI[l].close);
    closeBtn.title = UI[l].close;
    wbBody.replaceChildren();
    if (current.slug) {
      const img = el('img', 'wb-img');
      img.src = `wiki-media/recipes/${current.slug}.png`;
      img.alt = t(current.name, l);
      wbBody.append(img);
    } else {
      wbBody.append(el('p', 'wb-note', UI[l].noScheme));
    }
  };
  const openRecipe = r => {
    current = r;
    renderModal(lang());
    modal.hidden = false;
    closeBtn.focus();
  };
  const closeRecipe = () => { modal.hidden = true; current = null; };
  closeBtn.addEventListener('click', closeRecipe);
  modal.addEventListener('click', e => { if (e.target === modal) closeRecipe(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeRecipe(); });

    const buildCards = l => {
    list.replaceChildren();
    for (const r of RECIPES) {
      const card = el('button', 'recipe');
      card.type = 'button';
      card.dataset.search = `${r.name.ua} ${r.name.en}`.toLowerCase();
      if (r.slug) {
        const thumb = el('img');
        thumb.src = `wiki-media/recipes/${r.slug}.png`;
        thumb.alt = '';
        thumb.loading = 'lazy';
        card.append(thumb);
      }
      card.append(el('h3', '', t(r.name, l)), el('p', '', UI[l].open));
      card.addEventListener('click', () => openRecipe(r));
      list.append(card);
    }
    const search = document.getElementById('recipeSearch');
    if (search) {
      search.placeholder = UI[l].search;
      search.setAttribute('aria-label', UI[l].search);
      search.dispatchEvent(new Event('input'));
    }
  };

  buildCards(lang());
  document.addEventListener('northsmp:languageChanged', e => {
    const l = e.detail.lang === 'en' ? 'en' : 'ua';
    buildCards(l);
    renderModal(l);
  });
})();
