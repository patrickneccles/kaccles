import Image from "next/image"
import Link from "next/link"
import { getGalleries } from "../lib/reader"
import GalleryCard from "../components/GalleryCard"
import { signedPhotoUrl } from "../lib/cloudinary-server"

export default async function HomePage() {
  const galleries = await getGalleries()

  if (galleries.length === 0) {
    return (
      <main className="flex h-screen items-center justify-center">
        <p className="text-white/30 text-xs tracking-[0.3em] uppercase">No galleries yet</p>
      </main>
    )
  }

  const [featured, ...rest] = galleries

  return (
    <main className="bg-black">
      {/* Hero — full-screen first photo of the most recent gallery */}
      <Link href={`/galleries/${featured.slug}`} className="relative flex h-screen">
        {featured.entry.photos[0]?.image && (
          <Image
            src={signedPhotoUrl(featured.entry.photos[0].image, "gallery")}
            alt={featured.entry.title}
            fill
            unoptimized
            priority
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-12 left-8 md:left-12">
          {featured.entry.subject && (
            <p className="text-white/60 text-[10px] tracking-[0.3em] uppercase mb-3">
              {featured.entry.subject}
            </p>
          )}
          <h1 className="text-white text-3xl md:text-5xl font-light tracking-tight">
            {featured.entry.title}
          </h1>
          {featured.entry.location && (
            <p className="text-white/50 text-sm mt-2">{featured.entry.location}</p>
          )}
        </div>
      </Link>

      {/* Remaining galleries */}
      {rest.length > 0 && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 mt-0.5">
          {rest.map((gallery, i) => (
            <GalleryCard
              key={gallery.slug}
              slug={gallery.slug}
              title={gallery.entry.title}
              imageUrl={
                gallery.entry.photos[0]?.image
                  ? signedPhotoUrl(gallery.entry.photos[0].image, "thumb")
                  : null
              }
              subject={gallery.entry.subject}
              location={gallery.entry.location}
              priority={i < 2}
            />
          ))}
        </section>
      )}
    </main>
  )
}
