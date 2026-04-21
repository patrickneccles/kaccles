import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { readGallery, writeGallery, deleteGallery } from "../../../../../lib/gallery-store"
import { signedPhotoUrl, deleteCloudinaryImage } from "../../../../../lib/cloudinary-server"

function revalidateGallery(slug: string) {
  revalidatePath(`/galleries/${slug}`)
  revalidatePath("/galleries")
  revalidatePath("/")
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const gallery = await readGallery(slug)
  if (!gallery) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({
    ...gallery,
    photos: gallery.photos.map((p) => ({
      ...p,
      thumbUrl: signedPhotoUrl(p.image, "thumb"),
    })),
  })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const body = await request.json()
  // Strip thumbUrl — it's display-only and must not be persisted
  const photos = (body.photos ?? []).map(
    ({ image, caption }: { image: string; caption: string }) => ({ image, caption })
  )
  const current = await readGallery(slug)
  await writeGallery(slug, { ...body, photos })
  revalidateGallery(slug)
  if (current) {
    const kept = new Set(photos.map((p: { image: string }) => p.image))
    await Promise.all(
      current.photos.filter((p) => !kept.has(p.image)).map((p) => deleteCloudinaryImage(p.image))
    )
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const gallery = await readGallery(slug)
  await deleteGallery(slug)
  revalidateGallery(slug)
  if (gallery) {
    await Promise.all(gallery.photos.map((p) => deleteCloudinaryImage(p.image)))
  }
  return NextResponse.json({ ok: true })
}
