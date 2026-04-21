import type { ReactNode } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 bg-gray-50 text-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-10">{children}</div>
    </div>
  )
}
