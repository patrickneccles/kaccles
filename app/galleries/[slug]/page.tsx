import reader from "../../../lib/reader";
import { notFound } from "next/navigation";
import Link from "next/link";
import PhotoGrid from "./_components/PhotoGrid";

export async function generateStaticParams() {
  const slugs = await reader.collections.galleries.list();
  return slugs.map((slug) => ({ slug }));
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gallery = await reader.collections.galleries.read(slug);

  if (!gallery) notFound();

  const photos = gallery.photos
    .filter((p) => p.image)
    .map((p) => ({ image: p.image!, caption: p.caption }));

  return (
    <main className="pt-[3.75rem]">
      {/* Gallery header */}
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
              <span>{new Date(gallery.shootDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            )}
          </div>
          {gallery.description && (
            <p className="text-white/50 text-sm mt-4 max-w-xl leading-relaxed">
              {gallery.description}
            </p>
          )}
        </div>
      </div>

      {/* Photo grid + lightbox */}
      <div className="px-0.5 pb-0.5">
        <PhotoGrid photos={photos} title={gallery.title} />
      </div>
    </main>
  );
}
