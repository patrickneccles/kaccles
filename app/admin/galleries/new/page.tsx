"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NewGalleryPage() {
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  async function handleSubmit() {
    if (!title.trim()) return
    setSaving(true)
    setError("")

    const res = await fetch("/api/admin/galleries", {
      method: "POST",
      body: JSON.stringify({ title: title.trim() }),
      headers: { "Content-Type": "application/json" },
    })

    if (res.ok) {
      const { slug } = await res.json()
      router.push(`/admin/galleries/${slug}`)
    } else {
      const { error: msg } = await res.json()
      setError(msg)
      setSaving(false)
    }
  }

  return (
    <main className="max-w-xl mx-auto px-6 py-10">
      <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
        ← Galleries
      </Link>
      <h1 className="text-2xl font-medium mt-6 mb-8">New gallery</h1>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Title</label>
        <input
          type="text"
          placeholder="e.g. Birds of 2025"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          autoFocus
          className="px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-gray-500"
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>

      <button
        onClick={handleSubmit}
        disabled={saving || !title.trim()}
        className="mt-6 px-4 py-2.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40 transition-colors"
      >
        {saving ? "Creating…" : "Create gallery"}
      </button>
    </main>
  )
}
