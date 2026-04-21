import Link from "next/link"

export default function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 py-5 bg-black/60 backdrop-blur-sm">
      <Link href="/" className="text-sm tracking-[0.2em] uppercase font-medium">
        Kathryn Eccles Photography
      </Link>
      <nav className="flex items-center gap-6">
        <Link
          href="/galleries"
          className="text-xs tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors"
        >
          Galleries
        </Link>
        <Link
          href="/about"
          className="text-xs tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors"
        >
          About
        </Link>
      </nav>
    </header>
  )
}
