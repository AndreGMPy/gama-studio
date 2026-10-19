// Lenis + ScrollTrigger sincronizados y microinteracciones de escritorio.
// Se carga antes de visor.js y escena.js (orden de los <script defer>).
(() => {
  const g = window.gsap, ST = window.ScrollTrigger;
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!g || !ST) return;
  g.registerPlugin(ST);

  if (!reducido && window.Lenis) {
    const lenis = new window.Lenis({ autoRaf: false, lerp: 0.1 });
    lenis.on('scroll', ST.update);
    g.ticker.add((t) => lenis.raf(t * 1000));
    g.ticker.lagSmoothing(0);
    window.__lenis = lenis;
    // Enlaces internos con el mismo desplazamiento suave.
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href').length < 2) return;
      const destino = document.querySelector(a.getAttribute('href'));
      if (!destino) return;
      e.preventDefault();
      lenis.scrollTo(destino, { offset: 0 });
    });
  }

  // Botones magnéticos: solo con mouse real y sin movimiento reducido.
  if (!reducido && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.boton, .obturador__aro').forEach((el) => {
      const xTo = g.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = g.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
      const zona = el.closest('.obturador') || el;
      zona.addEventListener('pointermove', (e) => {
        const r = zona.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.25);
      });
      zona.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }
})();
