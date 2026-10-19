// Intro interactiva: visor de cámara → AF LOCK → cortinillas → destello → página revelada.
(() => {
  const html = document.documentElement;
  const visor = document.getElementById('visor');
  const boton = document.getElementById('obturador');
  const saltar = document.getElementById('saltar');
  const repetir = document.getElementById('repetir');
  const destello = document.getElementById('destello');
  const af = document.getElementById('af');
  const contenido = document.getElementById('contenido');
  const nav = document.getElementById('nav');
  const cortinillas = visor.querySelectorAll('.cortinilla');
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const punteroFino = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const g = window.gsap;

  let activo = true;
  let disparando = false;

  // ---------- Bloqueo de scroll ----------
  const bloquear = () => {
    html.classList.add('intro-activa');
    contenido.inert = true; nav.inert = true;
    window.__lenis?.stop();
  };
  const desbloquear = () => {
    html.classList.remove('intro-activa');
    contenido.inert = false; nav.inert = false;
    window.__lenis?.start();
    window.ScrollTrigger?.refresh();
  };
  bloquear();

  // ---------- Retícula AF que sigue el cursor ----------
  const pos = { x: innerWidth / 2, y: innerHeight * 0.46 };
  const meta = { ...pos };
  let raf = 0;
  const pintarAF = () => {
    pos.x += (meta.x - pos.x) * 0.14;
    pos.y += (meta.y - pos.y) * 0.14;
    af.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    raf = activo ? requestAnimationFrame(pintarAF) : 0;
  };
  const centrarAF = () => { meta.x = innerWidth / 2; meta.y = innerHeight * 0.46; };
  if (punteroFino && !reducido) {
    visor.addEventListener('pointermove', (e) => { meta.x = e.clientX; meta.y = e.clientY; });
    visor.addEventListener('pointerleave', centrarAF);
  }
  addEventListener('resize', () => { if (activo) centrarAF(); });
  pintarAF();

  // ---------- Enfoque (hover, mantener presionado o foco de teclado) ----------
  const enfocar = () => visor.classList.add('enfocado');
  const desenfocar = () => { if (!disparando) visor.classList.remove('enfocado'); };
  boton.addEventListener('pointerenter', enfocar);
  boton.addEventListener('pointerdown', enfocar);
  boton.addEventListener('focus', enfocar);
  boton.addEventListener('pointerleave', desenfocar);
  boton.addEventListener('blur', desenfocar);
  // En táctil el dedo "mantiene" el enfoque; al llevar la retícula al botón se lee la intención.
  boton.addEventListener('pointerdown', () => { if (!punteroFino) { const r = boton.getBoundingClientRect(); meta.x = r.left + r.width / 2; meta.y = innerHeight * 0.46; } });

  // ---------- Revelado de la página ----------
  const revelarPagina = () => {
    if (!g) return;
    const piezas = [nav, ...document.querySelectorAll('.hero__copia, .hero__texto > *')];
    g.fromTo(piezas, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.06, delay: 0.15, clearProps: 'transform,opacity' });
    g.fromTo('.hero__foto img', { scale: 1.08 }, { scale: 1, duration: 1.6, ease: 'power2.out', clearProps: 'transform' });
  };

  const cerrarVisor = () => {
    activo = false;
    cancelAnimationFrame(raf);
    visor.hidden = true;
    desbloquear();
    html.dataset.revelada = '1';
  };

  // ---------- Disparo ----------
  const disparar = () => {
    if (disparando || !activo) return;
    disparando = true;
    enfocar();

    if (reducido || !g) {
      // Versión tranquila: sin flash, fundido corto.
      visor.style.transition = 'opacity .3s ease';
      visor.style.opacity = '0';
      setTimeout(() => { cerrarVisor(); visor.style.opacity = ''; visor.style.transition = ''; disparando = false; repetir.focus({ preventScroll: true }); }, 300);
      return;
    }

    const tl = g.timeline({ onComplete: () => { disparando = false; } });
    tl.delay(punteroFino ? 0 : 0.18) // en táctil se deja ver un instante el AF LOCK
      .to(cortinillas, { scaleY: 1, duration: 0.08, ease: 'power1.in' })
      .set(destello, { opacity: 1 })
      .set(destello.firstElementChild, { opacity: 1, scale: 1 })
      .add(() => { cerrarVisor(); revelarPagina(); g.set(cortinillas, { scaleY: 0 }); })
      .to(destello, { opacity: 0, duration: 1.2, ease: 'power2.out' })
      .to(destello.firstElementChild, { opacity: 0, scale: 1.15, duration: 1.5, ease: 'power2.out' }, '<')
      .add(() => repetir.focus({ preventScroll: true }), '<0.4');
  };
  boton.addEventListener('click', disparar);

  saltar.addEventListener('click', () => {
    if (!activo) return;
    if (g && !reducido) {
      g.to(visor, { opacity: 0, duration: 0.4, ease: 'power1.out', onComplete: () => { cerrarVisor(); g.set(visor, { clearProps: 'opacity' }); } });
    } else cerrarVisor();
    revelarPagina();
  });

  // ---------- Repetir captura ----------
  repetir.addEventListener('click', () => {
    if (activo) return;
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true, force: true });
    else scrollTo(0, 0);
    visor.classList.remove('enfocado');
    visor.hidden = false;
    activo = true;
    bloquear();
    centrarAF();
    pintarAF();
    if (g && !reducido) g.fromTo(visor, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.out', clearProps: 'opacity' });
    visor.focus({ preventScroll: true });
  });

  addEventListener('keydown', (e) => { if (activo && e.key === 'Escape') saltar.click(); });
  // El foco va al diálogo (no al obturador) para que la foto siga desenfocada hasta que el usuario actúe.
  visor.focus({ preventScroll: true });
})();
