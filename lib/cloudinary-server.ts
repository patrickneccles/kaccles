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
