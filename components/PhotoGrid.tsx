"use client"

import Image from "next/image"
import { useState, useEffect, useRef, useCallback } from "react"

type Photo = { thumbUrl: string; galleryUrl: string; caption: string }

export default function PhotoGrid({ photos, title }: { photos: Photo[]; title: string }) {
  const [active, setActive] = useState<number | null>(null)
  const touchStartX = useRef<number | null>(null)

  const close = useCallback(() => setActive(null), [])
  const prev = useCallback(() => setActive((i) => (i !== null && i > 0 ? i - 1 : i)), [])
  const next = useCallback(
    () => setActive((i) => (i !== null && i < photos.length - 1 ? i + 1 : i)),
    [photos.length]
  )

  // Keyboard navigation
  useEffect(() => {
    if (active === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") prev()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [active, close, next, prev])

  // Lock body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = active !== null ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [active])

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (delta < -50) next()
    else if (delta > 50) prev()
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-0.5">
        {photos.map((photo, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            onContextMenu={(e) => e.preventDefault()}
            className="block w-full mb-0.5 cursor-zoom-in overflow-hidden group"
          >
            <Image
              src={photo.thumbUrl}
              alt={photo.caption || title}
              width={800}
              height={600}
              unoptimized
              className="w-full h-auto transition-opacity duration-300 group-hover:opacity-85"
            />
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <span className="absolute top-6 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-[0.2em]">
            {active + 1} / {photos.length}
          </span>

          <button
            className="absolute top-5 right-6 text-white/50 hover:text-white transition-colors text-xl leading-none p-1"
            onClick={close}
            aria-label="Close"
          >
            ✕
          </button>

          {active > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-4 text-2xl"
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              aria-label="Previous photo"
            >
              ←
            </button>
          )}

          <div
            className="flex flex-col items-center max-w-5xl w-full px-16"
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
          >
            <Image
              src={photos[active].galleryUrl}
              alt={photos[active].caption || title}
              width={1600}
              height={1200}
              unoptimized
              priority
              className="max-h-[82vh] w-auto object-contain"
            />
            {photos[active].caption && (
              <p className="text-white/40 text-sm tracking-wide mt-4 text-center">
                {photos[active].caption}
              </p>
            )}
          </div>

          {active < photos.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-4 text-2xl"
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              aria-label="Next photo"
            >
              →
            </button>
          )}
        </div>
      )}
    </>
  )
}
