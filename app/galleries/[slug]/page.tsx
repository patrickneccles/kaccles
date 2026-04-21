import { cache } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getGallery, getGalleries } from "../../../lib/reader"
import PhotoGrid from "../../../components/PhotoGrid"
import { signedPhotoUrl } from "../../../lib/cloudinary-server"

// Memoised so generateMetadata and the page component share one filesystem read.
const fetchGallery = cache((slug: string) => getGallery(slug))

export async function generateStaticParams() {
  const galleries = await getGalleries()
  return galleries.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const gallery = await fetchGallery(slug)
  if (!gallery) return {}

  const heading = [gallery.subject, gallery.title].filter(Boolean).join(" — ")
  const description =
    gallery.description ||
    `${gallery.subject ? `${gallery.subject} photography` : "Photography"} by Kathryn Eccles${gallery.location ? ` in ${gallery.location}` : ""}.`

  const firstPhoto = gallery.photos.find((p) => p.image)?.image
  const ogImageUrl = firstPhoto ? signedPhotoUrl(firstPhoto, "gallery") : undefined

  return {
    title: `${heading} | Kathryn Eccles Photography`,
    description,
    openGraph: {
      title: heading,
      description,
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 800, alt: heading }],
      }),
    },
  }
}

export default async function GalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const gallery = await fetchGallery(slug)

  if (!gallery) notFound()

  const photos = gallery.photos
    .filter((p) => p.image)
    .map((p) => ({
      thumbUrl: signedPhotoUrl(p.image, "thumb"),
      galleryUrl: signedPhotoUrl(p.image, "gallery"),
      caption: p.caption,
    }))

  return (
    <>
      <div className="px-6 py-10 md:px-12">
        <Link
          href="/galleries"
          className="text-white/40 hover:text-white/70 text-xs tracking-[0.2em] uppercase transition-colors"
        >
          ← Galleries
        </Link>
        <div className="mt-6">
          {gallery.subject && (
            <p className="text-white/50 text-[10px] tracking-[0.3em] uppercase mb-2">
              {gallery.subject}
            </p>
          )}
          <h1 className="text-white text-3xl md:text-4xl font-light tracking-tight">
            {gallery.title}
          </h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-white/40 text-xs">
            {gallery.location && <span>{gallery.location}</span>}
            {gallery.shootDate && (
              <span>
                {new Date(gallery.shootDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
          {gallery.description && (
            <p className="text-white/50 text-sm mt-4 max-w-xl leading-relaxed">
              {gallery.description}
            </p>
          )}
        </div>
      </div>

      <div className="px-0.5 pb-0.5">
        <PhotoGrid photos={photos} title={gallery.title} />
      </div>
    </>
  )
}
