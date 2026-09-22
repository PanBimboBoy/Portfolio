/**
 * Utility helpers for DOM manipulation
 */
export const $ = (selector, context = document) => context.querySelector(selector);
export const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

export function createElement(tag, classes = '', attrs = {}) {
  const el = document.createElement(tag);
  if (classes) el.className = classes;
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

export function isVideo(url) {
  return /\.(mp4|webm|ogg|mov)$/i.test(url);
}

export function isGif(url) {
  return /\.gif$/i.test(url);
}

export function getMediaType(url) {
  if (isVideo(url)) return 'video';
  if (isGif(url)) return 'gif';
  return 'image';
}

export function buildMediaHTML(src, alt = '', attrs = {}) {
  const type = getMediaType(src);

  if (type === 'video') {
    const autoplay = attrs.autoplay ? 'autoplay' : '';
    const loop = attrs.loop !== false ? 'loop' : '';
    const muted = attrs.muted !== false ? 'muted' : '';
    const controls = attrs.controls ? 'controls' : '';
    const playsinline = 'playsinline';

    return `
      <video ${autoplay} ${loop} ${muted} ${controls} ${playsinline} 
        class="${attrs.class || ''}" 
        preload="${attrs.preload || 'metadata'}"
        style="${attrs.style || ''}">
        <source src="${src}" type="video/mp4">
      </video>
    `;
  }

  return `<img src="${src}" alt="${alt}" class="${attrs.class || ''}" style="${attrs.style || ''}" loading="lazy" />`;
}
