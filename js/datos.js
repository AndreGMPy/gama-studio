// Única fuente de datos de Gama Studio.
// Todo lo que se ve (especialidades, portafolio, paquetes, contacto) sale de aquí;
// las animaciones solo recorren estos arreglos. Para agregar una foto o un paquete,
// edita este archivo — no hace falta tocar js/visor.js, js/escena.js ni js/particulas.js.
//
// Regla de integridad: los datos vienen del sitio original (gama-studio). Lo que no
// existe allá se marca como "[PENDIENTE: ...]" y nunca se inventa.

(() => {
  const FOTOS = 'assets/web/fotos';
  const EQUIPOS = 'assets/web/equipos';

  const whatsapp = '524451447804';
  const mensaje = 'Hola, Me interesa cotizar un servicio de fotografía.';

  // Fotos que el sitio original destacaba en su muestra de inicio (se marcan con lápiz graso en la hoja de contactos).
  const SELECTAS = ['casual-12', 'cumpleanos-01', 'evento-social-10', 'marketing-producto-10', 'casual-11', 'evento-social-07'];

  // Portafolio real (misma clasificación que la galería original).
  const serie = (carpeta, categoria, numeros) =>
    numeros.map((n) => {
      const id = `${carpeta}-${String(n).padStart(2, '0')}`;
      return { id, src: `${FOTOS}/${carpeta}/${id}.webp`, categoria, alt: `${categoria}: fotografía ${String(n).padStart(2, '0')} de Gama Studio`, selecta: SELECTAS.includes(id) };
    });
  const rango = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

  const portafolio = [
    ...serie('casual', 'Casual', rango(1, 12)),
    ...serie('cumpleanos', 'Cumpleaños', rango(1, 8)),
    ...serie('evento-social', 'Cumpleaños', [5, 11]),
    ...serie('evento-social', 'Evento social', [1, 2, 3, 4, 6, 7, 8, 9, 10, 12, 13, 14, 15]),
    ...serie('marketing-producto', 'Marketing', rango(1, 10)),
  ];

  window.GAMA = {
    negocio: {
      nombre: 'Gama Studio',
      lema: 'Fotografía y video',
      responsable: 'Brayan Moreno',
      logo: 'assets/web/logo/logo-circulo.webp',
      zonas: ['Moroleón', 'Uriangato', 'Yuriria'],
      sitio: 'https://www.gamastudiomx.com',
      whatsapp,
      whatsappUrl: `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensaje)}`,
      instagram: 'https://www.instagram.com/gama_studio._?igsh=eDgwcTJhdDh0YWtx',
      direccion: 'Atención por zonas de Moroleón',
      // Indicador "Abierto ahora": dias 1 = lunes … 7 = domingo, horas en formato 24 h.
      horario: [{ dias: [1, 2, 3, 4, 5, 6, 7], abre: '12:00', cierra: '20:00' }],
      extras: ['Eventos sociales', 'XV años', 'Bautizos', 'Graduaciones', 'Videografía', 'Boudoir'],
    },

    hero: {
      titulo: 'Fotografía y video para tus momentos especiales.',
      texto:
        'Sesiones personales, bodas, fotografía para negocios y eventos sociales con un estilo moderno, limpio y cuidado.',
    },

    // La foto que se ve en el visor y queda "capturada" en el Hero.
    // Si cambias la ruta, actualiza también el <link rel="preload"> de index.html.
    visor: {
      foto: `${FOTOS}/casual/casual-05.webp`,
      alt: 'Retrato de una mujer en luz lateral sobre fondo negro, sesión personal de Gama Studio',
      pie: 'Sesión personal',
      exif: { formato: 'GAMA STUDIO RAW', iso: 'ISO 100', apertura: 'f/1.4', velocidad: '1/250s', bateria: '[BATERÍA 100%]', af: 'AF-C' },
    },

    // Escena estrella: una entrada por especialidad. Orden = orden del scroll.
    // particulas: 'bokeh' | 'destello' | 'polvo' | 'grano'
    especialidades: [
      {
        id: 'personales',
        titulo: 'Sesiones personales',
        texto: 'Retratos profesionales para redes sociales, recuerdos personales o momentos especiales.',
        palabra: 'RETRATO',
        fondo: '#09090B',
        particulas: 'bokeh',
        equipo: { src: `${EQUIPOS}/camara-retrato.webp`, alt: 'Cámara mirrorless negro mate con anillo de bronce' },
        ingredientes: `${EQUIPOS}/camara-retrato-ingredientes.webp`,
        foto: { src: `${FOTOS}/casual/casual-10.webp`, alt: 'Pareja recostada en el pasto, sesión personal' },
        categoria: 'Casual',
      },
      {
        id: 'bodas',
        titulo: 'Bodas',
        texto: 'Cobertura fotográfica para capturar los momentos más importantes de tu evento.',
        palabra: 'HISTORIA',
        fondo: '#1C140D',
        particulas: 'destello',
        equipo: { src: `${EQUIPOS}/lente-bodas.webp`, alt: 'Lente de retrato negro mate con anillo de bronce' },
        ingredientes: `${EQUIPOS}/lente-bodas-ingredientes.webp`,
        foto: { src: `${FOTOS}/evento-social/evento-social-06.webp`, alt: 'Novios besándose rodeados de invitados' },
        categoria: 'Evento social',
      },
      {
        id: 'negocios',
        titulo: 'Fotografía para negocios',
        texto: 'Imágenes cuidadas para marcas, productos, espacios y presencia digital.',
        palabra: 'DETALLE',
        fondo: '#141619',
        particulas: 'polvo',
        equipo: { src: `${EQUIPOS}/flash-producto.webp`, alt: 'Flash de estudio negro mate con reflector plateado' },
        ingredientes: `${EQUIPOS}/flash-producto-ingredientes.webp`,
        foto: { src: `${FOTOS}/marketing-producto/marketing-producto-03.webp`, alt: 'Frasco de perfume fotografiado en estudio' },
        categoria: 'Marketing',
      },
      {
        id: 'cumpleanos',
        titulo: 'Sesiones de cumpleaños',
        texto: 'Fotografías creativas para celebrar una fecha especial con estilo y personalidad.',
        palabra: 'ETERNO',
        fondo: '#1A0B0E',
        particulas: 'grano',
        equipo: { src: `${EQUIPOS}/analogica-fineart.webp`, alt: 'Cámara analógica de formato medio con rollo de película' },
        ingredientes: `${EQUIPOS}/analogica-fineart-ingredientes.webp`,
        foto: { src: `${FOTOS}/cumpleanos/cumpleanos-02.webp`, alt: 'Mujer con vestido verde junto a su pastel de cumpleaños' },
        categoria: 'Cumpleaños',
      },
    ],

    // Pestañas de la hoja de contactos y de paquetes (mismo nombre que en la galería original).
    // servicio: id de la especialidad que corresponde a esa categoría.
    categorias: [
      { id: 'Casual', nombre: 'Casual', servicio: 'personales' },
      { id: 'Cumpleaños', nombre: 'Cumpleaños', servicio: 'cumpleanos' },
      { id: 'Evento social', nombre: 'Evento social', servicio: 'bodas' },
      { id: 'Marketing', nombre: 'Marketing', servicio: 'negocios' },
    ],

    // Paquetes por categoría. Por ahora todo se cotiza por WhatsApp.
    // Cuando haya paquetes, se agregan campos opcionales: nombre: '...', incluye: ['...', '...'].
    paquetes: [
      { categoria: 'Casual', precio: 'Se cotiza por WhatsApp' },
      { categoria: 'Cumpleaños', precio: 'Se cotiza por WhatsApp' },
      { categoria: 'Evento social', precio: 'Se cotiza por WhatsApp' },
      { categoria: 'Marketing', precio: 'Se cotiza por WhatsApp' },
    ],

    sobre: {
      titulo: 'Una mirada profesional para tus recuerdos.',
      parrafos: [
        'Gama Studio es un proyecto fotográfico dirigido por Brayan Moreno, enfocado en capturar momentos especiales con un estilo moderno, limpio y creativo.',
        'El estudio trabaja en Moroleón, Uriangato, Yuriria y zonas cercanas, ofreciendo fotografía para eventos sociales, sesiones personales, bodas, negocios y celebraciones importantes.',
      ],
      inicio: 'Gama Studio nació con la intención de crear fotografías con estilo, personalidad y una mirada diferente para cada proyecto.',
      fotos: [
        { src: `${FOTOS}/yo/yo-03.webp`, alt: 'Brayan Moreno, fotógrafo de Gama Studio' },
        { src: `${FOTOS}/yo/yo-04.webp`, alt: 'Brayan Moreno con la cámara' },
      ],
      cifras: [
        { valor: '3', texto: 'zonas principales' },
        { valor: '+6', texto: 'tipos de servicios' },
        { valor: '100%', texto: 'cotización directa' },
      ],
    },

    // Proceso real de reserva (tomado de las preguntas frecuentes del sitio original).
    proceso: [
      { titulo: 'Escríbenos por WhatsApp', texto: 'Un mensaje directo, sin formularios.' },
      { titulo: 'Cuéntanos el servicio, la fecha y la ciudad', texto: 'Con eso sabemos qué tipo de sesión o evento es y dónde será.' },
      { titulo: 'Recibe tu cotización', texto: 'La cotización se hace directamente según el tipo de evento o sesión.' },
    ],

    faqs: [
      { pregunta: '¿Cómo puedo cotizar una sesión o evento?', respuesta: 'Puedes enviar un mensaje por WhatsApp con el tipo de servicio, fecha y ciudad.' },
      { pregunta: '¿Manejan paquetes con precios?', respuesta: 'Por ahora la cotización se realiza directamente por WhatsApp según el tipo de evento o sesión.' },
      { pregunta: '¿También realizan fotografía para negocios?', respuesta: 'Sí, Gama Studio también trabaja fotografía para productos, marcas, negocios y contenido visual.' },
    ],

    creditos: { texto: 'Diseño y desarrollo', logo: 'assets/web/logo/ingenix-hub.webp', alt: 'Ingenix Hub' },

    portafolio,
  };
})();
