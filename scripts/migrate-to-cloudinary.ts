/**
 * One-time migration: uploads all local gallery images to Cloudinary and
 * rewrites YAML files to store the Cloudinary public_id instead of a local path.
 *
 * Run with: npx tsx scripts/migrate-to-cloudinary.ts
 */

import fs from "fs/promises"
import path from "path"
import { parse, stringify } from "yaml"

const CONTENT_DIR = path.join(process.cwd(), "content", "galleries")
const PUBLIC_DIR = path.join(process.cwd(), "public")

async function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local")
  const content = await fs.readFile(envPath, "utf8")
  for (const line of content.split("\n")) {
    const [key, ...rest] = line.split("=")
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim()
  }
}

async function uploadToCloudinary(
  filePath: string,
  folder: string,
  cloud: string,
  preset: string
): Promise<string> {
  const fileBuffer = await fs.readFile(filePath)
  const blob = new Blob([fileBuffer])

  const body = new FormData()
  body.append("file", blob, path.basename(filePath))
  body.append("upload_preset", preset)
  body.append("folder", folder)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body,
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Cloudinary error: ${JSON.stringify(err)}`)
  }

  const { public_id, format } = (await res.json()) as { public_id: string; format: string }
  return `${public_id}.${format}`
}

async function main() {
  await loadEnv()

  const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
  const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

  const yamlFiles = (await fs.readdir(CONTENT_DIR)).filter((f) => f.endsWith(".yaml"))

  for (const file of yamlFiles) {
    const slug = file.slice(0, -5)
    const yamlPath = path.join(CONTENT_DIR, file)
    const raw = await fs.readFile(yamlPath, "utf8")
    const data = parse(raw)

    if (!Array.isArray(data.photos)) continue

    let changed = false
    for (const photo of data.photos) {
      if (typeof photo.image !== "string" || !photo.image.startsWith("/")) continue

      const localPath = path.join(PUBLIC_DIR, photo.image)
      const folder = `galleries/${slug}`

      process.stdout.write(`  Uploading ${photo.image} … `)
      try {
        const publicId = await uploadToCloudinary(localPath, folder, CLOUD, PRESET)
        photo.image = publicId
        changed = true
        console.log(`✓ ${publicId}`)
      } catch (err) {
        console.log(`✗ failed: ${err}`)
      }
    }

    if (changed) {
      await fs.writeFile(yamlPath, stringify(data))
      console.log(`  Saved ${file}`)
    }
  }

  console.log("\nDone.")
}

main()
