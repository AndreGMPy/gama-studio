// Validación visual automática de Gama Studio.
// Uso: node tools/revisar.mjs [--url=http://127.0.0.1:4321/] [--sin-reducido]
// Por cada vista (1440x900 y 375x812):
//   a) captura el visor con la foto desenfocada,
//   b) hover / presión sobre el obturador (AF LOCK), clic, espera el destello (~1.5s) y verifica la página revelada,
//   c) recorre la página revelada (incluye cada especialidad de la escena estrella), registrando
//      errores de consola y verificando que no exista scroll horizontal.
// Pasada extra con prefers-reduced-motion. Resultado en validation/resultado.json.
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { iniciarServidor } from './servidor.mjs';

const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v = 'true'] = a.replace(/^--/, '').split('='); return [k, v]; }));
const PUERTO = Number(process.env.PORT) || 4321;
const URL_BASE = args.url || `http://127.0.0.1:${PUERTO}/`;
const SALIDA = fileURLToPath(new URL('../validation/', import.meta.url));

const VISTAS = [
  { nombre: 'escritorio', width: 1440, height: 900, isMobile: false, hasTouch: false },
  { nombre: 'movil', width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];

async function servidorArriba(url) {
  try { return (await fetch(url, { signal: AbortSignal.timeout(1500) })).ok; } catch { return false; }
}

const desborde = (page) => page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
  hay: document.documentElement.scrollWidth > window.innerWidth,
}));

async function irA(page, y) {
  await page.evaluate((y) => {
    if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  }, y);
  await page.waitForTimeout(1700); // scrub: 1 + aterrizaje back.out
}

