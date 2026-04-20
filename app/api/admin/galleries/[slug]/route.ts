import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { readGallery, writeGallery, deleteGallery } from "../../../../../lib/gallery-store"
import { signedPhotoUrl } from "../../../../../lib/cloudinary-server"

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
  await writeGallery(slug, { ...body, photos })
  revalidateGallery(slug)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  await deleteGallery(slug)
  revalidateGallery(slug)
  return NextResponse.json({ ok: true })
}
