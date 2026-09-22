import { SKILLS } from '../data/skills.js';

export function renderAbout() {
  const about = document.getElementById('about');
  about.className = 'px-6 md:px-12 py-28 max-w-7xl mx-auto animate-on-scroll';
  about.innerHTML = `
    <div class="grid md:grid-cols-2 gap-16 items-center">
      <div>
        <p class="section-label mb-3">Sobre mí</p>
        <h2 class="section-title mb-4" style="font-family: 'Syne', sans-serif;">Quién soy</h2>
        <p class="text-muted text-[0.95rem] leading-relaxed mb-4">
          Desarrollador creativo especializado en el ecosistema Minecraft. Diseño servidores custom 
          con ItemsAdder y CraftEngine, creo assets visuales 3D y pixel art, y gestiono localización 
          de contenido para proyectos internacionales.
        </p>
        <p class="text-muted text-[0.95rem] leading-relaxed">
          Apasionado por la optimización, la estética limpia y las experiencias inmersivas. 
          Cada proyecto es una oportunidad para superar límites técnicos y visuales.
        </p>
      </div>
      <div>
        <p class="section-label mb-5">Habilidades</p>
        <div class="grid grid-cols-2 gap-3" id="skills-grid">
          ${SKILLS.map(skill => `
            <div class="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4 hover:border-white/[0.12] transition-colors">
              <div class="font-mono text-xs text-text mb-2">${skill.name}</div>
              <div class="h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                <div class="h-full rounded-full bg-gradient-to-r from-accent to-accent2 transition-all duration-1000 ease-out" 
                     style="width: 0%" data-width="${skill.level}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-width]').forEach(bar => {
          bar.style.width = bar.dataset.width;
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(about);
}
