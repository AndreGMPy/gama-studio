"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";

const whatsappNumber = "524451447804";

const whatsappMessage = encodeURIComponent(
  "Hola, vengo del portafolio visual de Gama Studio. Me interesa cotizar un servicio de fotografía."
);

const instagramUrl =
  "https://www.instagram.com/gama_studio._?igsh=eDgwcTJhdDh0YWtx";

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
        quality={25}
        sizes="20vw"
        className="scale-125 object-cover opacity-45 blur-2xl"
      />

      <div className="absolute inset-0 bg-black/10" />

      <Image
        src={src}
        alt={alt}
        fill
        quality={72}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-contain p-2"
      />
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

function createEventPhoto(photoNumber: number, extension = "jpg"): Photo {
  const number = String(photoNumber).padStart(2, "0");
  const fileName = `evento-social-${number}.${extension}`;

  return {
    src: `/images/evento-social/${fileName}`,
    fileName,
    title: `Evento social ${number}`,
    category: "Evento social",
  };
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
  createEventPhoto(1),
  createEventPhoto(2),
  createEventPhoto(3),
  createEventPhoto(4),
  createEventPhoto(6),
  createEventPhoto(7),
  createEventPhoto(8),
  createEventPhoto(9),
  createEventPhoto(10),
  createEventPhoto(12),
  createEventPhoto(13),
  createEventPhoto(14, "png"),
  createEventPhoto(15, "png"),
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

function GalleryContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("categoria");
  const initialFilter = filters.includes(categoryFromUrl ?? "")
    ? categoryFromUrl!
    : "Todos";

  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    setSelectedFilter(initialFilter);

    // Evita que al venir desde una tarjeta de servicios
    // la galería abra hasta abajo conservando el scroll anterior.
    window.history.scrollRestoration = "manual";
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [initialFilter]);

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
              para negocios. Elige una categoría para ver ese tipo de trabajo.
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

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f7f1e8] text-[#1f1f1f]">
          <p className="text-sm font-semibold text-black/60">
            Cargando portafolio...
          </p>
        </main>
      }
    >
      <GalleryContent />
    </Suspense>
  );
}
