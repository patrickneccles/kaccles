import type { ReactNode } from "react"
import { AdminHeader } from "./AdminHeader"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminHeader />
      {children}
    </div>
  )
}
