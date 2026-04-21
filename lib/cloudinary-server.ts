import "server-only"
import crypto from "crypto"
import { CLOUD, transforms, photoUrl, type CloudTransform } from "./cloudinary"

function sign(toSign: string): string {
  return crypto
    .createHash("sha1")
    .update(toSign + process.env.CLOUDINARY_API_SECRET!)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .slice(0, 8)
}

/**
 * Deletes an asset from Cloudinary by its stored image value.
 * No-ops for legacy local paths (starts with '/').
 */
export async function deleteCloudinaryImage(image: string): Promise<void> {
  if (image.startsWith("/")) return
  const publicId = image.replace(/\.[^.]+$/, "") // strip extension
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const toSign = `public_id=${publicId}&timestamp=${timestamp}`
  // Destroy API uses SHA1 hex (not the truncated base64url used for delivery URLs)
  const signature = crypto
    .createHash("sha1")
    .update(toSign + process.env.CLOUDINARY_API_SECRET!)
    .digest("hex")
  await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/destroy`, {
    method: "POST",
    body: new URLSearchParams({
      public_id: publicId,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY!,
      signature,
    }),
  })
}

/**
 * Generates a signed Cloudinary delivery URL.
 * Must only be called server-side (API routes, server components).
 */
export function signedPhotoUrl(image: string, t: CloudTransform): string {
  if (image.startsWith("/")) {
    // Legacy local path — unsigned fetch, no signing needed
    return photoUrl(image, t)
  }
  const transform = transforms[t]
  const toSign = `${transform}/${image}`
  const sig = sign(toSign)
  return `https://res.cloudinary.com/${CLOUD}/image/upload/s--${sig}--/${transform}/${image}`
}
