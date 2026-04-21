"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSaveStatus } from "../useSaveStatus"

export default function AdminAboutPage() {
  const [bio, setBio] = useState("")
  const [savedBio, setSavedBio] = useState("")
  const { saving, label, begin, finish, abort } = useSaveStatus()

  const isDirty = bio !== savedBio

  useEffect(() => {
    const controller = new AbortController()
    fetch("/api/admin/about", { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        setBio(data.bio ?? "")
        setSavedBio(data.bio ?? "")
      })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  async function handleSave() {
    begin()
    const res = await fetch("/api/admin/about", {
      method: "PUT",
      body: JSON.stringify({ bio }),
      headers: { "Content-Type": "application/json" },
    })
    if (!res.ok) {
      abort()
      return
    }
    setSavedBio(bio)
    finish()
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            ← Back
          </Link>
          {isDirty && <span className="text-xs text-amber-600 font-medium">Unsaved changes</span>}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40 transition-colors min-w-[64px]"
        >
          {label}
        </button>
      </div>

      <h1 className="text-2xl font-medium mb-6">About</h1>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Bio</label>
        <p className="text-xs text-gray-400 mb-1">Separate paragraphs with a blank line.</p>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={10}
          className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-gray-400 resize-y"
        />
      </div>
    </>
  )
}
