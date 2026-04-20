import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { listGalleries, readGallery, writeGallery, slugify } from "../../../../lib/gallery-store"

export async function GET() {
  const galleries = await listGalleries()
  return NextResponse.json(galleries)
}

export async function POST(request: NextRequest) {
  const { title } = await request.json()
  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 })
  }

  const slug = slugify(title.trim())
  if (!slug) {
    return NextResponse.json({ error: "Title must contain letters or numbers" }, { status: 400 })
  }

  const existing = await readGallery(slug)
  if (existing) {
    return NextResponse.json({ error: "A gallery with that title already exists" }, { status: 409 })
  }

  await writeGallery(slug, {
    title: title.trim(),
    location: "",
    subject: "",
    shootDate: "",
    description: "",
    photos: [],
  })

  revalidatePath("/galleries")
  revalidatePath("/")
  return NextResponse.json({ slug }, { status: 201 })
}
