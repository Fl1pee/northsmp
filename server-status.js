"use strict";

(() => {
  const widget = document.getElementById('serverWidget');
  const stateText = document.getElementById('serverWidgetState');
  const countText = document.getElementById('serverWidgetCount');
  const countWrap = document.getElementById('serverWidgetPlayers');
  if (!widget || !stateText || !countText || !countWrap) return;

  const address = typeof SERVER_IP === 'string' ? SERVER_IP : 'northsmp.org';
  const endpoint = `https://api.mcstatus.io/v2/status/java/${encodeURIComponent(address)}?query=false`;
  const UPDATE_INTERVAL_MS = 5_000;
  const REQUEST_TIMEOUT_MS = 10_000;
  const words = {
    ua: {
      loading: 'Перевірка…', online: 'Працює', offline: 'Вимкнений',
      unknown: 'Статус недоступний', players: 'Гравців онлайн',
      title: 'Стан Minecraft-сервера'
    },
    en: {
      loading: 'Checking…', online: 'Online', offline: 'Offline',
      unknown: 'Status unavailable', players: 'Players online',
      title: 'Minecraft server status'
    }
  };
  let language = window.NorthSMPNavigation?.getLang() === 'en' ? 'en' : 'ua';
  let result = { state: 'loading', count: null, max: null };
  let requestPending = false;

  const emptyServerPhrases = {
    ua: [
      'Кріпери сумують без гостей 💚',
      'Тут чути лише курей 🐔',
      'Спавн чекає на героя ✨',
      'Усі пішли по алмази 💎',
      'Навіть зомбі взяли вихідний 🧟',
      'Ендермен когось виглядає 👀',
      'Скелети грають у соло 💀',
      'Селяни торгують самі з собою 🥕',
      'Твій будинок сам себе не збудує 🏠',
      'Перший гравець стане легендою 👑',
      'Пігліни вже готують вечірку 🐷',
      'Шахта чекає на свою кирку ⛏️',
      'Тут бракує лише тебе 💜',
      'Кіт охороняє спавн 🐈',
      'У Незері теж сьогодні тихо 🔥',
      'Кріпер забув, кого лякати 💥',
      'Вовки чекають на друга 🐺',
      'Тиша перед великим крафтом 🛠️',
      'Херобрін теж десь зник 👁️',
      'Зайди, поки всі алмази твої 💎'
    ],
    en: [
      'Creepers miss their visitors 💚',
      'Only chickens are chatting 🐔',
      'Spawn is waiting for a hero ✨',
      'Everyone went diamond mining 💎',
      'Even zombies took a day off 🧟',
      'Enderman is looking for someone 👀',
      'Skeletons are playing solo 💀',
      'Villagers are trading with themselves 🥕',
      "Your house won't build itself 🏠",
      'The first player becomes a legend 👑',
      'Piglins are planning a party 🐷',
      'The mine is waiting for a pickaxe ⛏️',
      'Only you are missing 💜',
      'The cat is guarding spawn 🐈',
      'Even the Nether is quiet today 🔥',
      'Creepers have nobody to scare 💥',
      'The wolves are waiting for a friend 🐺',
      'The calm before the big craft 🛠️',
      'Even Herobrine has disappeared 👁️',
      'Join while all diamonds are yours 💎'
    ]
  };
  let emptyPhraseIndex = -1;

  function chooseEmptyPhrase() {
    const total = emptyServerPhrases.ua.length;
    if (total === 1) { emptyPhraseIndex = 0; return; }
    let next = Math.floor(Math.random() * (total - 1));
    if (emptyPhraseIndex >= 0 && next >= emptyPhraseIndex) next++;
    emptyPhraseIndex = next;
  }

  function render() {
    const labels = words[language];
    widget.dataset.state = result.state;
    widget.setAttribute('aria-label', labels.title);
    stateText.textContent = labels[result.state];
    const showCount = result.state === 'online' && Number.isInteger(result.count) && result.count >= 0;
    const empty = showCount && result.count === 0;
    const max = Number.isInteger(result.max) && result.max > 0 ? result.max : null;
    widget.dataset.empty = String(empty);
    widget.dataset.noPlayers = String(!showCount);

    if (empty) {
      const phrase = emptyServerPhrases[language][Math.max(0, emptyPhraseIndex)];
      countText.textContent = phrase;
      countWrap.setAttribute('aria-label', language === 'ua'
        ? `Сервер працює, але зараз немає гравців. ${phrase}`
        : `The server is online, but no players are connected. ${phrase}`);
    } else if (showCount) {
      countText.textContent = `${result.count}${max ? ` / ${max}` : ''}`;
      countWrap.setAttribute('aria-label', `${labels.players}: ${result.count}${max ? ` / ${max}` : ''}`);
    } else {
      countText.textContent = '';
      countWrap.removeAttribute('aria-label');
    }
  }

  async function checkServer() {
    if (requestPending || document.visibilityState === 'hidden') return;
    requestPending = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(endpoint, { signal: controller.signal, cache: 'no-store' });
      if (!response.ok) throw new Error(`API HTTP ${response.status}`);
      const data = await response.json();
      if (typeof data.online !== 'boolean') throw new Error('Invalid API response');
      if (!data.online) {
        result = { state: 'offline', count: null, max: null };
      } else {
        const current = data.players?.online;
        const slots = data.players?.max;
        result = {
          state: 'online',
          count: Number.isInteger(current) && current >= 0 ? current : null,
          max: Number.isInteger(slots) && slots > 0 ? slots : null
        };
        if (result.count === 0) chooseEmptyPhrase();
      }
    } catch (error) {
      result = { state: 'unknown', count: null, max: null };
    } finally {
      clearTimeout(timeout);
      requestPending = false;
      render();
    }
  }

  document.addEventListener('northsmp:languageChanged', event => {
    language = event.detail?.lang === 'en' ? 'en' : 'ua';
    render();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkServer();
  });
  window.addEventListener('online', checkServer);
  render();
  checkServer();
  setInterval(checkServer, UPDATE_INTERVAL_MS);
})();
