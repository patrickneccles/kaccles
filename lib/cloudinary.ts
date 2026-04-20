export const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!

// © Kathryn Eccles watermark — bottom-right, gallery transform only.
const WM =
  "l_text:Arial_24_bold:%C2%A9%20Kathryn%20Eccles%20Photography,co_white,o_30,g_south_east,x_20,y_20"

// Named presets — never construct transform strings inline.
export const transforms = {
  thumb: "w_800,c_fill,q_auto,f_auto",
  gallery: `w_2000,c_limit,q_auto,f_auto,${WM}`,
} as const

export type CloudTransform = keyof typeof transforms

/** Delivery URL for an asset already stored in Cloudinary (by public_id). */
export function cloudUrl(publicId: string, t: CloudTransform): string {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${transforms[t]}/${publicId}`
}

/** Delivery URL using Cloudinary fetch — transforms any publicly accessible URL. */
export function fetchUrl(absoluteUrl: string, t: CloudTransform): string {
  return `https://res.cloudinary.com/${CLOUD}/image/fetch/${transforms[t]}/${absoluteUrl}`
}

/**
 * Resolves a photo's stored value to a Cloudinary delivery URL.
 * New uploads store a Cloudinary public_id (no leading slash).
 * Legacy photos store a local path (starts with '/') and are served via fetch mode.
 */
export function photoUrl(image: string, t: CloudTransform): string {
  if (image.startsWith("/")) {
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? ""
    return fetchUrl(`${site}${image}`, t)
  }
  return cloudUrl(image, t)
}
