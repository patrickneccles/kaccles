'use client';

// Global Next.js image loader (configured in next.config.ts).
// In production, routes every <Image> through Cloudinary fetch for transforms + watermark.
// In local dev (no NEXT_PUBLIC_SITE_URL), serves images directly — Cloudinary can't reach localhost.

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const SITE  = process.env.NEXT_PUBLIC_SITE_URL ?? null;

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!SITE) return src;

  const absolute = src.startsWith('http') ? src : `${SITE}${src}`;
  const wm = 'l_text:Arial_24_bold:%C2%A9%20Kathy%20Eccles,co_white,o_70,g_south_east,x_20,y_20';
  const t = `w_${width},q_${quality ?? 'auto'},f_auto,c_limit,${wm}`;
  return `https://res.cloudinary.com/${CLOUD}/image/fetch/${t}/${absolute}`;
}
