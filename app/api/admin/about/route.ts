import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { readAbout, writeAbout } from "../../../../lib/about-store"

export async function GET() {
  const about = await readAbout()
  return NextResponse.json(about)
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  await writeAbout({ bio: body.bio ?? "" })
  revalidatePath("/about")
  return NextResponse.json({ ok: true })
}
