"use strict";
(() => {
  const feed = document.getElementById("newsList");
  if (!feed) return;
  const records = Array.isArray(window.NORTHSMP_NEWS) ? window.NORTHSMP_NEWS : [];
  const pick = (value, lang) => {
    if (typeof value === "string") return value;
    if (!value || typeof value !== "object") return "";
    return String(value[lang] ?? value.ua ?? value.en ?? "");
  };
  const element = (tag, className, value) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (value !== undefined) el.textContent = value;
    return el;
  };
  const safeUrl = value => {
    try {
      const url = new URL(value, window.location.href);
      return ["http:", "https:", "file:"].includes(url.protocol) ? url.href : null;
    } catch (_) { return null; }
  };
  const embedYouTube = (value, startSeconds = 0) => {
    try {
      const url = new URL(value);
      const h = url.hostname.replace(/^www\./, "").replace(/^m\./, "");
      let id = "";
      if (h === "youtu.be") id = url.pathname.split("/")[1] || "";
      if (["youtube.com", "youtube-nocookie.com"].includes(h)) {
        if (url.pathname === "/watch") id = url.searchParams.get("v") || "";
        else if (/^\/(embed|shorts)\//.test(url.pathname)) id = url.pathname.split("/")[2] || "";
      }
      if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return null;
      const seconds = Number.isFinite(Number(startSeconds)) ? Math.max(0, Math.floor(Number(startSeconds))) : 0;
      return `https://www.youtube-nocookie.com/embed/${id}?start=${seconds}&rel=0`;
    } catch (_) { return null; }
  };
  const dateLabel = (date, lang) => {
    if (typeof date !== "string") return "";
    const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(date);
    const withTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?(?:Z|[+-]\d{2}:\d{2})$/.test(date);
    if (!dateOnly && !withTime) return date;
    const dt = new Date(dateOnly ? `${date}T12:00:00Z` : date);
    if (Number.isNaN(dt.getTime())) return date;
    const options = { day: "numeric", month: "long", year: "numeric", timeZone: dateOnly ? "UTC" : "Europe/Bratislava" };
    if (withTime) Object.assign(options, { hour: "2-digit", minute: "2-digit", hour12: false });
    return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "uk-UA", options).format(dt);
  };
  const createArticle = (data, lang) => {
    const article = element("article", "news-entry");
    if (data.id) article.id = `news-${String(data.id).replace(/[^a-zA-Z0-9_-]/g, "")}`;
    const meta = element("div", "news-entry-meta");
    if (data.category) meta.append(element("span", "news-entry-kind", pick(data.category, lang)));
    if (data.date) {
      const time = element("time", "", dateLabel(data.date, lang));
      time.dateTime = data.date;
      meta.append(time);
    }
    article.append(meta, element("h2", "", pick(data.title, lang)));
    const paras = data.paragraphs?.[lang] ?? data.paragraphs?.ua ?? [];
    for (const paragraph of Array.isArray(paras) ? paras : [paras]) {
      if (paragraph) article.append(element("p", "", String(paragraph)));
    }
    if (Array.isArray(data.images) && data.images.length) {
      const photos = element("div", "news-entry-images");
      for (const photo of data.images) {
        const src = safeUrl(photo.src);
        if (!src) continue;
        const figure = element("figure", "news-entry-photo");
        const img = element("img");
        img.src = src;
        img.alt = pick(photo.alt, lang) || pick(data.title, lang);
        img.loading = "lazy";
        img.decoding = "async";
        figure.append(img);
        if (photo.caption) figure.append(element("figcaption", "", pick(photo.caption, lang)));
        photos.append(figure);
      }
      if (photos.childElementCount) article.append(photos);
    }
    if (Array.isArray(data.videos)) {
      for (const video of data.videos) {
        const embed = embedYouTube(video.url, video.startSeconds);
        const wrap = element("div", "news-entry-video");
        if (embed) {
          const iframe = element("iframe");
          iframe.src = embed;
          iframe.title = pick(video.title, lang) || (lang === "en" ? "YouTube video" : "Відео YouTube");
          iframe.loading = "lazy";
          iframe.referrerPolicy = "strict-origin-when-cross-origin";
          iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
          iframe.allowFullscreen = true;
          wrap.append(iframe);
        } else {
          const url = safeUrl(video.url);
          if (!url) continue;
          const link = element("a", "", lang === "en" ? "Watch video" : "Переглянути відео");
          link.href = url; link.target = "_blank"; link.rel = "noopener noreferrer";
          wrap.append(link);
        }
        article.append(wrap);
      }
    }
    if (Array.isArray(data.links) && data.links.length) {
      const actions = element("div", "news-entry-actions");
      for (const item of data.links) {
        const url = safeUrl(item.url);
        if (!url) continue;
        const a = element("a", "btn news-discord", pick(item.label, lang));
        a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer";
        actions.append(a);
      }
      if (actions.childElementCount) article.append(actions);
    }
    return article;
  };
  const render = lang => {
    const useLang = lang === "en" ? "en" : "ua";
    feed.replaceChildren();
    const sorted = [...records].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
    if (!sorted.length) {
      feed.append(element("p", "news-empty", useLang === "en" ? "No news yet." : "Новин поки немає."));
      return;
    }
    for (const item of sorted) feed.append(createArticle(item, useLang));
  };
  window.NorthSMPNews = { render };
  render(window.NorthSMPNavigation?.getLang() || "ua");
  document.addEventListener("northsmp:languageChanged", event => render(event.detail.lang));
})();
