import fs from "fs/promises"
import path from "path"
import { parse, stringify } from "yaml"

const CONTENT_DIR = path.join(process.cwd(), "content", "galleries")

export type Photo = {
  image: string
  caption: string
}

export type Gallery = {
  title: string
  location: string
  subject: string
  shootDate: string
  description: string
  photos: Photo[]
  published: boolean
}

export type GalleryEntry = {
  slug: string
  gallery: Gallery
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export async function listGalleries(): Promise<GalleryEntry[]> {
  let files: string[]
  try {
    files = await fs.readdir(CONTENT_DIR)
  } catch {
    return []
  }

  const entries = await Promise.all(
    files
      .filter((f) => f.endsWith(".yaml"))
      .map(async (f) => {
        const slug = f.slice(0, -5)
        const gallery = await readGallery(slug)
        return gallery ? { slug, gallery } : null
      })
  )

  return entries
    .filter((e): e is GalleryEntry => e !== null)
    .sort((a, b) => {
      if (!a.gallery.shootDate) return 1
      if (!b.gallery.shootDate) return -1
      return b.gallery.shootDate.localeCompare(a.gallery.shootDate)
    })
}

export async function readGallery(slug: string): Promise<Gallery | null> {
  try {
    const raw = await fs.readFile(path.join(CONTENT_DIR, `${slug}.yaml`), "utf8")
    const data = parse(raw)
    return {
      title: data.title ?? "",
      location: data.location ?? "",
      subject: data.subject ?? "",
      shootDate: data.shootDate ?? "",
      description: data.description ?? "",
      photos: (data.photos ?? []).map((p: { image: string; caption: string }) => ({
        image: p.image,
        caption: p.caption ?? "",
      })),
      published: data.published !== false,
    }
  } catch {
    return null
  }
}

export async function writeGallery(slug: string, gallery: Gallery): Promise<void> {
  await fs.mkdir(CONTENT_DIR, { recursive: true })
  const data: Record<string, unknown> = { title: gallery.title }
  if (gallery.location) data.location = gallery.location
  if (gallery.subject) data.subject = gallery.subject
  if (gallery.shootDate) data.shootDate = gallery.shootDate
  if (gallery.description) data.description = gallery.description
  if (gallery.published === false) data.published = false
  data.photos = gallery.photos
  await fs.writeFile(path.join(CONTENT_DIR, `${slug}.yaml`), stringify(data))
}

export async function deleteGallery(slug: string): Promise<void> {
  await fs.unlink(path.join(CONTENT_DIR, `${slug}.yaml`))
}
