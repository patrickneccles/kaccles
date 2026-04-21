"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import PhotoEditor, { type DisplayPhoto } from "./PhotoEditor"
import type { Gallery } from "../../../../lib/gallery-store"
import { useConfirm } from "../../useConfirm"
import { useSaveStatus } from "../../useSaveStatus"

type DisplayGallery = Omit<Gallery, "photos"> & { photos: DisplayPhoto[] }

const EMPTY: DisplayGallery = {
  title: "",
  location: "",
  subject: "",
  shootDate: "",
  description: "",
  photos: [],
  published: true,
}

export default function EditGalleryPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const [gallery, setGallery] = useState<DisplayGallery>(EMPTY)
  const [savedGallery, setSavedGallery] = useState<DisplayGallery | null>(null)
  const { dialog, confirm } = useConfirm()
  const { saving, label, begin, finish, abort } = useSaveStatus()

  const isDirty = savedGallery !== null && JSON.stringify(gallery) !== JSON.stringify(savedGallery)

  useEffect(() => {
    const controller = new AbortController()
    fetch(`/api/admin/galleries/${slug}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        setGallery(data)
        setSavedGallery(data)
      })
      .catch(() => {})
    return () => controller.abort()
  }, [slug])

  async function handleSave() {
    begin()
    const res = await fetch(`/api/admin/galleries/${slug}`, {
      method: "PUT",
      body: JSON.stringify(gallery),
      headers: { "Content-Type": "application/json" },
    })
    if (!res.ok) {
      abort()
      return
    }
    setSavedGallery(gallery)
    finish()
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

  function field(key: keyof DisplayGallery) {
    return {
      value: gallery[key] as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setGallery((prev) => ({ ...prev, [key]: e.target.value })),
    }
  }

  return (
    <>
      {dialog}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            ← Back
          </button>
          {isDirty && <span className="text-xs text-amber-600 font-medium">Unsaved changes</span>}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setGallery((prev) => ({ ...prev, published: !prev.published }))}
            className={`px-3 py-2 text-xs rounded-lg border font-medium transition-colors ${
              gallery.published
                ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            {gallery.published ? "Published" : "Draft"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40 transition-colors min-w-[64px]"
          >
            {label}
          </button>
        </div>
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
    </>
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
