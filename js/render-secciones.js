// Pinta portafolio, paquetes, sobre, proceso, FAQ y contacto desde window.GAMA.
// Sin defer: el primer cuadro (y la versión sin JS de animación) ya trae todo el contenido.
(() => {
  const G = window.GAMA;
  const $ = (s) => document.querySelector(s);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  // Los datos faltantes se ven a propósito: nunca se rellenan con valores inventados.
  const dato = (t) => (String(t).startsWith('[PENDIENTE') ? `<span class="pendiente-dato">${esc(t)}</span>` : esc(t));
  const wa = (texto) => `https://wa.me/${G.negocio.whatsapp}?text=${encodeURIComponent(texto)}`;
  const servicioDe = (cat) => G.especialidades.find((e) => e.id === cat.servicio);

  document.querySelectorAll('[data-instagram]').forEach((a) => (a.href = G.negocio.instagram));

  // ---------- Hoja de contactos ----------
  const total = G.portafolio.length;
  const cuenta = (id) => G.portafolio.filter((f) => f.categoria === id).length;
  $('#hoja-resumen').innerHTML =
    `${total} fotografías reales de Gama Studio. Las marcadas con lápiz son las que el estudio eligió para su página de inicio. Abre cualquiera para verla completa.`;

  $('#pestanas').innerHTML = [{ id: 'Todos', nombre: 'Todos' }, ...G.categorias]
    .map((c, i) => `<button type="button" class="pestana" data-filtro="${esc(c.id)}" aria-pressed="${i === 0}">
        ${esc(c.nombre)} <span class="pestana__n">${c.id === 'Todos' ? total : cuenta(c.id)}</span></button>`)
    .join('');

  const circulo = '<svg class="cuadro__marca" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 7C24 6 7 26 9 52c2 25 22 41 45 40 24-1 39-20 37-44C89 24 70 8 44 11"/></svg>';
  $('#hoja').innerHTML = G.portafolio
    .map((f, i) => {
      const n = String(i + 1).padStart(2, '0');
      return `<li class="cuadro" data-categoria="${esc(f.categoria)}">
        <button type="button" class="cuadro__boton" data-indice="${i}" aria-label="Ver en grande: ${esc(f.alt)}">
          <img src="${f.src}" alt="${esc(f.alt)}" loading="lazy" decoding="async">
          ${f.selecta ? circulo : ''}
        </button>
        <span class="cuadro__borde"><span>${n}</span><span>${n}A</span></span>
      </li>`;
    })
    .join('');

  // ---------- Paquetes ----------
  const notaPrecios = G.faqs.find((f) => /precios/i.test(f.pregunta));
  $('#paquetes-nota').textContent = notaPrecios ? notaPrecios.respuesta : '';
  $('#paquetes-lista').innerHTML = G.categorias
    .map((c) => {
      const s = servicioDe(c);
      const paquetes = G.paquetes.filter((p) => p.categoria === c.id);
      return `<article class="paquete" data-categoria="${esc(c.id)}">
        <img class="paquete__foto" src="${s.foto.src}" alt="${esc(s.foto.alt)}" loading="lazy" decoding="async">
        <div class="paquete__cuerpo">
          <p class="paquete__cat">${esc(c.nombre)}</p>
          <h3>${esc(s.titulo)}</h3>
          <p class="paquete__texto">${esc(s.texto)}</p>
          ${paquetes.map((p) => `
          <dl class="paquete__datos">
            ${p.nombre ? `<div><dt>Paquete</dt><dd>${dato(p.nombre)}</dd></div>` : ''}
            <div><dt>Precio</dt><dd>${dato(p.precio)}</dd></div>
            ${p.incluye?.length ? `<div><dt>Incluye</dt><dd>${p.incluye.map(dato).join('<br>')}</dd></div>` : ''}
          </dl>`).join('')}
          <a class="boton boton--oscuro" href="${wa(`Hola, me interesa cotizar: ${s.titulo}.`)}" target="_blank" rel="noopener noreferrer">Cotizar ${esc(s.titulo.toLowerCase())}</a>
        </div>
      </article>`;
    })
    .join('');
  $('#extras').innerHTML = G.negocio.extras.map((e) => `<li>${esc(e)}</li>`).join('');

  // ---------- Sobre ----------
  $('#sobre-titulo').textContent = G.sobre.titulo;
  $('#sobre-parrafos').innerHTML = [G.sobre.inicio, ...G.sobre.parrafos].map((p) => `<p>${esc(p)}</p>`).join('');
  $('#sobre-fotos').innerHTML = G.sobre.fotos
    .map((f) => `<figure><img src="${f.src}" alt="${esc(f.alt)}" loading="lazy" decoding="async"></figure>`)
    .join('');
  $('#sobre-cifras').innerHTML = G.sobre.cifras.map((c) => `<div><dt>${esc(c.valor)}</dt><dd>${esc(c.texto)}</dd></div>`).join('');

  // ---------- Proceso y FAQ ----------
  $('#proceso').innerHTML = G.proceso.map((p) => `<li><h3>${esc(p.titulo)}</h3><p>${esc(p.texto)}</p></li>`).join('');
  $('#faqs').innerHTML = G.faqs
    .map((f) => `<details class="faq"><summary>${esc(f.pregunta)}</summary><p>${esc(f.respuesta)}</p></details>`)
    .join('');

  // ---------- Contacto ----------
  $('#contacto-zonas').textContent = G.negocio.zonas.join(' · ') + ' y zonas cercanas';
  $('#contacto-direccion').innerHTML = dato(G.negocio.direccion);
  const t = G.negocio.whatsapp.slice(-10);
  $('#contacto-tel').textContent = `${t.slice(0, 3)} ${t.slice(3, 6)} ${t.slice(6)}`;
  $('#creditos-texto').textContent = G.creditos.texto;
  const cl = $('#creditos-logo');
  cl.src = G.creditos.logo; cl.alt = G.creditos.alt;
})();
