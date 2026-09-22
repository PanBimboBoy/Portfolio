import { PORTFOLIO } from '../data/portfolio.js';
import { $, buildMediaHTML, isVideo } from '../utils/dom.js';
import { initImageZoom, destroyAllZooms } from '../utils/imageZoom.js';

let currentState = null;

export function initProjectModal() {
  const modalEl = $('#portfolio-modal');
  if (!modalEl) return;

  modalEl.innerHTML = `
    <div class="max-w-4xl mx-auto py-12 animate-fade-in px-6">
      <div class="flex justify-between items-start mb-8">
        <div>
          <p class="text-xs font-mono uppercase tracking-[0.15em] text-accent mb-2" id="pm-cat"></p>
          <h2 class="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold" id="pm-title" style="font-family: 'Syne', sans-serif;"></h2>
        </div>
        <button id="pm-close" class="w-9 h-9 bg-white/[0.05] border border-white/[0.08] rounded-lg grid place-items-center hover:border-accent transition-colors text-white text-lg flex-shrink-0 ml-4">✕</button>
      </div>
      <div class="relative min-h-[50vh] flex items-center justify-center mb-6">
        <button id="pm-prev" class="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/[0.08] bg-bg/85 text-white hover:border-accent hover:text-accent transition-colors z-10 hidden">❮</button>
        <div id="pm-main" class="w-full rounded-xl overflow-hidden border border-white/[0.08] bg-surface flex items-center justify-center p-4"></div>
        <button id="pm-next" class="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/[0.08] bg-bg/85 text-white hover:border-accent hover:text-accent transition-colors z-10 hidden">❯</button>
      </div>
      <div class="flex gap-3 flex-wrap mb-6" id="pm-thumbs"></div>
      <p class="text-muted leading-relaxed text-[0.95rem] mb-6 max-w-2xl" id="pm-desc"></p>
      <div class="flex flex-wrap gap-2" id="pm-tags"></div>
    </div>
  `;

  const grid = $('#portfolio-grid');
  if (!grid) return;

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.portfolio-card');
    if (card) openModal(+card.dataset.idx);
  });

  grid.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.portfolio-card');
      if (card) {
        e.preventDefault();
        openModal(+card.dataset.idx);
      }
    }
  });

  $('#pm-close').addEventListener('click', closeModal);
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeModal();
  });

  $('#pm-prev').addEventListener('click', prevImage);
  $('#pm-next').addEventListener('click', nextImage);

  document.addEventListener('keydown', (e) => {
    if (!currentState) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });
}

function openModal(idx) {
  const project = PORTFOLIO[idx];
  currentState = { idx, imgIdx: 0 };

  $('#pm-cat').textContent = project.category;
  $('#pm-title').textContent = project.title;
  $('#pm-desc').textContent = project.fullDesc;

  $('#pm-tags').innerHTML = project.tags.map(t => 
    `<span class="bg-accent/10 text-accent border border-accent/20 rounded px-2 py-1 font-mono text-xs">${t}</span>`
  ).join('');

  renderThumbs(project);
  renderMainImage(project, 0);

  const modal = $('#portfolio-modal');
  modal.classList.remove('hidden');
  modal.classList.add('block', 'bg-[#070709]/92', 'backdrop-blur-xl', 'overflow-y-auto');
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    initImageZoom($('#pm-main'), 'img', {
      zoomFactor: 2.2,
      lensRatio: 0.35,
      resultSize: 320
    });
  }, 100);
}

function renderThumbs(project) {
  const thumbsEl = $('#pm-thumbs');
  thumbsEl.innerHTML = project.images.map((url, i) => {
    const isVid = isVideo(url);
    return `
      <div class="pm-thumb relative w-24 h-16 rounded-md overflow-hidden border cursor-pointer transition-colors ${i === 0 ? 'border-accent' : 'border-white/[0.08] hover:border-accent/50'}" 
           data-ii="${i}" role="button" tabindex="0" aria-label="Ver imagen ${i + 1}">
        ${buildMediaHTML(url, '', { class: 'w-full h-full object-cover' })}
        ${isVid ? `<span class="absolute bottom-1 right-1 w-4 h-4 bg-bg/75 backdrop-blur rounded flex items-center justify-center">
          <svg class="w-2 h-2 fill-white" viewBox="0 0 10 10"><polygon points="2,1 9,5 2,9"/></svg>
        </span>` : ''}
      </div>
    `;
  }).join('');

  thumbsEl.querySelectorAll('.pm-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const ii = +thumb.dataset.ii;
      currentState.imgIdx = ii;
      renderMainImage(project, ii);
      updateActiveThumb(ii);
    });
  });
}

function updateActiveThumb(activeIdx) {
  document.querySelectorAll('.pm-thumb').forEach((th, i) => {
    th.classList.toggle('border-accent', i === activeIdx);
    th.classList.toggle('border-white/[0.08]', i !== activeIdx);
  });
}

function renderMainImage(project, idx) {
  // Destruir cualquier zoom activo antes de reemplazar la imagen
  destroyAllZooms();

  const main = $('#pm-main');
  const url = project.images[idx];
  const vid = isVideo(url);

  main.innerHTML = vid
    ? buildMediaHTML(url, project.title, { 
        class: 'max-w-full max-h-[70vh] object-contain rounded-lg',
        controls: true,
        autoplay: true,
        loop: true
      })
    : buildMediaHTML(url, project.title, {
        class: 'max-w-full max-h-[70vh] object-contain rounded-lg'
      });

  const showNav = project.images.length > 1;
  $('#pm-prev').classList.toggle('hidden', !showNav);
  $('#pm-next').classList.toggle('hidden', !showNav);
}

function prevImage() {
  if (!currentState) return;
  const project = PORTFOLIO[currentState.idx];
  const newIdx = (currentState.imgIdx - 1 + project.images.length) % project.images.length;
  currentState.imgIdx = newIdx;
  renderMainImage(project, newIdx);
  updateActiveThumb(newIdx);
}

function nextImage() {
  if (!currentState) return;
  const project = PORTFOLIO[currentState.idx];
  const newIdx = (currentState.imgIdx + 1) % project.images.length;
  currentState.imgIdx = newIdx;
  renderMainImage(project, newIdx);
  updateActiveThumb(newIdx);
}

function closeModal() {
  const modal = $('#portfolio-modal');

  // Destruir zooms activos
  destroyAllZooms();

  modal.querySelectorAll('video').forEach(v => {
    v.pause();
    v.currentTime = 0;
  });

  modal.classList.add('hidden');
  modal.classList.remove('block', 'bg-[#070709]/92', 'backdrop-blur-xl', 'overflow-y-auto');
  document.body.style.overflow = '';
  currentState = null;
}
