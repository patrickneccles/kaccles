import { getGalleries } from "../../lib/reader"
import GalleryCard from "../../components/GalleryCard"
import { signedPhotoUrl } from "../../lib/cloudinary-server"

export default async function GalleriesPage() {
  const galleries = await getGalleries()

  return (
    <>
      {galleries.length === 0 ? (
        <div className="flex h-[calc(100vh-3.75rem)] items-center justify-center">
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase">No galleries yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5">
          {galleries.map((gallery, i) => (
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
              priority={i < 3}
            />
          ))}
        </div>
      )}
    </>
  )
}
