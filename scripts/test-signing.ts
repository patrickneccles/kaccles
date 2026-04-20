/**
 * Tests our URL signing against Cloudinary with progressively complex transforms.
 * Run with: npx tsx scripts/test-signing.ts
 */

import crypto from "crypto"
import fs from "fs/promises"
import path from "path"

async function main() {
  const env = await fs.readFile(path.join(process.cwd(), ".env.local"), "utf8")
  for (const line of env.split("\n")) {
    const [key, ...rest] = line.split("=")
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim()
  }

  const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
  const SECRET = process.env.CLOUDINARY_API_SECRET!

  console.log(`Cloud: ${CLOUD}`)
  console.log(`Secret: ${SECRET.slice(0, 4)}...${SECRET.slice(-4)} (${SECRET.length} chars)`)

  function sign(toSign: string): string {
    return crypto
      .createHash("sha1")
      .update(toSign + SECRET)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .slice(0, 8)
  }

  function buildUrl(transform: string, image: string): string {
    const toSign = [transform, image].filter(Boolean).join("/")
    const sig = sign(toSign)
    const base = `https://res.cloudinary.com/${CLOUD}/image/upload`
    return transform ? `${base}/s--${sig}--/${transform}/${image}` : `${base}/s--${sig}--/${image}`
  }

  const IMAGE = "galleries/highlights/anqyvq1zz0b1o6vykzdg.jpg"
  const WM =
    "l_text:Arial_24_bold:%C2%A9%20Kathryn%20Eccles%20Photography,co_white,o_30,g_south_east,x_20,y_20"

  const tests = [
    { label: "1. No transform", transform: "" },
    { label: "2. Simple resize", transform: "w_200" },
    { label: "3. Resize + format", transform: "w_200,q_auto,f_auto" },
    { label: "4. Full with WM", transform: `w_800,c_fill,q_auto,f_auto,${WM}` },
  ]

  for (const { label, transform } of tests) {
    const url = buildUrl(transform, IMAGE)
    const res = await fetch(url)
    const type = res.headers.get("content-type") ?? "?"
    console.log(`${label}: ${res.status} ${res.statusText} (${type})`)
    if (res.status !== 200) console.log(`  URL: ${url}`)
  }
}

main()
