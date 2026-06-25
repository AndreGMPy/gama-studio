"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const whatsappNumber = "524451447804";

const whatsappMessage = encodeURIComponent(
  "Hola, vengo del portafolio visual de Gama Studio. Me interesa cotizar un servicio de fotografía."
);

type Photo = {
  src: string;
  fileName: string;
  title: string;
  category: string;
};

type PhotoFrameProps = {
  src: string;
  alt: string;
  className?: string;
};

function PhotoFrame({ src, alt, className = "" }: PhotoFrameProps) {
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

      <Image src={src} alt={alt} fill className="object-contain p-2" />
    </div>
  );
}

function createPhotos(
  folder: string,
  prefix: string,
  category: string,
  count: number,
  extension = "jpg"
): Photo[] {
  return Array.from({ length: count }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    const fileName = `${prefix}-${number}.${extension}`;

    return {
      src: `/images/${folder}/${fileName}`,
      fileName,
      title: `${category} ${number}`,
      category,
    };
  });
}

const filters = ["Todos", "Casual", "Cumpleaños", "Evento social", "Marketing"];

const casualPhotos = createPhotos("casual", "casual", "Casual", 12);

const birthdayPhotos: Photo[] = [
  ...createPhotos("cumpleanos", "cumpleanos", "Cumpleaños", 8),
  {
    src: "/images/evento-social/evento-social-05.jpg",
    fileName: "evento-social-05.jpg",
    title: "Cumpleaños 09",
    category: "Cumpleaños",
  },
  {
    src: "/images/evento-social/evento-social-11.jpg",
    fileName: "evento-social-11.jpg",
    title: "Cumpleaños 10",
    category: "Cumpleaños",
  },
];

const eventPhotos: Photo[] = [
  ...createPhotos("evento-social", "evento-social", "Evento social", 4),
  ...createPhotos("evento-social", "evento-social", "Evento social", 2).map(
    (photo, index) => {
      const realNumber = index + 6;
      const number = String(realNumber).padStart(2, "0");
      const fileName = `evento-social-${number}.jpg`;

      return {
        src: `/images/evento-social/${fileName}`,
        fileName,
        title: `Evento social ${number}`,
        category: "Evento social",
      };
    }
  ),
  ...[8, 9, 10, 12, 13].map((photoNumber) => {
    const number = String(photoNumber).padStart(2, "0");
    const fileName = `evento-social-${number}.jpg`;

    return {
      src: `/images/evento-social/${fileName}`,
      fileName,
      title: `Evento social ${number}`,
      category: "Evento social",
    };
  }),
  {
    src: "/images/evento-social/evento-social-14.png",
    fileName: "evento-social-14.png",
    title: "Evento social 14",
    category: "Evento social",
  },
  {
    src: "/images/evento-social/evento-social-15.png",
    fileName: "evento-social-15.png",
    title: "Evento social 15",
    category: "Evento social",
  },
];

const marketingPhotos = createPhotos(
  "marketing-producto",
  "marketing-producto",
  "Marketing",
  10
);

const allPhotos: Photo[] = [
  ...casualPhotos,
  ...birthdayPhotos,
  ...eventPhotos,
  ...marketingPhotos,
];

