"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import PhotoEditor from "./PhotoEditor"
import type { Gallery } from "../../../../lib/gallery-store"
import { useConfirm } from "../../useConfirm"

const EMPTY: Gallery = {
  title: "",
  location: "",
  subject: "",
  shootDate: "",
  description: "",
  photos: [],
}

export default function EditGalleryPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const [gallery, setGallery] = useState<Gallery>(EMPTY)
  const [savedGallery, setSavedGallery] = useState<Gallery | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const { dialog, confirm } = useConfirm()
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isDirty = savedGallery !== null && JSON.stringify(gallery) !== JSON.stringify(savedGallery)

  useEffect(() => {
    fetch(`/api/admin/galleries/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setGallery(data)
        setSavedGallery(data)
      })
  }, [slug])

  useEffect(
    () => () => {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
    },
    []
  )

  async function handleSave() {
    setSaving(true)
    const res = await fetch(`/api/admin/galleries/${slug}`, {
      method: "PUT",
      body: JSON.stringify(gallery),
      headers: { "Content-Type": "application/json" },
    })
    setSaving(false)
    if (!res.ok) return
    setSavedGallery(gallery)
    setSaved(true)
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
    savedTimerRef.current = setTimeout(() => setSaved(false), 2000)
  }

  async function handleDelete() {
    if (!(await confirm(`Delete "${gallery.title}"? This cannot be undone.`))) return
    await fetch(`/api/admin/galleries/${slug}`, { method: "DELETE" })
    router.push("/admin")
  }

  async function handleBack() {
    if (isDirty && !(await confirm("You have unsaved changes. Leave anyway?"))) return
    router.push("/admin")
  }

  function field(key: keyof Gallery) {
    return {
      value: gallery[key] as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setGallery((prev) => ({ ...prev, [key]: e.target.value })),
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      {dialog}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            ← Galleries
          </button>
          {isDirty && <span className="text-xs text-amber-600 font-medium">Unsaved changes</span>}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40 transition-colors min-w-[64px]"
        >
          {saved ? "Saved" : saving ? "Saving…" : "Save"}
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <Field label="Title">
          <input type="text" {...field("title")} className={inputClass} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field label="Subject">
            <input
              type="text"
              placeholder="e.g. Great Gray Owl"
              {...field("subject")}
              className={inputClass}
            />
          </Field>
          <Field label="Location">
            <input
              type="text"
              placeholder="e.g. Yellowstone"
              {...field("location")}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Shoot date">
          <input type="date" {...field("shootDate")} className={inputClass} />
        </Field>
        <Field label="Description" optional>
          <textarea rows={3} {...field("description")} className={`${inputClass} resize-none`} />
        </Field>

        <div>
          <p className="text-sm font-medium mb-4">
            Photos <span className="text-gray-400 font-normal">({gallery.photos.length})</span>
          </p>
          <PhotoEditor
            slug={slug}
            photos={gallery.photos}
            onChange={(photos) => setGallery((prev) => ({ ...prev, photos }))}
          />
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-gray-200">
        <button
          onClick={handleDelete}
          className="text-sm text-red-400 hover:text-red-600 transition-colors"
        >
          Delete gallery
        </button>
      </div>
    </main>
  )
}

const inputClass =
  "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-gray-400"

function Field({
  label,
  optional,
  children,
}: {
  label: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">
        {label}
        {optional && <span className="text-gray-400 font-normal ml-1">(optional)</span>}
      </label>
      {children}
    </div>
  )
}
