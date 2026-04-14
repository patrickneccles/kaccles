"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

type Photo = { image: string; caption: string };

export default function PhotoGrid({ photos, title }: { photos: Photo[]; title: string }) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(() => setActive((i) => (i !== null && i > 0 ? i - 1 : i)), []);
  const next = useCallback(
    () => setActive((i) => (i !== null && i < photos.length - 1 ? i + 1 : i)),
    [photos.length]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, close, next, prev]);

  useEffect(() => {
    document.body.style.overflow = active !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [active]);

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-0.5">
        {photos.map((photo, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="block w-full mb-0.5 cursor-zoom-in overflow-hidden group"
          >
            <Image
              src={photo.image}
              alt={photo.caption || title}
              width={800}
              height={600}
              className="w-full h-auto transition-opacity duration-300 group-hover:opacity-85"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={close}
        >
          {/* Counter */}
          <span className="absolute top-6 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-[0.2em]">
            {active + 1} / {photos.length}
          </span>

          {/* Close */}
          <button
            className="absolute top-5 right-6 text-white/50 hover:text-white transition-colors text-xl leading-none p-1"
            onClick={close}
            aria-label="Close"
          >
            ✕
          </button>

          {/* Prev */}
          {active > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-4 text-2xl"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous photo"
            >
              ←
            </button>
          )}

          {/* Image + caption */}
          <div
            className="flex flex-col items-center max-w-5xl w-full px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[active].image}
              alt={photos[active].caption || title}
              width={1600}
              height={1200}
              priority
              className="max-h-[82vh] w-auto object-contain"
              sizes="(max-width: 1280px) 100vw, 80vw"
            />
            {photos[active].caption && (
              <p className="text-white/40 text-xs tracking-wide mt-4 text-center">
                {photos[active].caption}
              </p>
            )}
          </div>

          {/* Next */}
          {active < photos.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-4 text-2xl"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next photo"
            >
              →
            </button>
          )}
        </div>
      )}
    </>
  );
}
