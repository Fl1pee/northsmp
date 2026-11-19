'use strict';

const SERVER_IP = 'northsmp.org';
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const I18N = {
  "ua": {
    "side.home": "Головна",
    "side.about": "Про сервер",
    "side.wiki": "Вікі",
    "side.news": "Новини",
    "side.join": "Вступ",
    "side.faq": "Питання",
    "side.support": "Підтримка",
    "side.lang": "Мова",
    "nav.about": "Особливості",
    "nav.faq": "FAQ",
    "nav.support": "Підтримка",
    "brand.sub": "Український Майнкрафт Сервер",
    "hero.kicker": "Ласкаво просимо на",
    "hero.sub": "Сервер для тих, хто любить будувати, досліджувати і з часом розуміє, що найцікавіше відбувається в чаті.",
    "hero.cta": "Дізнатися більше",
    "about.title": "Що тут є",
    "f1.t": "Голосовий чат",
    "f1.p": "Simple Voice Chat на сервері: спілкуйся з гравцями прямо в грі або в Discord.",
    "f2.t": "Алкогольні напої",
    "f2.p": "На прохання гравців додано BreweryX, трохи модифікований для цікавішого ігрового процесу.",
    "f3.t": "Кастомні меблі",
    "f3.p": "Меблі для інтер'єру. Їх крафти є у верстаку.",
    "f4.t": "Малювання",
    "f4.p": "MCPaint, повністю перекладений українською. Малюй шедеври, як Да Вінчі.",
    "join.startT": "Почати гру",
    "join.startP": "На сервері діє whitelist. Заявку подаєш у нашому Discord, адміністрація розглядає її вручну.",
    "join.startCta": "Подати заявку",
    "join.supT": "Підтримка",
    "join.supP": "Сервер живе на ентузіазмі команди. Якщо хочеш допомогти з хостингом, будемо вдячні.",
    "join.supCta": "Підтримати",
    "faq.title": "FAQ",
    "ad.text": "Тут могла бути ваша реклама",
    "foot.c1": "Контакти",
    "foot.c2": "Розділи",
    "nav.wiki": "Вікі",
    "nav.news": "Новини",
    "egg.title": "Секретний режим",
    "egg.exit": "Натисни Esc, щоб закрити",
    "egg.local": "Для перегляду прямо на сайті запустіть його через локальний сервер.",
    "foot.c3": "Медіа",
    "foot.rights": "Усі права належать їх авторам.",
    "foot.legal": "Проєкт не пов'язаний з Mojang Studios або Microsoft.",
    "copied": "IP скопійовано!",
    "faq": [
      [
        "Яка версія сервера?",
        "Paper 26.2. Підключатися можна і з новіших версій клієнта."
      ],
      [
        "Чи є whitelist?",
        "Так. Заявка подається в Discord, після перевірки адміністрація додає тебе до списку."
      ],
      [
        "Що робити, якщо тебе пограбували?",
        "Спершу перевір правила, а потім звернись у підтримку на нашому Discord-сервері."
      ],
      [
        "Чи можна будувати спільне місто з друзями?",
        "Так, але домовтеся про правила, щоб місто не перетворилося на Північну Корею 2.0."
      ],
      [
        "Як стати частиною команди?",
        "Набір відкривається тоді, коли адміністрації потрібні нові сили. Оголошення з'являються в новинах."
      ]
    ],
    "about.more": "Є ще купа механік, які краще побачити на власні очі, ніж читати про них тут. Подавайте заявку якнайшвидше!"
  },
  "en": {
    "side.home": "Home",
    "side.about": "About",
    "side.wiki": "Wiki",
    "side.news": "News",
    "side.join": "Join",
    "side.faq": "FAQ",
    "side.support": "Support",
    "side.lang": "Language",
    "nav.about": "Features",
    "nav.faq": "FAQ",
    "nav.support": "Support",
    "brand.sub": "Ukrainian Minecraft Server",
    "hero.kicker": "Welcome to",
    "hero.sub": "A server for people who like building and exploring, and who eventually realize the best part happens in chat.",
    "hero.cta": "Learn more",
    "about.title": "What is here",
    "f1.t": "Voice chat",
    "f1.p": "Simple Voice Chat on the server: talk to players right in the game or on Discord.",
    "f2.t": "Alcoholic drinks",
    "f2.p": "Added at players' request: BreweryX, slightly modified for a more interesting gameplay.",
    "f3.t": "Custom furniture",
    "f3.p": "Furniture for your interiors. Its recipes are on the crafting table.",
    "f4.t": "Painting",
    "f4.p": "MCPaint, fully translated into Ukrainian. Paint masterpieces like Da Vinci.",
    "join.startT": "Start playing",
    "join.startP": "The server runs a whitelist. Submit your application in our Discord, and the admins review it by hand.",
    "join.startCta": "Apply now",
    "join.supT": "Support",
    "join.supP": "The server runs on the team's effort. If you want to help with hosting, we would be grateful.",
    "join.supCta": "Support us",
    "faq.title": "FAQ",
    "ad.text": "Your ad could be here",
    "foot.c1": "Contacts",
    "foot.c2": "Sections",
    "nav.wiki": "Wiki",
    "nav.news": "News",
    "egg.title": "Secret mode",
    "egg.exit": "Press Esc to close",
    "egg.local": "To play the videos here, run the site on a local web server.",
    "foot.c3": "Media",
    "foot.rights": "All rights belong to their authors.",
    "foot.legal": "This project is not affiliated with Mojang Studios or Microsoft.",
    "copied": "IP copied!",
    "faq": [
      [
        "What version does the server run?",
        "Paper 26.2. You can also connect with newer client versions."
      ],
      [
        "Is there a whitelist?",
        "Yes. Apply in our Discord, and after review the admins add you to the list."
      ],
      [
        "What if someone robs me?",
        "Check the rules first, then contact support on our Discord server."
      ],
      [
        "Can I build a shared town with friends?",
        "Yes, just agree on the rules so the town does not turn into North Korea 2.0."
      ],
      [
        "How do I join the team?",
        "Recruitment opens when the admins need new people. Announcements appear in the news."
      ]
    ],
    "about.more": "There are plenty more mechanics that are better seen than read about. Apply as soon as you can!"
  }
};

