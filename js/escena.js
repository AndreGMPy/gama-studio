// Escena estrella: una línea de tiempo fijada (pin + scrub) que recorre GAMA.especialidades.
// Cada transición: el equipo sale (sube, gira, se desvanece) y el siguiente cae y aterriza.
(() => {
  const html = document.documentElement;
  const g = window.gsap, ST = window.ScrollTrigger;
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const listo = () => document.fonts.ready.then(() => { ST?.refresh(); html.dataset.listo = '1'; });

  // Sin GSAP o con movimiento reducido: la escena queda como lista estática completa.
  if (!g || !ST || reducido) { listo(); return; }

  const escena = document.getElementById('especialidades');
  const pasos = [...escena.querySelectorAll('.paso')];
  const fondos = [...escena.querySelectorAll('.escena__fondo')];
  const ticks = [...escena.querySelectorAll('.escena__contador i')];
  const N = pasos.length;
  escena.classList.add('escena--viva');

  const partes = (p) => ({
    img: p.querySelector('.paso__img'),
    ingr: p.querySelector('.paso__ingredientes'),
    letras: p.querySelectorAll('.letra'),
    texto: p.querySelector('.paso__texto'),
    foto: p.querySelector('.paso__foto'),
  });

  // Flotación continua (independiente del scroll, en el contenedor .paso__flota).
  pasos.forEach((p) => {
    g.fromTo(p.querySelector('.paso__flota'), { y: -12 }, { y: 12, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  });

  // Duración en unidades de la línea de tiempo: reposo 1 · transición 1 · reposo 1 …
  const T = (k) => 2 * k + 1;
  const total = 2 * (N - 1) + 1;
  const tl = g.timeline({ defaults: { ease: 'none' } });
  tl.set({}, {}, total); // fija la duración aunque el último tramo sea reposo

  for (let k = 0; k < N - 1; k++) {
    const s = T(k);
    const a = partes(pasos[k]);
    const b = partes(pasos[k + 1]);
    const giro = k % 2 ? -11 : 12; // salida entre 8° y 15°, alternando sentido

    // Salida
    tl.to(a.img, { yPercent: -36, rotation: giro, opacity: 0, duration: 0.6, ease: 'power2.in' }, s)
      .to(a.ingr, { yPercent: -60, opacity: 0, duration: 0.6, ease: 'power2.in' }, s)
      .to(a.letras, { yPercent: -70, opacity: 0, duration: 0.35, stagger: 0.03, ease: 'power2.in' }, s)
      .to([a.texto, a.foto], { y: -40, opacity: 0, duration: 0.4, ease: 'power2.in' }, s)
      .set(pasos[k], { autoAlpha: 0 }, s + 0.62)
      // Fondo interpolado (capas apiladas: se anima opacity, no background-color)
      .to(fondos[k + 1], { opacity: 1, duration: 1 }, s)
      // Entrada
      .set(pasos[k + 1], { autoAlpha: 1 }, s + 0.28)
      .fromTo(b.img, { yPercent: -120, rotation: -20, opacity: 0 }, { yPercent: 0, rotation: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.4)' }, s + 0.3)
      .fromTo(b.ingr, { yPercent: 40, scale: 0.9, opacity: 0 }, { yPercent: 0, scale: 1, opacity: 0.85, duration: 0.8, ease: 'power2.out' }, s + 0.25)
      .fromTo(b.letras, { yPercent: 80, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, stagger: 0.03, ease: 'power3.out' }, s + 0.4)
      .fromTo(b.texto, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }, s + 0.55)
      .fromTo(b.foto, { y: 60, rotation: -4, opacity: 0 }, { y: 0, rotation: 3, opacity: 1, duration: 0.5, ease: 'power3.out' }, s + 0.6);
  }

  // Parallax suave del primer equipo mientras la escena entra en pantalla.
  g.fromTo(partes(pasos[0]).ingr, { yPercent: 18 }, {
    yPercent: 0, ease: 'none',
    scrollTrigger: { trigger: escena, start: 'top bottom', end: 'top top', scrub: 1 },
  });

  // Valor continuo de escena (0…N-1) para partículas y contador.
  const valorEscena = (t) => {
    let v = 0;
    for (let k = 0; k < N - 1; k++) v += Math.min(1, Math.max(0, t - T(k)));
    return v;
  };
  let activo = -1;
  const actualizar = () => {
    const v = valorEscena(tl.time());
    window.Particulas?.mezclar(v);
    const i = Math.round(v);
    if (i !== activo) { ticks.forEach((t, j) => t.classList.toggle('activo', j === i)); activo = i; }
  };

  ST.create({
    trigger: escena,
    start: 'top top',
    end: () => '+=' + innerHeight * N,
    pin: true,
    scrub: 1,
    animation: tl,
    invalidateOnRefresh: true,
    onUpdate: actualizar,
  });
  tl.eventCallback('onUpdate', actualizar);
  actualizar();

  // Navegación oscura sobre la escena.
  ST.create({
    trigger: escena.parentNode, start: 'top 64px', end: 'bottom 64px',
    toggleClass: { targets: '#nav', className: 'nav--oscura' },
  });

  window.Particulas?.iniciar(escena.querySelector('.escena__particulas'), pasos.map((p) => p.dataset.particulas));
  window.__escena = { tl, N, total };
  listo();
})();
