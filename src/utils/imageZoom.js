import { $ } from './dom.js';

// Registro global de funciones destroy para poder limpiar desde fuera
const activeZooms = new Set();

export function destroyAllZooms() {
  activeZooms.forEach(fn => fn());
  activeZooms.clear();
}

/**
 * Amazon-style image zoom with lens and result panel
 * Optimized with requestAnimationFrame and passive listeners
 */
export function initImageZoom(container, imgSelector, options = {}) {
  if (!container || !window.matchMedia('(hover: hover)').matches) return;

  const config = {
    zoomFactor: 2.2,
    lensRatio: 0.35,
    resultSize: 320,
    minLensPx: 60,
    ...options
  };

  let lens = null;
  let result = null;
  let activeImg = null;
  let rafId = null;

  function createOverlays() {
    lens = document.createElement('div');
    lens.className = 'zoom-lens fixed pointer-events-none z-50 border border-accent rounded hidden';
    lens.style.cssText = `
      border-color: #7c6ef5;
      background: rgba(124,110,245,0.15);
    `;
    document.body.appendChild(lens);

    result = document.createElement('div');
    result.className = 'zoom-result fixed pointer-events-none z-[500] hidden rounded-lg border border-white/[0.08] shadow-2xl';
    result.style.cssText = `
      background-color: #141417;
      background-repeat: no-repeat;
      box-shadow: 0 20px 60px rgba(0,0,0,0.55);
    `;
    document.body.appendChild(result);
  }

  function destroyOverlays() {
    if (rafId) cancelAnimationFrame(rafId);
    if (lens) { lens.remove(); lens = null; }
    if (result) { result.remove(); result = null; }
    activeImg = null;
  }

  // Registrar para poder destruir desde fuera
  activeZooms.add(destroyOverlays);

  function placeResult(imgRect) {
    let left = imgRect.right + 16;
    let top = imgRect.top;

    if (left + config.resultSize > window.innerWidth - 8) {
      left = imgRect.left - config.resultSize - 16;
    }
    if (left < 8) {
      left = Math.max(8, Math.min(window.innerWidth - config.resultSize - 8, imgRect.left));
      top = imgRect.bottom + 16;
    }
    if (top + config.resultSize > window.innerHeight - 8) {
      top = Math.max(8, window.innerHeight - config.resultSize - 8);
    }

    result.style.left = `${left}px`;
    result.style.top = `${top}px`;
    result.style.width = `${config.resultSize}px`;
    result.style.height = `${config.resultSize}px`;
  }

  container.addEventListener('mouseover', (e) => {
    const img = e.target.closest(imgSelector);
    if (!img || img === activeImg) return;

    // Si ya hay un zoom activo en otro lugar, destruirlo primero
    destroyAllZooms();

    activeImg = img;
    createOverlays();

    const src = img.currentSrc || img.src;
    result.style.backgroundImage = `url("${src}")`;
    result.style.display = 'block';
    lens.style.display = 'block';
  }, { passive: true });

  container.addEventListener('mousemove', (e) => {
    const img = e.target.closest(imgSelector);
    if (!img || img !== activeImg || !lens) return;

    if (rafId) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
      const rect = img.getBoundingClientRect();
      const lensW = Math.max(config.minLensPx, rect.width * config.lensRatio);
      const lensH = Math.max(config.minLensPx, rect.height * config.lensRatio);

      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      let lensX = Math.max(0, Math.min(x - lensW / 2, rect.width - lensW));
      let lensY = Math.max(0, Math.min(y - lensH / 2, rect.height - lensH));

      lens.style.width = `${lensW}px`;
      lens.style.height = `${lensH}px`;
      lens.style.left = `${rect.left + lensX}px`;
      lens.style.top = `${rect.top + lensY}px`;

      placeResult(rect);

      const bgW = rect.width * config.zoomFactor;
      const bgH = rect.height * config.zoomFactor;
      result.style.backgroundSize = `${bgW}px ${bgH}px`;
      result.style.backgroundPosition = `${-(lensX * config.zoomFactor)}px ${-(lensY * config.zoomFactor)}px`;
    });
  }, { passive: true });

  container.addEventListener('mouseout', (e) => {
    if (!activeImg) return;
    const leavingImg = e.target.closest(imgSelector) === activeImg;
    const goingInside = e.relatedTarget && activeImg.contains(e.relatedTarget);
    if (leavingImg && !goingInside) {
      destroyOverlays();
      activeZooms.delete(destroyOverlays);
    }
  }, { passive: true });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      destroyOverlays();
      activeZooms.delete(destroyOverlays);
    }
  });
}