export default function GalleryPage() {
  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const visiblePhotos = useMemo(() => {
    if (selectedFilter === "Todos") {
      return allPhotos;
    }

    return allPhotos.filter((photo) => photo.category === selectedFilter);
  }, [selectedFilter]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f1e8] text-[#1f1f1f]">
      {/* NAVBAR */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="sticky top-0 z-50 border-b border-black/10 bg-[#f7f1e8]/90 backdrop-blur-xl"
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white shadow-sm sm:h-11 sm:w-11">
              <Image
                src="/images/logo/logo-gama.png"
                alt="Logo Gama Studio"
                fill
                className="object-contain p-1"
              />
            </span>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold leading-none">
                Gama Studio
              </p>
              <p className="truncate text-xs text-black/50">
                Portafolio visual
              </p>
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold transition hover:bg-black hover:text-white sm:px-5 sm:text-sm"
            >
              Inicio
            </Link>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#9b7b4f] sm:px-5 sm:text-sm"
            >
              Cotizar
            </a>
          </div>
        </nav>
      </motion.header>

      {/* HERO */}
      <section className="relative overflow-hidden px-4 pb-10 pt-12 sm:px-5 sm:pb-14 sm:pt-20">
        <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-[#d9c19b]/50 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-48 h-80 w-80 rounded-full bg-white/70 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="max-w-4xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7b4f] sm:text-sm sm:tracking-[0.35em]">
              Portafolio visual
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-[0.95] tracking-tight sm:text-5xl md:text-7xl">
              Momentos capturados por Gama Studio.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-black/65 sm:text-lg sm:leading-8">
              Una muestra de sesiones, eventos sociales, cumpleaños y fotografía
              para negocios. Este portafolio se irá actualizando con nuevos
              trabajos.
            </p>
          </motion.div>

          {/* FILTROS */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mt-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {filters.map((filter) => (
              <motion.button
                key={filter}
                type="button"
                onClick={() => setSelectedFilter(filter)}
                whileTap={{ scale: 0.94 }}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition sm:px-5 ${
                  selectedFilter === filter
                    ? "bg-black text-white shadow-lg shadow-black/20"
                    : "bg-white text-black/70 hover:bg-black hover:text-white"
                }`}
              >
                {filter}
              </motion.button>
            ))}
          </motion.div>

          <div className="mt-4 text-sm font-medium text-black/50">
            {visiblePhotos.length} fotografías disponibles
          </div>
        </div>
      </section>

      {/* GALERÍA */}
      <section className="px-3 pb-20 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            layout
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {visiblePhotos.map((photo, index) => (
                <motion.button
                  layout
                  key={photo.src}
                  type="button"
                  onClick={() => setSelectedPhoto(photo)}
                  initial={{ opacity: 0, scale: 0.92, y: 18 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 18 }}
                  transition={{
                    duration: 0.32,
                    delay: Math.min(index * 0.012, 0.2),
                  }}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative overflow-hidden rounded-2xl bg-black/10 text-left shadow-sm"
                >
                  <PhotoFrame
                    src={photo.src}
                    alt={photo.title}
                    className="aspect-[3/4] rounded-2xl sm:aspect-[4/5]"
                  />

                  <div className="absolute inset-x-0 bottom-0 rounded-b-2xl bg-gradient-to-t from-black/80 via-black/35 to-transparent p-3 text-white sm:p-4">
                    <p className="text-xs font-semibold sm:text-sm">
                      {photo.title}
                    </p>
                    <p className="mt-1 hidden text-xs text-white/65 sm:block">
                      {photo.fileName}
                    </p>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* CONTACTO RÁPIDO */}
      <section className="bg-black px-5 py-16 text-white sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d9c19b]">
              ¿Te gusta lo que ves?
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Cotiza tu sesión o evento.
            </h2>
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#d9c19b] px-8 py-4 font-semibold text-black transition hover:bg-white"
          >
            Cotizar por WhatsApp
          </a>
        </div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3 sm:p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative h-[78vh] w-full max-w-5xl overflow-hidden rounded-[1.5rem] bg-black sm:h-[82vh] sm:rounded-[2rem]"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={selectedPhoto.src}
                alt=""
                fill
                aria-hidden="true"
                className="scale-110 object-cover opacity-35 blur-2xl"
              />

              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                fill
                className="object-contain p-3 sm:p-4"
              />

              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute right-3 top-3 rounded-full bg-white px-4 py-2 text-sm font-bold text-black sm:right-4 sm:top-4"
              >
                Cerrar
              </button>

              <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-white/90 p-4 text-black backdrop-blur sm:bottom-4 sm:left-4 sm:right-auto">
                <p className="font-semibold">{selectedPhoto.title}</p>
                <p className="mt-1 text-sm text-black/60">
                  {selectedPhoto.fileName}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}