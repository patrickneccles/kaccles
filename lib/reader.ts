import { listGalleries, readGallery } from "./gallery-store"
import type { Gallery } from "./gallery-store"

// Shape used by public pages: { slug, entry }
export type GalleryListItem = { slug: string; entry: Gallery }

export async function getGalleries(): Promise<GalleryListItem[]> {
  const galleries = await listGalleries()
  return galleries.map(({ slug, gallery }) => ({ slug, entry: gallery }))
}

export async function getGallery(slug: string): Promise<Gallery | null> {
  return readGallery(slug)
}
