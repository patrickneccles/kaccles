import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-white/20 text-xs tracking-[0.3em] uppercase mb-4">404</p>
        <p className="text-white/50 text-sm mb-8">This page doesn&apos;t exist.</p>
        <Link
          href="/"
          className="text-white/40 hover:text-white text-xs tracking-[0.2em] uppercase transition-colors"
        >
          ← Home
        </Link>
      </div>
    </main>
  )
}
