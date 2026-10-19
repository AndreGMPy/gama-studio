// Pinta el HTML a partir de window.GAMA. Se carga sin defer al final del <body>
// para que el primer cuadro ya tenga foto, textos y especialidades completos.
(() => {
  const G = window.GAMA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // Datos de negocio y EXIF repetidos en varios lugares.
  $$('[data-negocio]').forEach((el) => (el.textContent = G.negocio[el.dataset.negocio]));
  $$('[data-exif]').forEach((el) => (el.textContent = G.visor.exif[el.dataset.exif]));
  $$('[data-logo]').forEach((el) => (el.src = G.negocio.logo));
  $$('[data-whatsapp]').forEach((el) => (el.href = G.negocio.whatsappUrl));

  // Visor y Hero comparten la foto "capturada".
  $('#visor-img').src = G.visor.foto;
  const heroImg = $('#hero-img');
  heroImg.src = G.visor.foto;
  heroImg.alt = G.visor.alt;
  $('#hero-pie').textContent = G.visor.pie;
  $('#hero-titulo').textContent = G.hero.titulo;
  $('#hero-texto').textContent = G.hero.texto;
  $('#hero-zonas').textContent = G.negocio.zonas.join(', ').replace(/, ([^,]*)$/, ' y $1');

  // Escena estrella.
  const total = G.especialidades.length;
  $('.escena__fondos').innerHTML = G.especialidades
    .map((e) => `<span class="escena__fondo" style="background:${e.fondo}"></span>`)
    .join('');
  $('.escena__contador').innerHTML = G.especialidades.map(() => '<i></i>').join('');

  $('#pasos').innerHTML = G.especialidades
    .map((e, i) => {
      const letras = [...e.palabra].map((l) => `<span class="letra">${esc(l)}</span>`).join('');
      return `
      <li class="paso" data-paso="${i}" data-particulas="${e.particulas}" style="--fondo:${e.fondo};--letras:${[...e.palabra].length}">
        <div class="paso__palabra" aria-hidden="true">${letras}</div>
        <div class="paso__equipo">
          <img class="paso__ingredientes" src="${e.ingredientes}" alt="" loading="${i ? 'lazy' : 'eager'}" decoding="async">
          <div class="paso__flota"><img class="paso__img" src="${e.equipo.src}" alt="${esc(e.equipo.alt)}" loading="${i ? 'lazy' : 'eager'}" decoding="async"></div>
        </div>
        <div class="paso__texto">
          <p class="paso__num"><span>${i + 1}</span>/${total}</p>
          <h3>${esc(e.titulo)}</h3>
          <p>${esc(e.texto)}</p>
          <a class="paso__enlace" href="${G.negocio.whatsappUrl}" target="_blank" rel="noopener noreferrer">Cotizar ${esc(e.titulo.toLowerCase())}</a>
        </div>
        <figure class="paso__foto">
          <img src="${e.foto.src}" alt="${esc(e.foto.alt)}" loading="lazy" decoding="async">
        </figure>
      </li>`;
    })
    .join('');
})();
