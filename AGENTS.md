<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

***

# Kathy Eccles Photography

Wildlife photography portfolio. Easy upload experience for a non-technical user; professional exhibition quality for visitors.

**Principles:** High quality + low maintenance on every decision. Photography is the hero — minimal chrome. Originals never publicly accessible (Cloudinary transforms only, always watermarked). CMS fields stay obvious and minimal.

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router) | Read `node_modules/next/dist/docs/` before writing code |
| CMS | Keystatic | `/keystatic` — password-protected via `middleware.ts` |
| CMS Storage | `local` (dev) → `github` (prod) | Switch before deploying |
| Images | Cloudinary | Transforms in `lib/cloudinary.ts`; never inline. Watermark on every transform. |
| Hosting | Vercel | Deploy on push to `main` |
| Styles | Tailwind CSS v4 | |

## Content Model

One collection: `galleries` (a shoot or outing). Fields: `title` (slug), `coverImage`, `location`, `subject`, `shootDate`, `description` (optional), `photos[]` (`image` + `caption`). No prose/markdoc — this is not a blog.

## Routes

* `/` — homepage
* `/galleries` — grid of all galleries
* `/galleries/[slug]` — photo grid + lightbox
* `/keystatic/[[...params]]` — CMS admin

## Env Vars

* `ADMIN_PASSWORD` — protects `/keystatic`
* `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — used to build delivery URLs

## Deployment Checklist

1. Switch `keystatic.config.ts` to `kind: 'github'`
2. Set env vars in Vercel
3. Configure Cloudinary upload preset with restricted direct access
