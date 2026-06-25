"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

const whatsappNumber = "524451447804";

const whatsappMessage = encodeURIComponent(
  "Hola, Me interesa cotizar un servicio de fotografía."
);

const instagramUrl =
  "https://www.instagram.com/gama_studio._?igsh=eDgwcTJhdDh0YWtx";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

type PhotoFrameProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

function PhotoFrame({
  src,
  alt,
  className = "",
  priority = false,
}: PhotoFrameProps) {
  return (
    <div className={`relative overflow-hidden bg-[#ada8a0] ${className}`}>
      <Image
        src={src}
        alt=""
        fill
        aria-hidden="true"
        className="scale-125 object-cover opacity-45 blur-2xl"
      />

      <div className="absolute inset-0 bg-black/10" />

      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-contain p-2"
      />
    </div>
  );
}

const services = [
  {
    title: "Sesiones personales",
    description:
      "Retratos profesionales para redes sociales, recuerdos personales o momentos especiales.",
    image: "/images/casual/casual-05.jpg",
  },
  {
    title: "Fotografía para negocios",
    description:
      "Imágenes cuidadas para marcas, productos, espacios y presencia digital.",
    image: "/images/marketing-producto/marketing-producto-01.jpg",
  },
  {
    title: "Bodas",
    description:
      "Cobertura fotográfica para capturar los momentos más importantes de tu evento.",
    image: "/images/evento-social/evento-social-03.jpg",
  },
  {
    title: "Sesiones de cumpleaños",
    description:
      "Fotografías creativas para celebrar una fecha especial con estilo y personalidad.",
    image: "/images/cumpleanos/cumpleanos-03.jpg",
  },
];

const previewGallery = [
  {
    src: "/images/casual/casual-05.jpg",
    title: "Sesión personal",
  },
  {
    src: "/images/cumpleanos/cumpleanos-03.jpg",
    title: "Cumpleaños",
  },
  {
    src: "/images/evento-social/evento-social-03.jpg",
    title: "Boda",
  },
  {
    src: "/images/marketing-producto/marketing-producto-01.jpg",
    title: "Producto",
  },
  {
    src: "/images/casual/casual-10.jpg",
    title: "Retrato",
  },
  {
    src: "/images/evento-social/evento-social-14.png",
    title: "Evento social",
  },
];

const extraServices = [
  "Eventos sociales",
  "XV años",
  "Bautizos",
  "Graduaciones",
  "Videografía",
  "Boudoir",
];

