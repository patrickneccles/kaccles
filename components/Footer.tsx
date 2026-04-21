import Link from "next/link"

export default function Footer() {
  return (
    <footer className="flex items-center justify-between px-6 py-5 text-white/30 text-xs">
      <span>© {new Date().getFullYear()} Kathryn Eccles. All rights reserved.</span>
      <Link href="/admin" className="hover:text-white/60 transition-colors">
        Admin
      </Link>
    </footer>
  )
}
