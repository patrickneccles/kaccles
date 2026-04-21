"use client"

import Link from "next/link"

export function AdminHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <Link href="/admin" className="font-medium text-sm hover:opacity-70 transition-opacity">
        Kathryn Eccles Photography
      </Link>
      <div className="flex items-center gap-5">
        <Link
          href="/admin/about"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          About
        </Link>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          ← View site
        </Link>
      </div>
    </header>
  )
}