const faqs = [
  {
    question: "¿Cómo puedo cotizar una sesión o evento?",
    answer:
      "Puedes enviar un mensaje por WhatsApp con el tipo de servicio, fecha y ciudad.",
  },
  {
    question: "¿Manejan paquetes con precios?",
    answer:
      "Por ahora la cotización se realiza directamente por WhatsApp según el tipo de evento o sesión.",
  },
  {
    question: "¿También realizan fotografía para negocios?",
    answer:
      "Sí, Gama Studio también trabaja fotografía para productos, marcas, negocios y contenido visual.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f1e8] text-[#1f1f1f]">
      {/* NAVBAR */}
      <motion.header
        initial={{
          opacity: 0,
          y: -16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
        }}
        className="sticky top-0 z-50 border-b border-black/10 bg-[#f7f1e8]/90 backdrop-blur-xl"
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-5 sm:py-5">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-white shadow-md sm:h-16 sm:w-16">
              <Image
                src="/images/logo/logo-gama.png"
                alt="Logo Gama Studio"
                fill
                className="object-cover"
              />
            </span>

            <div className="min-w-0">
              <p className="truncate text-base font-bold leading-none sm:text-lg">
                Gama Studio
              </p>
              <p className="truncate text-xs text-black/50 sm:text-sm">
                Fotografía y video
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <a href="#servicios" className="transition hover:text-[#9b7b4f]">
              Servicios
            </a>

            <Link href="/galeria" className="transition hover:text-[#9b7b4f]">
              Galería
            </Link>

            <a href="#nosotros" className="transition hover:text-[#9b7b4f]">
              Nosotros
            </a>

            <a href="#contacto" className="transition hover:text-[#9b7b4f]">
              Contacto
            </a>
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#9b7b4f] sm:px-5 sm:text-sm"
          >
            Cotizar
          </a>
        </nav>
      </motion.header>

      {/* HERO */}
      <section className="relative px-4 pb-14 pt-12 sm:px-5 sm:pb-20 sm:pt-16 md:pt-24">
        <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#d9c19b]/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-96 h-96 w-96 rounded-full bg-white/70 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{
              duration: 0.7,
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7b4f] sm:text-sm sm:tracking-[0.35em]">
              Gama Studio Fotográfico
            </p>

            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[0.95] tracking-tight sm:mt-5 sm:text-5xl md:text-7xl">
              Fotografía y video para tus momentos especiales.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-black/65 sm:mt-6 sm:text-lg sm:leading-8">
              Sesiones personales, bodas, fotografía para negocios y eventos
              sociales con un estilo moderno, limpio y cuidado.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
              <motion.a
                whileHover={{
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-black px-7 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#9b7b4f] sm:text-base"
              >
                Cotizar por WhatsApp
              </motion.a>

              <motion.div
                whileHover={{
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.97,
                }}
              >
                <Link
                  href="/galeria"
                  className="block rounded-full border border-black/15 px-7 py-3 text-center text-sm font-semibold transition hover:bg-black hover:text-white sm:text-base"
                >
                  Ver portafolio visual
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <motion.div
              whileHover={{
                scale: 0.99,
              }}
              className="relative sm:col-span-2"
            >
              <PhotoFrame
                src="/images/casual/casual-05.jpg"
                alt="Fotografía principal de Gama Studio"
                priority
                className="h-[360px] rounded-[2rem] shadow-xl sm:h-[430px]"
              />

              <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d9c19b]">
                Gama Studio
              </div>
            </motion.div>

            <motion.div
              whileHover={{
                y: -6,
              }}
            >
              <PhotoFrame
                src="/images/casual/casual-04.jpg"
                alt="Sesión fotográfica de Gama Studio"
                className="h-56 rounded-[1.5rem] shadow-lg"
              />
            </motion.div>

            <motion.div
              whileHover={{
                y: -6,
              }}
              className="relative"
            >
              <PhotoFrame
                src="/images/cumpleanos/cumpleanos-03.jpg"
                alt="Detalle de sesión fotográfica"
                className="h-56 rounded-[1.5rem] shadow-lg"
              />

              <div className="absolute inset-0 rounded-[1.5rem] bg-black/25" />

              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/70">
                  Estilo Gama
                </p>

                <h2 className="mt-2 text-2xl font-semibold leading-tight text-white">
                  De la gama más alta que puedes encontrar.
                </h2>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* DESDE EL INICIO */}
      <section className="px-4 pb-10 sm:px-5">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
            }}
            className="overflow-hidden rounded-[2rem] bg-black p-5 text-white sm:p-6 md:p-10"
          >
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d9c19b] sm:text-sm sm:tracking-[0.3em]">
                  Desde el inicio
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                  Una idea que empezó con visión.
                </h2>

                <p className="mt-5 text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                  Gama Studio nació con la intención de crear fotografías con
                  estilo, personalidad y una mirada diferente para cada
                  proyecto.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <motion.div
                  whileHover={{
                    rotate: -2,
                    scale: 1.02,
                  }}
                >
                  <PhotoFrame
                    src="/images/root/root-coming-01.jpg"
                    alt="Inicio creativo de Gama Studio"
                    className="h-56 rounded-[1.5rem] sm:h-64 md:h-80"
                  />
                </motion.div>

                <motion.div
                  whileHover={{
                    rotate: 2,
                    scale: 1.02,
                  }}
                  className="mt-8 sm:mt-10"
                >
                  <PhotoFrame
                    src="/images/root/root-coming-02.jpg"
                    alt="Concepto visual de Gama Studio"
                    className="h-56 rounded-[1.5rem] sm:h-64 md:h-80"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICIOS */}
      <motion.section
        id="servicios"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 0.7,
        }}
        className="px-4 py-20 sm:px-5 sm:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl sm:mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7b4f] sm:text-sm sm:tracking-[0.3em]">
              Servicios
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Servicios principales de Gama Studio.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <motion.article
                key={service.title}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -10,
                }}
                className="group overflow-hidden rounded-[1.7rem] border border-black/10 bg-white shadow-sm transition hover:shadow-xl"
              >
                <PhotoFrame
                  src={service.image}
                  alt={service.title}
                  className="h-60 rounded-none sm:h-64"
                />

                <div className="p-5 sm:p-6">
                  <h3 className="text-lg font-semibold sm:text-xl">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-black/60 sm:mt-4">
                    {service.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-8 rounded-[2rem] bg-black p-6 text-white sm:mt-10 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d9c19b] sm:text-sm sm:tracking-[0.3em]">
              También disponible
            </p>

            <div className="mt-5 flex flex-wrap gap-3 sm:mt-6">
              {extraServices.map((service) => (
                <span
                  key={service}
                  className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/80 sm:text-sm"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* MINI GALERÍA */}
      <section className="bg-[#1f1f1f] px-3 py-20 text-white sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
            }}
            className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d9c19b] sm:text-sm sm:tracking-[0.3em]">
                Galería
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                Una muestra del trabajo.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-white/60 sm:text-base">
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
            {previewGallery.map((photo, index) => (
              <motion.div
                key={photo.src}
                initial={{
                  opacity: 0,
                  scale: 0.96,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.06,
                }}
                whileHover={{
                  scale: 0.98,
                }}
                className="group relative"
              >
                <PhotoFrame
                  src={photo.src}
                  alt={photo.title}
                  className="aspect-[3/4] rounded-2xl sm:aspect-[4/5]"
                />

                <div className="absolute inset-x-0 bottom-0 rounded-b-2xl bg-gradient-to-t from-black/75 to-transparent p-3 sm:p-4">
                  <p className="text-xs font-semibold sm:text-sm">
                    {photo.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/galeria"
              className="inline-flex rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black sm:text-base"
            >
              Ver portafolio visual
            </Link>
          </div>
        </div>
      </section>

      {/* NOSOTROS */}
      <motion.section
        id="nosotros"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 0.7,
        }}
        className="px-4 py-20 sm:px-5 sm:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <PhotoFrame
            src="/images/yo/yo-03.jpg"
            alt="Brayan Moreno de Gama Studio"
            className="h-[380px] rounded-[2rem] shadow-xl sm:h-[460px]"
          />

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7b4f] sm:text-sm sm:tracking-[0.3em]">
              Sobre Gama Studio
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Una mirada profesional para tus recuerdos.
            </h2>

            <p className="mt-5 text-sm leading-7 text-black/65 sm:mt-6 sm:text-base sm:leading-8">
              Gama Studio es un proyecto fotográfico dirigido por Brayan Moreno,
              enfocado en capturar momentos especiales con un estilo moderno,
              limpio y creativo.
            </p>

            <p className="mt-4 text-sm leading-7 text-black/65 sm:text-base sm:leading-8">
              El estudio trabaja en Moroleón, Uriangato, Yuriria y zonas
              cercanas, ofreciendo fotografía para eventos sociales, sesiones
              personales, bodas, negocios y celebraciones importantes.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-3xl font-semibold">3</p>
                <p className="mt-1 text-sm text-black/60">
                  zonas principales
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-3xl font-semibold">+6</p>
                <p className="mt-1 text-sm text-black/60">
                  tipos de servicios
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-3xl font-semibold">100%</p>
                <p className="mt-1 text-sm text-black/60">
                  cotización directa
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* FAQ */}
      <section className="bg-white px-4 py-20 sm:px-5 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7b4f] sm:text-sm sm:tracking-[0.3em]">
              Dudas comunes
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Preguntas frecuentes.
            </h2>
          </div>

          <div className="grid gap-4">
            {faqs.map((faq, index) => (
              <motion.article
                key={faq.question}
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                }}
                className="rounded-[1.5rem] border border-black/10 bg-[#f7f1e8] p-5 sm:p-6"
              >
                <h3 className="text-base font-semibold sm:text-lg">
                  {faq.question}
                </h3>

                <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
                  {faq.answer}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section
        id="contacto"
        className="bg-[#d9c19b] px-4 py-20 sm:px-5 sm:py-24"
      >
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/60 sm:text-sm sm:tracking-[0.3em]">
            Contacto
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            ¿Quieres cotizar una sesión o evento?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-black/70 sm:mt-6 sm:text-base sm:leading-8">
            Escríbenos por WhatsApp y cuéntanos qué tipo de servicio necesitas,
            la fecha del evento y la ciudad.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-black px-8 py-4 text-sm font-semibold text-white transition hover:bg-white hover:text-black sm:text-base"
            >
              Cotizar por WhatsApp
            </a>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-black/20 px-8 py-4 text-sm font-semibold text-black transition hover:bg-black hover:text-white sm:text-base"
            >
              Ver Instagram
            </a>
          </div>

          <p className="mt-6 text-sm font-medium text-black/60">
            Moroleón · Uriangato · Yuriria
          </p>
        </div>
      </section>
      
      {/* FOOTER */}
<footer className="border-t border-white/10 bg-black px-4 py-7 text-center text-white">
  <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
    Designed & developed by
  </p>

  <div className="mt-3 flex justify-center">
    <Image
      src="/images/logo/ingenix-hub.png"
      alt="Ingenix Hub"
      width={130}
      height={45}
      className="h-auto w-[120px] object-contain opacity-75 sm:w-[130px]"
    />
  </div>
</footer>

      {/* BOTONES FLOTANTES */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 sm:bottom-6 sm:right-6">
        {/* Instagram */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram de Gama Studio"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white shadow-xl transition hover:scale-110"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp de Gama Studio"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-110"
        >
          <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor">
            <path d="M16.01 3C8.84 3 3 8.73 3 15.78c0 2.27.61 4.48 1.77 6.42L3 29l6.98-1.8A13.2 13.2 0 0 0 16.01 28C23.17 28 29 22.27 29 15.22 29 8.17 23.17 3 16.01 3Zm0 22.76c-1.92 0-3.8-.5-5.45-1.46l-.39-.23-4.14 1.07 1.1-4-.26-.41a10.42 10.42 0 0 1-1.61-5.55c0-5.78 4.82-10.48 10.75-10.48s10.75 4.7 10.75 10.48-4.82 10.58-10.75 10.58Zm5.9-7.84c-.32-.16-1.9-.92-2.2-1.03-.3-.11-.52-.16-.74.16-.22.32-.85 1.03-1.04 1.24-.19.22-.38.24-.7.08-.32-.16-1.36-.49-2.6-1.56-.96-.84-1.61-1.88-1.8-2.2-.19-.32-.02-.49.14-.65.14-.14.32-.38.48-.57.16-.19.22-.32.32-.54.11-.22.05-.41-.03-.57-.08-.16-.74-1.75-1.01-2.4-.27-.65-.54-.56-.74-.57h-.63c-.22 0-.57.08-.87.41-.3.32-1.14 1.1-1.14 2.67s1.17 3.1 1.33 3.31c.16.22 2.3 3.45 5.57 4.84.78.33 1.39.53 1.87.68.79.25 1.5.21 2.06.13.63-.09 1.9-.76 2.17-1.49.27-.73.27-1.35.19-1.49-.08-.14-.3-.22-.62-.38Z" />
          </svg>
        </a>
      </div>
    </main>
  );
}