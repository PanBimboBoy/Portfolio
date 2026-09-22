import { GALLERY } from '../data/gallery.js';
import { $, buildMediaHTML } from '../utils/dom.js';
import { initImageZoom, destroyAllZooms } from '../utils/imageZoom.js';

export function initLightbox() {
  const lbEl = $('#lightbox');
  if (!lbEl) return;

  lbEl.innerHTML = `
    <div class="max-w-3xl w-full animate-fade-in relative px-6">
      <button id="lb-close" class="absolute -top-10 right-6 w-9 h-9 bg-white/[0.05] border border-white/[0.08] rounded-lg grid place-items-center hover:border-accent transition-colors text-white">✕</button>
      <div id="lb-media" class="rounded-lg overflow-hidden border border-white/[0.08] bg-surface"></div>
      <div class="text-center mt-6">
        <h3 class="text-xl font-bold" id="lb-title"></h3>
        <p class="font-mono text-xs text-muted mt-1" id="lb-date"></p>
        <p class="text-muted text-sm mt-2 max-w-xl mx-auto" id="lb-desc"></p>
      </div>
    </div>
  `;

  const grid = $('#gallery-grid');
  if (!grid) return;

  grid.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (item) openLightbox(+item.dataset.gidx);
  });

  grid.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const item = e.target.closest('.gallery-item');
      if (item) {
        e.preventDefault();
        openLightbox(+item.dataset.gidx);
      }
    }
  });

  $('#lb-close').addEventListener('click', closeLightbox);
  lbEl.addEventListener('click', (e) => {
    if (e.target === lbEl) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

function openLightbox(idx) {
  const item = GALLERY[idx];
  const lb = $('#lightbox');

  $('#lb-media').innerHTML = buildMediaHTML(item.src, item.title, {
    class: 'w-full max-h-[70vh] object-contain',
    controls: true,
    autoplay: true,
    loop: true
  });

  $('#lb-title').textContent = item.title;
  $('#lb-date').textContent = item.date;
  $('#lb-desc').textContent = item.desc;

  lb.classList.remove('hidden');
  lb.classList.add('flex', 'bg-[#070709]/92', 'backdrop-blur-xl');
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    initImageZoom($('#lb-media'), 'img', {
      zoomFactor: 2.4,
      lensRatio: 0.3,
      resultSize: 340
    });
  }, 100);
}

function closeLightbox() {
  const lb = $('#lightbox');

  // Destruir zooms activos
  destroyAllZooms();

  lb.querySelectorAll('video').forEach(v => {
    v.pause();
    v.currentTime = 0;
  });

  lb.classList.add('hidden');
  lb.classList.remove('flex', 'bg-[#070709]/92', 'backdrop-blur-xl');
  document.body.style.overflow = '';
}
