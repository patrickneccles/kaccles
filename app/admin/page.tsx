"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { GalleryEntry } from "../../lib/gallery-store"
import { useConfirm } from "./useConfirm"

export default function AdminPage() {
  const [galleries, setGalleries] = useState<GalleryEntry[]>([])
  const { dialog, confirm } = useConfirm()

  useEffect(() => {
    const controller = new AbortController()
    fetch("/api/admin/galleries", { signal: controller.signal })
      .then((r) => r.json())
      .then(setGalleries)
      .catch(() => {})
    return () => controller.abort()
  }, [])

  async function handleDelete(slug: string, title: string) {
    if (!(await confirm(`Delete "${title}"? This cannot be undone.`))) return
    await fetch(`/api/admin/galleries/${slug}`, { method: "DELETE" })
    setGalleries((prev) => prev.filter((g) => g.slug !== slug))
  }

  return (
    <>
      {dialog}
      <h1 className="text-2xl font-bold my-12">Admin</h1>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400">
            Galleries
          </h2>
          <Link
            href="/admin/galleries/new"
            className="px-3 py-1.5 text-xs bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            + New
          </Link>
        </div>
        {galleries.length === 0 ? (
          <p className="text-gray-400 text-sm py-4">No galleries yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200 border-t border-gray-200">
            {galleries.map(({ slug, gallery }) => (
              <li
                key={slug}
                className="flex items-center gap-4 -mx-6 px-6 hover:bg-gray-100 transition-colors"
              >
                <Link href={`/admin/galleries/${slug}`} className="min-w-0 flex-1 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{gallery.title}</span>
                    {!gallery.published && (
                      <span className="shrink-0 text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {gallery.shootDate || "No date"} · {gallery.photos.length} photo
                    {gallery.photos.length !== 1 ? "s" : ""}
                  </p>
                </Link>
                <button
                  onClick={() => handleDelete(slug, gallery.title)}
                  className="shrink-0 text-sm text-red-400 hover:text-red-600 transition-colors"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">
          Pages
        </h2>
        <ul className="divide-y divide-gray-200 border-t border-gray-200">
          <li className="-mx-6 hover:bg-gray-100 transition-colors">
            <Link href="/admin/about" className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium text-sm">About</p>
                <p className="text-gray-400 text-xs mt-0.5">/about</p>
              </div>
              <span className="shrink-0 text-sm text-gray-400">Edit →</span>
            </Link>
          </li>
        </ul>
      </section>
    </>
  )
}
