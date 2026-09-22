import { GALLERY } from '../data/gallery.js';
import { buildMediaHTML } from '../utils/dom.js';

export function renderGallery() {
  const section = document.getElementById('gallery');
  section.className = 'px-6 md:px-12 py-28 max-w-7xl mx-auto animate-on-scroll';

  section.innerHTML = `
    <p class="section-label mb-3">Capturas</p>
    <h2 class="section-title mb-3" style="font-family: 'Syne', sans-serif;">Galería</h2>
    <p class="text-muted max-w-xl mb-12 text-[0.95rem]">
      Imágenes sueltas, experimentos visuales y momentos destacados.
    </p>
    <div class="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4" id="gallery-grid">
      ${GALLERY.map((item, idx) => `
        <figure class="gallery-item relative rounded-lg overflow-hidden border border-white/[0.07] cursor-pointer break-inside-avoid hover:border-accent/50 transition-all duration-300 group"
                data-gidx="${idx}" tabindex="0" role="button" aria-label="Abrir ${item.title}">
          ${buildMediaHTML(item.src, item.title, { 
            class: 'w-full object-cover block transition-transform duration-300 group-hover:scale-[1.02]',
            autoplay: true,
            loop: true,
            muted: true
          })}
          <figcaption class="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
            <div class="font-semibold text-sm text-text">${item.title}</div>
            <div class="text-xs text-muted">${item.date}</div>
          </figcaption>
        </figure>
      `).join('')}
    </div>
  `;
}
