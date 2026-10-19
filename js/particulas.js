// Partículas Canvas 2D para la escena estrella.
// 3 capas de parallax; máx. 40 en móvil y 80 en escritorio.
// El tipo de cada escena viene de GAMA.especialidades[i].particulas y se mezcla con crossfade.
window.Particulas = (() => {
  const TIPOS = {
    // bokeh dorado suave
    bokeh: { color: [217, 178, 120], vel: [0, -0.12], tam: [8, 34], alfa: 0.32 },
    // destellos ópticos de cuatro puntas
    destello: { color: [255, 226, 176], vel: [0.03, -0.05], tam: [5, 15], alfa: 0.85 },
    // polvo de estudio a contraluz
    polvo: { color: [236, 228, 214], vel: [0.16, 0.05], tam: [1, 2.6], alfa: 0.55 },
    // grano fino
    grano: { color: [214, 160, 150], vel: [0, 0], tam: [0.8, 1.8], alfa: 0.5 },
  };

  let ctx, canvas, dpr, w, h, lista = [], tipos = [], mezcla = 0, corriendo = false, visible = true, sprite;
  let desplazamiento = 0, ultimoScroll = 0;

  const azar = (a, b) => a + Math.random() * (b - a);

  // Sprite de bokeh pre-renderizado (un gradiente por partícula sería caro).
  function crearSprite() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    rg.addColorStop(0, 'rgba(255,255,255,1)');
    rg.addColorStop(0.55, 'rgba(255,255,255,.55)');
    rg.addColorStop(0.8, 'rgba(255,255,255,.18)');
    rg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = rg;
    g.fillRect(0, 0, 64, 64);
    return c;
  }

  function nueva(p = {}) {
    const capa = Math.floor(Math.random() * 3); // 0 lejos · 1 medio · 2 cerca
    return Object.assign(p, {
      x: Math.random() * w, y: Math.random() * h,
      capa, prof: [0.35, 0.7, 1.15][capa],
      semilla: Math.random(), fase: Math.random() * Math.PI * 2,
    });
  }

  function medir() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const max = w < 721 ? 40 : 80;
    while (lista.length < max) lista.push(nueva());
    lista.length = max;
  }

  function dibujar(p, tipo, alfa, t) {
    if (alfa <= 0.01) return;
    const T = TIPOS[tipo];
    const [r, g, b] = T.color;
    const tam = (T.tam[0] + (T.tam[1] - T.tam[0]) * p.semilla) * (0.6 + p.prof * 0.4);
    let a = T.alfa * alfa * (0.45 + p.prof * 0.45);

    if (tipo === 'bokeh') {
      ctx.globalAlpha = a * (0.75 + 0.25 * Math.sin(t * 0.0006 + p.fase));
      ctx.drawImage(sprite, p.x - tam, p.y - tam, tam * 2, tam * 2);
      // tinte cálido sobre el sprite blanco
      ctx.globalAlpha = a * 0.6;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, tam * 0.62, 0, Math.PI * 2); ctx.fill();
    } else if (tipo === 'destello') {
      const brillo = Math.max(0, Math.sin(t * 0.0018 + p.fase * 3));
      ctx.globalAlpha = a * brillo * brillo;
      ctx.strokeStyle = `rgb(${r},${g},${b})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x - tam, p.y); ctx.lineTo(p.x + tam, p.y);
      ctx.moveTo(p.x, p.y - tam); ctx.lineTo(p.x, p.y + tam);
      ctx.stroke();
      ctx.globalAlpha = a * brillo;
      ctx.drawImage(sprite, p.x - tam * 0.45, p.y - tam * 0.45, tam * 0.9, tam * 0.9);
    } else if (tipo === 'polvo') {
      // más visible dentro del haz diagonal de contraluz
      const haz = Math.max(0, 1 - Math.abs((p.x / w) - (1 - p.y / h) * 0.8 - 0.25) * 2.2);
      ctx.globalAlpha = a * (0.25 + haz);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(p.x, p.y, tam, tam);
    } else {
      // grano: reposición aleatoria a ritmo de película (~24 fps)
      if (((t / 42) | 0) % 2 === (p.capa & 1) && Math.random() < 0.3) { p.gx = Math.random() * w; p.gy = Math.random() * h; }
      ctx.globalAlpha = a * (0.4 + Math.random() * 0.6);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(p.gx ?? p.x, p.gy ?? p.y, tam, tam);
    }
  }

  function cuadro(t) {
    if (!corriendo) return;
    requestAnimationFrame(cuadro);
    if (!visible) return;

    const i = Math.min(Math.floor(mezcla), tipos.length - 1);
    const f = mezcla - i;
    const A = tipos[i], B = tipos[Math.min(i + 1, tipos.length - 1)];
    const pesoB = A === B ? 0 : f;
    const vel = [
      TIPOS[A].vel[0] * (1 - pesoB) + TIPOS[B].vel[0] * pesoB,
      TIPOS[A].vel[1] * (1 - pesoB) + TIPOS[B].vel[1] * pesoB,
    ];

    // parallax: cada capa responde distinto al desplazamiento del scroll
    const y = window.scrollY;
    desplazamiento = y - ultimoScroll; ultimoScroll = y;

    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for (const p of lista) {
      p.x += vel[0] * p.prof + Math.sin(t * 0.0003 + p.fase) * 0.08;
      p.y += vel[1] * p.prof - desplazamiento * 0.12 * p.prof;
      if (p.y < -40) p.y += h + 80; else if (p.y > h + 40) p.y -= h + 80;
      if (p.x < -40) p.x += w + 80; else if (p.x > w + 40) p.x -= w + 80;
      dibujar(p, A, 1 - pesoB, t);
      if (pesoB) dibujar(p, B, pesoB, t);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  return {
    iniciar(el, tiposEscena) {
      canvas = el; ctx = el.getContext('2d'); tipos = tiposEscena; sprite = crearSprite();
      medir();
      addEventListener('resize', medir);
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(el);
      document.addEventListener('visibilitychange', () => { visible = !document.hidden; });
      corriendo = true;
      ultimoScroll = window.scrollY;
      requestAnimationFrame(cuadro);
    },
    // valor continuo: 0 = escena 1, 1 = escena 2, 1.5 = mitad del crossfade 2→3…
    mezclar(v) { mezcla = Math.max(0, Math.min(tipos.length - 1, v)); },
  };
})();