let lang = window.NorthSMPNavigation?.getLang() || 'ua';
if (!I18N[lang]) lang = 'ua';
const t = k => I18N[lang][k] ?? k;

function renderFaq() {
  $('#faqList').innerHTML = I18N[lang].faq.map(([q, a], i) => `
    <div class="glass q reveal in" style="--d:${i}">
      <button type="button" aria-expanded="false"><span>${q}</span><i></i></button>
      <div class="ans"><div><p>${a}</p></div></div>
    </div>`).join('');
  $$('.q button').forEach(b => b.addEventListener('click', () => {
    const item = b.parentElement, open = !item.classList.contains('open');
    $$('.q.open').forEach(o => { o.classList.remove('open'); $('button', o).setAttribute('aria-expanded', 'false'); });
    item.classList.toggle('open', open);
    b.setAttribute('aria-expanded', String(open));
  }));
}

function applyLang() {
  document.documentElement.lang = lang === 'ua' ? 'uk' : 'en';
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  renderFaq();
}

// Мову й навігацію перемикає спільний navigation.js.
document.addEventListener('northsmp:languageChanged', event => {
  lang = event.detail.lang;
  applyLang();
});

let tt;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(tt);
  tt = setTimeout(() => el.classList.remove('show'), 1800);
}
$('#ipBtn').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(SERVER_IP); }
  catch (e) {
    const ta = document.createElement('textarea');
    ta.value = SERVER_IP;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (_) {}
    ta.remove();
  }
  toast(t('copied'));
});

// Сніжинки винесені до snowflakes.js.
// Секретна пасхалка винесена до easter-egg.js.

applyLang();
