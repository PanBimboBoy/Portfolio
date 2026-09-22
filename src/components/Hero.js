import { SITE_NAME, SITE_DESCRIPTION } from '../data/site.js';

export function renderHero() {
    const hero = document.getElementById('hero');
    hero.className = 'min-h-screen flex flex-col justify-end px-6 md:px-12 pb-20 pt-32 relative overflow-hidden';
    hero.innerHTML = `
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-accent2/7 rounded-full blur-[100px]"></div>
    </div>
    <div class="relative z-10 max-w-7xl mx-auto w-full">
      <h1 class="text-[clamp(3.5rem,9vw,8rem)] font-extrabold leading-[0.95] tracking-tight text-gradient" style="font-family: 'Syne', sans-serif;">
        ${SITE_NAME}
      </h1>
      <p class="hero-subtitle font-mono text-[0.78rem] tracking-[0.18em] uppercase text-muted mt-5 mb-8">
        ${SITE_DESCRIPTION.split(' · ').map((item, i, arr) => 
          i < arr.length - 1 ? `${item} <span class="text-accent">·</span> ` : item
        ).join('')}
      </p>
      <div class="hero-buttons flex gap-3 flex-wrap">
        <a href="#portfolio" class="btn btn-primary">Ver portafolio</a>
        <a href="#gallery" class="btn btn-ghost">Galería</a>
        <a href="#about" class="btn btn-ghost">Sobre Mí</a>
        <a href="#contacto" class="btn btn-ghost">Contactame</a>
      </div>
    </div>
  `;
}