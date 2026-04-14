const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

// © Kathy Eccles watermark — white, 70% opacity, bottom-right. Applied to every transform.
const WM = 'l_text:Arial_24_bold:%C2%A9%20Kathy%20Eccles,co_white,o_70,g_south_east,x_20,y_20';

// Named presets — never construct transform strings inline.
export const transforms = {
  thumb:   `w_800,c_fill,q_auto,f_auto,${WM}`,
  gallery: `w_2000,c_limit,q_auto,f_auto,${WM}`,
} as const;

export type CloudTransform = keyof typeof transforms;

/** Delivery URL for an asset already stored in Cloudinary (by public_id). */
export function cloudUrl(publicId: string, t: CloudTransform): string {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${transforms[t]}/${publicId}`;
}

/** Delivery URL using Cloudinary fetch — transforms any publicly accessible URL. */
export function fetchUrl(absoluteUrl: string, t: CloudTransform): string {
  return `https://res.cloudinary.com/${CLOUD}/image/fetch/${transforms[t]}/${absoluteUrl}`;
}
