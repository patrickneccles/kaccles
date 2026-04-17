import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const formData = await request.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  const ext = path.extname(file.name).toLowerCase() || ".jpg"
  const filename = `${crypto.randomUUID()}${ext}`
  const dir = path.join(process.cwd(), "public", "images", "galleries", slug)
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()))

  return NextResponse.json({ path: `/images/galleries/${slug}/${filename}` }, { status: 201 })
}
