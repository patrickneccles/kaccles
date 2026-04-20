"use client"

import { useRef } from "react"
import { useConfirm } from "../../useConfirm"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Photo } from "../../../../lib/gallery-store"

export type DisplayPhoto = Photo & { thumbUrl: string }

type Props = {
  slug: string
  photos: DisplayPhoto[]
  onChange: (photos: DisplayPhoto[]) => void
}

type ItemProps = {
  photo: DisplayPhoto
  onCaptionChange: (caption: string) => void
  onRemove: () => void
}

function SortablePhoto({ photo, onCaptionChange, onRemove }: ItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: photo.image,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      className="relative flex flex-col"
    >
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
        <img src={photo.thumbUrl} alt="" className="w-full h-full object-cover" />
      </div>
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 p-1.5 rounded bg-black/50 text-white cursor-grab active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <rect x="1" y="1" width="2" height="2" />
          <rect x="5" y="1" width="2" height="2" />
          <rect x="9" y="1" width="2" height="2" />
          <rect x="1" y="5" width="2" height="2" />
          <rect x="5" y="5" width="2" height="2" />
          <rect x="9" y="5" width="2" height="2" />
          <rect x="1" y="9" width="2" height="2" />
          <rect x="5" y="9" width="2" height="2" />
          <rect x="9" y="9" width="2" height="2" />
        </svg>
      </button>
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 p-1.5 rounded bg-black/50 text-white hover:bg-red-500/80 transition-colors"
        aria-label="Remove photo"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <path
            d="M1 1l8 8M9 1l-8 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <textarea
        value={photo.caption}
        onChange={(e) => onCaptionChange(e.target.value)}
        placeholder="Caption"
        rows={2}
        className="mt-2 px-2.5 py-2 text-xs border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-gray-400 bg-white"
      />
    </div>
  )
}

export default function PhotoEditor({ slug, photos, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { dialog, confirm } = useConfirm()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = photos.findIndex((p) => p.image === active.id)
    const newIndex = photos.findIndex((p) => p.image === over.id)
    onChange(arrayMove(photos, oldIndex, newIndex))
  }

  async function handleFiles(files: FileList) {
    const uploads = await Promise.all(
      Array.from(files).map(async (file) => {
        const body = new FormData()
        body.append("file", file)
        const res = await fetch(`/api/admin/galleries/${slug}/photos`, { method: "POST", body })
        if (!res.ok) return null
        const { path, thumbUrl } = await res.json()
        return { image: path, caption: "", thumbUrl } as DisplayPhoto
      })
    )
    const newPhotos = uploads.filter((p): p is DisplayPhoto => p !== null)
    if (newPhotos.length > 0) onChange([...photos, ...newPhotos])
  }

  return (
    <div>
      {dialog}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={photos.map((p) => p.image)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo, i) => (
              <SortablePhoto
                key={photo.image}
                photo={photo}
                onCaptionChange={(caption) => {
                  const next = [...photos]
                  next[i] = { ...next[i], caption }
                  onChange(next)
                }}
                onRemove={async () => {
                  if (await confirm("Remove this photo?"))
                    onChange(photos.filter((_, j) => j !== i))
                }}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="mt-6 w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
      >
        + Add photos
      </button>
    </div>
  )
}
