import Image from "next/image"
import Link from "next/link"

type Props = {
  slug: string
  title: string
  imageUrl: string | null
  subject?: string | null
  location?: string | null
  priority?: boolean
}

export default function GalleryCard({ slug, title, imageUrl, subject, location, priority }: Props) {
  return (
    <Link
      href={`/galleries/${slug}`}
      className="relative block aspect-[4/3] overflow-hidden group bg-zinc-900"
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title}
          fill
          unoptimized
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
        {subject && (
          <p className="text-white/70 text-[10px] tracking-[0.2em] uppercase mb-1">{subject}</p>
        )}
        <h2 className="text-white text-lg font-light leading-snug">{title}</h2>
        {location && <p className="text-white/50 text-xs mt-1">{location}</p>}
      </div>
    </Link>
  )
}
