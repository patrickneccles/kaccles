"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { GalleryEntry } from "../../lib/gallery-store"
import { useConfirm } from "./useConfirm"

export default function AdminPage() {
  const [galleries, setGalleries] = useState<GalleryEntry[]>([])
  const { dialog, confirm } = useConfirm()

  useEffect(() => {
    fetch("/api/admin/galleries")
      .then((r) => r.json())
      .then(setGalleries)
  }, [])

  async function handleDelete(slug: string, title: string) {
    if (!(await confirm(`Delete "${title}"? This cannot be undone.`))) return
    await fetch(`/api/admin/galleries/${slug}`, { method: "DELETE" })
    setGalleries((prev) => prev.filter((g) => g.slug !== slug))
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium">Galleries</h1>
        <Link
          href="/admin/galleries/new"
          className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          + New gallery
        </Link>
      </div>

      {dialog}
      {galleries.length === 0 ? (
        <p className="text-gray-400 text-sm">No galleries yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {galleries.map(({ slug, gallery }) => (
            <li
              key={slug}
              className="relative flex items-center py-4 gap-4 -mx-6 px-6 hover:bg-gray-100 transition-colors"
            >
              <Link href={`/admin/galleries/${slug}`} className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">{gallery.title}</p>
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
    </main>
  )
}
