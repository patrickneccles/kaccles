import Footer from "@/components/Footer"
import Header from "@/components/Header"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kathryn Eccles Photography",
  description: "Wildlife photography by Kathryn Eccles.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <body className="bg-black text-white min-h-screen flex flex-col">
        <Header />
        <main className="flex flex-col flex-1 min-h-0 pt-[3.75rem]">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
