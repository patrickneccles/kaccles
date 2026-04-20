import { NextRequest, NextResponse } from "next/server"
import { signedPhotoUrl } from "../../../../../../lib/cloudinary-server"

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

  const body = new FormData()
  body.append("file", file)
  body.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)
  body.append("folder", `galleries/${slug}`)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return NextResponse.json({ error: "Cloudinary upload failed", detail: err }, { status: 502 })
  }

  const { public_id, format } = await res.json()
  const path = `${public_id}.${format}`
  return NextResponse.json({ path, thumbUrl: signedPhotoUrl(path, "thumb") }, { status: 201 })
}
