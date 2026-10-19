// Interacción de las secciones: pestañas, lupa (visor de foto), inclinación 3D y horario en vivo.
(() => {
  const G = window.GAMA;
  const g = window.gsap;
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const escritorio = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  // ---------- Pestañas: filtran hoja de contactos y paquetes a la vez ----------
  const cuadros = $$('.cuadro');
  const paquetes = $$('.paquete');
  let visibles = G.portafolio.map((_, i) => i);

  const filtrar = (id) => {
    $$('.pestana').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filtro === id)));
    const mostrar = (el) => id === 'Todos' || el.dataset.categoria === id;
    const entran = [];
    cuadros.forEach((el) => {
      const ver = mostrar(el);
      if (ver && el.hidden) entran.push(el);
      el.hidden = !ver;
    });
    paquetes.forEach((el) => (el.hidden = !mostrar(el)));
    visibles = cuadros.filter((el) => !el.hidden).map((el) => Number(el.querySelector('[data-indice]').dataset.indice));
    if (g && !reducido) {
      const nuevos = id === 'Todos' ? entran.slice(0, 24) : cuadros.filter((el) => !el.hidden);
      g.fromTo(nuevos, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.025, ease: 'power2.out', clearProps: 'transform,opacity' });
    }
    window.ScrollTrigger?.refresh();
  };

  $('#pestanas').addEventListener('click', (e) => {
    const b = e.target.closest('.pestana');
    if (!b || b.getAttribute('aria-pressed') === 'true') return;
    filtrar(b.dataset.filtro);
    // En móvil la barra de pestañas se desliza para dejar visible la activa (sin mover la página).
    const barra = b.parentElement;
    barra.scrollTo({ left: b.offsetLeft - (barra.clientWidth - b.offsetWidth) / 2, behavior: reducido ? 'auto' : 'smooth' });
    // Mantiene la hoja a la vista después de filtrar (las pestañas quedan fijas arriba).
    const hoja = $('#hoja');
    if (hoja.getBoundingClientRect().top < 0) {
      const y = hoja.getBoundingClientRect().top + scrollY - 140;
      if (window.__lenis) window.__lenis.scrollTo(y, { duration: 0.6 }); else scrollTo({ top: y, behavior: reducido ? 'auto' : 'smooth' });
    }
  });

  // ---------- Lupa (visor de foto a pantalla completa) ----------
  const lupa = $('#lupa');
  const lupaImg = $('#lupa-img');
  const lupaPie = $('#lupa-pie');
  let actual = 0;
  let origen = null;

  const pintar = (i) => {
    actual = i;
    const f = G.portafolio[i];
    lupaImg.src = f.src;
    lupaImg.alt = f.alt;
    const pos = visibles.indexOf(i) + 1;
    lupaPie.innerHTML = `<span>${f.categoria}</span><span class="mono">${String(i + 1).padStart(2, '0')} · ${pos}/${visibles.length}</span>`;
  };
  const mover = (d) => {
    const k = visibles.indexOf(actual);
    pintar(visibles[(k + d + visibles.length) % visibles.length]);
    if (g && !reducido) g.fromTo(lupaImg, { opacity: 0, x: d * 24 }, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' });
  };
  const abrir = (i, boton) => {
    origen = boton;
    pintar(i);
    lupa.showModal();
    window.__lenis?.stop();
    if (g && !reducido) g.fromTo('.lupa__marco', { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' });
  };
  lupa.addEventListener('close', () => { window.__lenis?.start(); origen?.focus({ preventScroll: true }); });

  $('#hoja').addEventListener('click', (e) => {
    const b = e.target.closest('[data-indice]');
    if (b) abrir(Number(b.dataset.indice), b);
  });
  $('#lupa-ant').addEventListener('click', () => mover(-1));
  $('#lupa-sig').addEventListener('click', () => mover(1));
  $('#lupa-cerrar').addEventListener('click', () => lupa.close());
  lupa.addEventListener('click', (e) => { if (e.target === lupa) lupa.close(); });
  lupa.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') mover(-1);
    if (e.key === 'ArrowRight') mover(1);
  });
  // Deslizar en móvil
  let x0 = null;
  lupa.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  lupa.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) mover(dx < 0 ? 1 : -1);
    x0 = null;
  });

  // ---------- Inclinación 3D (solo escritorio) ----------
  if (g && escritorio && !reducido) {
    $$('.cuadro__boton, .paquete').forEach((el) => {
      const rx = g.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' });
      const ry = g.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' });
      const max = el.classList.contains('paquete') ? 4 : 8;
      g.set(el, { transformPerspective: 900 });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * max * 2);
        rx(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
      });
      el.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  // ---------- Horario y estado "Abierto ahora / Cerrado" ----------
  const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const estado = $('#estado');
  const estadoTexto = $('#estado-texto');
  const horario = G.negocio.horario;

  // Hora local del estudio (Guanajuato usa la hora del centro de México).
  const ahoraMx = () => {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Mexico_City', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    const dia = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(p.weekday) + 1;
    return { dia, min: Number(p.hour) * 60 + Number(p.minute) };
  };
  const aMin = (h) => { const [a, b] = h.split(':').map(Number); return a * 60 + b; };
  // '20:00' → '8:00 p. m.'
  const hora12 = (h) => {
    const [a, b] = h.split(':').map(Number);
    return `${a % 12 || 12}:${String(b).padStart(2, '0')} ${a < 12 ? 'a. m.' : 'p. m.'}`;
  };

  const actualizarEstado = () => {
    if (!Array.isArray(horario) || !horario.length) {
      estado.dataset.estado = 'pendiente';
      estadoTexto.innerHTML = '<span class="pendiente-dato">[PENDIENTE: horario de atención]</span>';
      return;
    }
    const { dia, min } = ahoraMx();
    const hoy = horario.filter((h) => h.dias.includes(dia));
    const abierto = hoy.some((h) => min >= aMin(h.abre) && min < aMin(h.cierra));
    estado.dataset.estado = abierto ? 'abierto' : 'cerrado';
    if (abierto) {
      const cierra = hoy.find((h) => min >= aMin(h.abre) && min < aMin(h.cierra)).cierra;
      estadoTexto.textContent = `Abierto ahora · cierra a las ${hora12(cierra)}`;
    } else {
      const proximo = hoy.find((h) => min < aMin(h.abre));
      const manana = horario.filter((h) => h.dias.includes((dia % 7) + 1)).sort((x, y) => aMin(x.abre) - aMin(y.abre))[0];
      estadoTexto.textContent = proximo
        ? `Cerrado · abre hoy a las ${hora12(proximo.abre)}`
        : manana ? `Cerrado · abre mañana a las ${hora12(manana.abre)}` : 'Cerrado ahora';
    }
  };

  if (Array.isArray(horario) && horario.length) {
    const tramo = (dia) => horario.filter((h) => h.dias.includes(dia)).map((h) => `${hora12(h.abre)} a ${hora12(h.cierra)}`).join(', ');
    const tramos = DIAS.map((_, i) => tramo(i + 1));
    // Si todos los días tienen el mismo horario, basta una línea.
    $('#horario').innerHTML = tramos.every((t) => t && t === tramos[0])
      ? `<li class="hoy"><span>Todos los días</span><span>${tramos[0]}</span></li>`
      : DIAS.map((d, i) => `<li data-dia="${i + 1}"><span>${d}</span><span>${tramos[i] || 'Cerrado'}</span></li>`).join('');
    $(`#horario [data-dia="${ahoraMx().dia}"]`)?.classList.add('hoy');
  }
  actualizarEstado();
  setInterval(actualizarEstado, 60000);
})();
