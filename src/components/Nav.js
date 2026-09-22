import { $ } from '../utils/dom.js';

export function renderNav() {
    const nav = $('#nav');
    nav.className = 'fixed top-0 left-0 right-0 z-50 glass';
    nav.innerHTML = `
    <div class="flex items-center gap-8 px-6 md:px-12 py-4 w-full max-w-7xl mx-auto">
      <a href="#hero" class="w-9 h-9 bg-white/[0.05] border border-white/[0.08] rounded-lg grid place-items-center hover:border-accent transition-colors" aria-label="Inicio">
        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
      </a>
      <div class="w-1.5 h-1.5 rounded-full bg-accent/60"></div>
      <div class="flex gap-6">
        <a href="#about" class="nav-link text-xs font-mono uppercase tracking-[0.12em] text-muted hover:text-text transition-colors" data-section="about">Sobre mí</a>
        <a href="#portfolio" class="nav-link text-xs font-mono uppercase tracking-[0.12em] text-muted hover:text-text transition-colors" data-section="portfolio">Portafolio</a>
        <a href="#gallery" class="nav-link text-xs font-mono uppercase tracking-[0.12em] text-muted hover:text-text transition-colors" data-section="gallery">Galería</a>
      </div>
    </div>
  `;
}

export function initNavObserver() {
    const sections = ['hero', 'portfolio', 'gallery', 'about'];
    const links = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(link => {
                    const isActive = link.dataset.section === entry.target.id;
                    link.classList.toggle('text-white', isActive);
                    link.classList.toggle('text-muted', !isActive);
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });
}