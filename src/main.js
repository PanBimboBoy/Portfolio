import './styles/main.css';

import { renderNav, initNavObserver } from './components/Nav.js';
import { renderHero } from './components/Hero.js';
import { renderAbout } from './components/About.js';
import { renderPortfolio } from './components/Portfolio.js';
import { renderGallery } from './components/Gallery.js';
import { renderFooter } from './components/Footer.js';
import { initProjectModal } from './components/ProjectModal.js';
import { initLightbox } from './components/Lightbox.js';
import { initScrollAnimations, animateHero } from './utils/animations.js';

renderNav();
renderHero();
renderAbout();
renderPortfolio();
renderGallery();
renderFooter();

initNavObserver();
initProjectModal();
initLightbox();

document.addEventListener('DOMContentLoaded', () => {
  animateHero();
  initScrollAnimations();
});
