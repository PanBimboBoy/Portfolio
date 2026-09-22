import { PORTFOLIO } from '../data/portfolio.js';
import { buildMediaHTML } from '../utils/dom.js';

export function renderPortfolio() {
  const section = document.getElementById('portfolio');
  section.className = 'px-6 md:px-12 py-28 max-w-7xl mx-auto animate-on-scroll';

  section.innerHTML = `
    <p class="section-label mb-3">Trabajos</p>
    <h2 class="section-title mb-3" style="font-family: 'Syne', sans-serif;">Portafolio</h2>
    <p class="text-muted max-w-xl mb-12 text-[0.95rem]">
      Una selección de proyectos de modelos 3D, pixel art, configuración y traducción.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="portfolio-grid">
      ${PORTFOLIO.map((project, idx) => {
        const cover = project.images[0];
        const thumbs = project.images.slice(1, 4);

        return `
          <article class="portfolio-card bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden cursor-pointer card-hover group" 
                   data-idx="${idx}" tabindex="0" role="button" aria-label="Abrir ${project.title}">
            <div class="relative aspect-video bg-surface overflow-hidden">
              ${buildMediaHTML(cover, project.title, { 
                class: 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500',
                autoplay: true,
                loop: true,
                muted: true
              })}
              <span class="absolute top-3 left-3 bg-bg/70 backdrop-blur-md border border-white/[0.08] rounded px-2 py-1 font-mono text-[0.65rem] text-muted">
                ${project.images.length} items
              </span>
              ${thumbs.length > 0 ? `
                <div class="absolute bottom-3 right-3 flex gap-1.5">
                  ${thumbs.map(t => `
                    <div class="w-9 h-7 rounded overflow-hidden border border-white/20 bg-surface">
                      ${buildMediaHTML(t, '', { class: 'w-full h-full object-cover' })}
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
            <div class="p-5">
              <p class="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-accent mb-1">${project.category}</p>
              <h3 class="text-lg font-bold mb-2 text-text group-hover:text-accent transition-colors">${project.title}</h3>
              <p class="text-sm text-muted leading-relaxed mb-4 line-clamp-2">${project.desc}</p>
              <div class="flex flex-wrap gap-2">
                ${project.tags.map(tag => `
                  <span class="bg-accent/10 text-accent border border-accent/20 rounded px-2 py-0.5 font-mono text-[0.65rem]">${tag}</span>
                `).join('')}
              </div>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
}