async function revisarVista(browser, vista, { reducido = false } = {}) {
  const sufijo = `${vista.nombre}${reducido ? '-reducido' : ''}`;
  const ctx = await browser.newContext({
    viewport: { width: vista.width, height: vista.height },
    deviceScaleFactor: vista.deviceScaleFactor || 1,
    isMobile: vista.isMobile, hasTouch: vista.hasTouch,
    reducedMotion: reducido ? 'reduce' : 'no-preference',
    locale: 'es-MX', timezoneId: 'America/Mexico_City',
  });
  const page = await ctx.newPage();
  const errores = [];
  const fallos = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errores.push(`[console.${m.type()}] ${m.text()}`); });
  page.on('pageerror', (e) => errores.push(`[pageerror] ${e.message}`));
  page.on('requestfailed', (r) => errores.push(`[requestfailed] ${r.url()} ${r.failure()?.errorText}`));
  page.on('response', (r) => { if (r.status() >= 400) errores.push(`[http ${r.status()}] ${r.url()}`); });
  const capturas = [];
  const foto = async (nombre) => {
    const ruta = `${sufijo}-${nombre}.png`;
    await page.screenshot({ path: SALIDA + ruta });
    capturas.push(ruta);
  };
  const exigir = (cond, msg) => { if (!cond) fallos.push(msg); };

  await page.goto(URL_BASE, { waitUntil: 'load' });
  await page.waitForFunction(() => document.documentElement.dataset.listo === '1', null, { timeout: 15000 })
    .catch(() => fallos.push('la página no marcó data-listo="1" en 15s'));
  await page.waitForTimeout(400);

  // a) Visor inicial desenfocado
  const inicial = await page.evaluate(() => {
    const img = document.querySelector('#visor-img');
    return {
      visorVisible: !document.getElementById('visor').hidden,
      scrollBloqueado: document.documentElement.classList.contains('intro-activa'),
      filtro: getComputedStyle(img).filter,
      fotoCargada: img.complete && img.naturalWidth > 0,
    };
  });
  exigir(inicial.visorVisible, 'el visor no está visible al cargar');
  exigir(inicial.scrollBloqueado, 'el scroll no está bloqueado durante la intro');
  exigir(/blur\(18px\)/.test(inicial.filtro), `la foto del visor no inicia desenfocada (${inicial.filtro})`);
  exigir(inicial.fotoCargada, 'la foto del visor no cargó');
  await foto('01-visor');

  // b) Enfoque + disparo
  const boton = page.locator('#obturador');
  if (vista.hasTouch) await boton.dispatchEvent('pointerdown');
  else await boton.hover();
  // La transición dura 0.35s; se espera a que termine (máx. 1.5s) en lugar de un tiempo fijo.
  await page.waitForFunction(() => /blur\(0px\)|none/.test(getComputedStyle(document.querySelector('#visor-img')).filter), null, { timeout: 1500 }).catch(() => {});
  const enfoque = await page.evaluate(() => ({
    lock: document.getElementById('visor').classList.contains('enfocado'),
    filtro: getComputedStyle(document.querySelector('#visor-img')).filter,
  }));
  exigir(enfoque.lock, 'no aparece AF LOCK al hacer hover / presionar el obturador');
  exigir(/blur\(0px\)/.test(enfoque.filtro) || enfoque.filtro === 'none', `la foto no enfoca (${enfoque.filtro})`);
  await foto('02-af-lock');

  await boton.click();
  if (!reducido) {
    await page.waitForTimeout(vista.hasTouch ? 330 : 150);
    const op = await page.evaluate(() => Number(getComputedStyle(document.getElementById('destello')).opacity));
    exigir(op > 0.6, `el destello no cubre la pantalla tras el clic (opacity ${op.toFixed(2)})`);
    await foto('03-destello');
  }
  await page.waitForTimeout(1500);
  const revelada = await page.evaluate(() => ({
    visorOculto: document.getElementById('visor').hidden,
    scrollLibre: !document.documentElement.classList.contains('intro-activa'),
    destello: Number(getComputedStyle(document.getElementById('destello')).opacity),
    heroFoto: document.querySelector('#hero-img').complete,
    logo: [...document.querySelectorAll('[data-logo]')].every((i) => i.complete && i.naturalWidth > 0),
    navOpacidad: Number(getComputedStyle(document.getElementById('nav')).opacity),
  }));
  exigir(revelada.visorOculto, 'el visor sigue visible después del disparo');
  exigir(revelada.scrollLibre, 'el scroll sigue bloqueado después del disparo');
  exigir(revelada.destello < 0.05, `el destello no se disipó (opacity ${revelada.destello.toFixed(2)})`);
  exigir(revelada.logo, 'el logo no cargó');
  exigir(revelada.navOpacidad > 0.95, 'la navegación no terminó de aparecer');
  await foto('04-revelada');

  // c) Recorrido: hero, entrada a la escena, cada especialidad y salida.
  const puntos = await page.evaluate(() => {
    const e = document.getElementById('especialidades');
    const top = e.getBoundingClientRect().top + window.scrollY;
    const N = document.querySelectorAll('.paso').length;
    const vivo = e.classList.contains('escena--viva');
    const lista = [{ n: 'entrada-escena', y: top - innerHeight * 0.5 }];
    if (vivo) {
      // la línea de tiempo dura 2N-1 unidades a lo largo de N pantallas; reposo k está en la unidad 2k+0.5
      const total = 2 * N - 1;
      for (let k = 0; k < N; k++) lista.push({ n: `escena-${k + 1}`, y: top + innerHeight * N * ((2 * k + 0.5) / total) });
      lista.push({ n: 'transicion-1-2', y: top + innerHeight * N * (1.55 / total) });
    } else {
      document.querySelectorAll('.paso').forEach((p, k) => lista.push({ n: `escena-${k + 1}`, y: p.getBoundingClientRect().top + window.scrollY }));
    }
    for (const id of ['portafolio', 'paquetes', 'nosotros', 'reserva', 'contacto']) {
      const el = document.getElementById(id);
      if (el) lista.push({ n: id, y: el.getBoundingClientRect().top + window.scrollY - 60 });
    }
    lista.push({ n: 'final', y: document.documentElement.scrollHeight });
    return lista;
  });
  const desbordes = [];
  for (const p of puntos) {
    await irA(page, p.y);
    const d = await desborde(page);
    if (d.hay) desbordes.push({ punto: p.n, ...d });
    await foto(`05-${p.n}`);
  }
  exigir(desbordes.length === 0, `scroll horizontal detectado: ${JSON.stringify(desbordes)}`);

  // Pestañas: filtran hoja y paquetes; la lupa abre la foto completa.
  await irA(page, await page.evaluate(() => document.getElementById('hoja').getBoundingClientRect().top + scrollY - 160));
  const marca = page.locator('.pestana[data-filtro="Marketing"]');
  await marca.click();
  await page.waitForTimeout(900);
  const filtro = await page.evaluate(() => ({
    cuadros: document.querySelectorAll('.cuadro:not([hidden])').length,
    esperados: window.GAMA.portafolio.filter((f) => f.categoria === 'Marketing').length,
    paquetes: [...document.querySelectorAll('.paquete:not([hidden])')].map((p) => p.dataset.categoria),
    pegadas: Math.round(document.getElementById('pestanas').getBoundingClientRect().top),
  }));
  exigir(filtro.cuadros === filtro.esperados, `la pestaña Marketing muestra ${filtro.cuadros} fotos (esperadas ${filtro.esperados})`);
  exigir(filtro.paquetes.length === 1 && filtro.paquetes[0] === 'Marketing', `paquetes filtrados incorrectos: ${filtro.paquetes}`);
  await foto('06-pestana-marketing');
  await page.locator('.cuadro:not([hidden]) .cuadro__boton').first().click();
  await page.waitForTimeout(600);
  const lupa = await page.evaluate(() => ({ abierta: document.getElementById('lupa').open, img: document.getElementById('lupa-img').complete }));
  exigir(lupa.abierta && lupa.img, 'la lupa no abre la foto');
  exigir(!(await desborde(page)).hay, 'scroll horizontal con la lupa abierta');
  await foto('07-lupa');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  await page.locator('.pestana[data-filtro="Todos"]').click();

  const horario = await page.evaluate(() => ({ estado: document.getElementById('estado').dataset.estado, tieneHorario: Array.isArray(window.GAMA.negocio.horario) }));
  exigir(horario.tieneHorario ? ['abierto', 'cerrado'].includes(horario.estado) : horario.estado === 'pendiente', `indicador de horario incoherente (${horario.estado})`);

  // Repetir captura vuelve a abrir el visor.
  await irA(page, 0);
  await page.locator('#repetir').click();
  await page.waitForTimeout(700);
  const repetido = await page.evaluate(() => !document.getElementById('visor').hidden && document.documentElement.classList.contains('intro-activa'));
  exigir(repetido, '"Repetir captura" no reabre el visor');

  await ctx.close();
  return { vista: sufijo, ok: fallos.length === 0 && errores.length === 0, fallos, errores, capturas };
}

await mkdir(SALIDA, { recursive: true });
let servidor = null;
if (!(await servidorArriba(URL_BASE))) servidor = await iniciarServidor(PUERTO);

// Chromium de Playwright; si no está descargado, Edge del sistema (viene con Windows).
const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'msedge' }));
const resultados = [];
try {
  for (const v of VISTAS) resultados.push(await revisarVista(browser, v));
  if (args['sin-reducido'] !== 'true') for (const v of VISTAS) resultados.push(await revisarVista(browser, v, { reducido: true }));
} finally {
  await browser.close();
  servidor?.close();
}

await writeFile(SALIDA + 'resultado.json', JSON.stringify({ fecha: new Date().toISOString(), url: URL_BASE, resultados }, null, 2));
for (const r of resultados) {
  console.log(`${r.ok ? 'OK ' : 'MAL'} ${r.vista} — ${r.capturas.length} capturas`);
  [...r.fallos, ...r.errores].forEach((f) => console.log('    · ' + f));
}
process.exitCode = resultados.every((r) => r.ok) ? 0 : 1;
