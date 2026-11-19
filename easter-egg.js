"use strict";

/*
 * Пасхалка NorthSMP — два справжні YouTube-відео.
 * Щоб змінити ролики, відредагуйте лише id і startSeconds нижче.
 * Відео вбудовуються з YouTube, не копіюються на сервер.
 * Автовідтворення без звуку може залежати від браузера та налаштувань YouTube.
 */
const EASTER_EGG = {
  clickCount: 5,
  clickWindowMs: 4500,
  durationMs: 28000, // 0 — не закривати автоматично
  clips: [
    { frameId: 'subwayEmbed', id: 'i0M4ARe9v0Y', startSeconds: 40 },
    { frameId: 'parkourEmbed', id: '9vNlPqNBOt8', startSeconds: 40 }
  ]
};

(() => {
  const overlay = document.getElementById('easterEgg');
  const closer = document.getElementById('easterClose');
  const logos = [document.getElementById('heroLogo'), document.getElementById('footerLogo')].filter(Boolean);
  if (!overlay || !closer || !logos.length) return;

  let clicks = 0;
  let clickTimer = null;
  let closeTimer = null;
  let active = false;
  let previousFocus = null;

  function urlFor({ id, startSeconds }) {
    // Лише валідні 11-символьні YouTube ID.
    if (!/^[a-zA-Z0-9_-]{11}$/.test(id)) return '';
    const params = new URLSearchParams({
      autoplay: '1', mute: '1', playsinline: '1', rel: '0',
      start: String(Math.max(0, Math.floor(startSeconds)))
    });
    // YouTube вимагає HTTP Referer (або ідентифікацію клієнта).
    // Сторінка має працювати з http(s), а не з file://.
    if (location.protocol === 'http:' || location.protocol === 'https:') {
      params.set('origin', location.origin);
    }
    return `https://www.youtube.com/embed/${id}?${params}`;
  }

  function start() {
    if (active) return;
    active = true;
    previousFocus = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add('egg-open');
    // Відкриття index.html як file:// не передає YouTube адресу сторінки.
    // Замість помилки конфігурації показуємо підказку та прямі посилання.
    const localFile = location.protocol === 'file:';
    for (const clip of EASTER_EGG.clips) {
      const frame = document.getElementById(clip.frameId);
      const notice = document.getElementById(clip.frameId + 'Notice');
      if (frame) {
        frame.hidden = localFile;
        if (!localFile) frame.src = urlFor(clip);
      }
      if (notice) notice.hidden = !localFile;
    }
    closer.focus({ preventScroll: true });
    if (EASTER_EGG.durationMs > 0) closeTimer = setTimeout(stop, EASTER_EGG.durationMs);
  }

  function stop() {
    if (!active) return;
    active = false;
    clearTimeout(closeTimer);
    for (const clip of EASTER_EGG.clips) {
      const frame = document.getElementById(clip.frameId);
      if (frame) {
        frame.removeAttribute('src'); // припинити відтворення
        frame.hidden = false;
      }
      const notice = document.getElementById(clip.frameId + 'Notice');
      if (notice) notice.hidden = true;
    }
    overlay.hidden = true;
    document.body.classList.remove('egg-open');
    clicks = 0;
    if (previousFocus && typeof previousFocus.focus === 'function') {
      previousFocus.focus({ preventScroll: true });
    }
  }

  logos.forEach(logo => logo.addEventListener('click', () => {
    if (active) return;
    clicks += 1;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => { clicks = 0; }, EASTER_EGG.clickWindowMs);
    if (clicks >= EASTER_EGG.clickCount) {
      clearTimeout(clickTimer);
      clicks = 0;
      start();
    }
  }));
  closer.addEventListener('click', stop);
  overlay.addEventListener('click', event => {
    if (event.target === overlay) stop();
  });
  document.addEventListener('keydown', event => {
    if (active && event.key === 'Escape') stop();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
  });
})();
