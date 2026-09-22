import { SITE_NAME, SITE_YEAR } from '../data/site.js';

export function renderFooter() {
  const footer = document.getElementById('footer');
  footer.className = 'border-t border-white/[0.07] px-6 md:px-12 py-10 flex items-center justify-between flex-wrap gap-4 font-mono text-[0.7rem] text-muted';
  footer.innerHTML = `
    <span>© ${SITE_YEAR} ${SITE_NAME}</span>
    <div class="flex gap-6">
      <a href="#" class="hover:text-accent transition-colors">GitHub</a>
      <a href="#" class="hover:text-accent transition-colors">Twitter</a>
      <a href="#" class="hover:text-accent transition-colors">Contacto</a>
    </div>
  `;
}
