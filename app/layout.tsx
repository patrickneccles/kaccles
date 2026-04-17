import type { Metadata } from "next"
import { Geist } from "next/font/google"
import Link from "next/link"
import "./globals.css"

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kathy Eccles Photography",
  description: "Wildlife photography by Kathy Eccles.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <body className="bg-black text-white min-h-screen flex flex-col">
        <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 py-5 bg-black/60 backdrop-blur-sm">
          <Link href="/" className="text-sm tracking-[0.2em] uppercase font-medium">
            Kathy Eccles Photography
          </Link>
          <nav>
            <Link
              href="/galleries"
              className="text-xs tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors"
            >
              Galleries
            </Link>
          </nav>
        </header>
        <div className="flex-1 min-h-0">{children}</div>
        <footer className="flex items-center justify-between px-6 py-5 text-white/30 text-xs">
          <span>© {new Date().getFullYear()} Kathy Eccles. All rights reserved.</span>
          <Link href="/admin" className="hover:text-white/60 transition-colors">
            Admin
          </Link>
        </footer>
      </body>
    </html>
  )
}
