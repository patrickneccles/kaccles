<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

---

# Kathy Eccles Photography

Wildlife photography portfolio. Easy upload experience for a non-technical user; professional exhibition quality for visitors.

**Principles:** High quality + low maintenance on every decision. Photography is the hero — minimal chrome. Originals never publicly accessible (Cloudinary transforms only, always watermarked). CMS fields stay obvious and minimal.

## Stack

| Layer       | Choice                                      | Notes                                                                              |
| ----------- | ------------------------------------------- | ---------------------------------------------------------------------------------- |
| Framework   | Next.js 16 (App Router)                     | Read `node_modules/next/dist/docs/` before writing code                            |
| CMS         | Bespoke admin                               | `/admin` — password-protected via `proxy.ts`                                       |
| CMS Storage | Filesystem                                  | YAML in `content/galleries/`, images in `public/images/galleries/`                 |
| Images      | Cloudinary                                  | Transforms in `lib/cloudinary.ts`; never inline. Watermark on every transform.     |
| Hosting     | Self-hosted Mac via pm2 + Cloudflare Tunnel | No Vercel, no port forwarding — `cloudflared` creates an encrypted outbound tunnel |
| Styles      | Tailwind CSS v4                             |                                                                                    |

## Content Model

One collection: `galleries` (a shoot or outing). Fields: `title`, `location`, `subject`, `shootDate`, `description` (optional), `photos[]` (`image` + `caption`). No prose/markdoc — this is not a blog.

## Routes

- `/` — homepage
- `/galleries` — grid of all galleries
- `/galleries/[slug]` — photo grid + lightbox
- `/admin` — CMS gallery list
- `/admin/galleries/new` — create gallery
- `/admin/galleries/[slug]` — edit gallery (fields + photo array with thumbnails + drag-to-reorder)
- `/admin/login` — password gate

## Key Files

- `lib/gallery-store.ts` — all YAML read/write + slug generation; single source of truth for gallery data
- `lib/reader.ts` — thin shim used by public pages (`{ slug, entry }` shape)
- `proxy.ts` — intercepts `/admin(.*)`, checks `admin-auth` cookie against `ADMIN_PASSWORD`
- `app/admin/useConfirm.tsx` — reusable async confirm dialog hook used across all admin pages

## Env Vars

- `ADMIN_PASSWORD` — protects `/admin`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — used to build delivery URLs

## Deployment Checklist

1. Set env vars in `.env.local`: `ADMIN_PASSWORD`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_SITE_URL`
2. `npm run build && pm2 start "npm start" --name kaccles && pm2 save`
3. `cloudflared tunnel route dns kaccles <domain>` — point domain to tunnel
4. Configure Cloudinary upload preset with restricted direct access

## Self-Hosting Architecture

- **pm2** keeps `next start` alive across reboots (`pm2 startup` generates the launchd/systemd hook)
- **Cloudflare Tunnel** (`cloudflared`) creates an outbound-only encrypted connection — no public IP, no port forwarding
- **CMS** is bespoke — content files live in `content/galleries/*.yaml`, images in `public/images/galleries/`
- **Auth** for `/admin` is handled by `proxy.ts` — `admin-auth` cookie checked against `ADMIN_PASSWORD` env var
