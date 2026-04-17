import { NextRequest, NextResponse } from "next/server"
import { readGallery, writeGallery, deleteGallery } from "../../../../../lib/gallery-store"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const gallery = await readGallery(slug)
  if (!gallery) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(gallery)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const body = await request.json()
  await writeGallery(slug, body)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  await deleteGallery(slug)
  return NextResponse.json({ ok: true })
}
