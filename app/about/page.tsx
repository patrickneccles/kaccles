import type { Metadata } from "next"
import { readAbout } from "../../lib/about-store"

export const metadata: Metadata = {
  title: "About | Kathryn Eccles Photography",
  description: "About Kathryn Eccles and her wildlife photography.",
}

export default async function AboutPage() {
  const { bio } = await readAbout()
  const paragraphs = bio.split(/\n\n+/).filter(Boolean)

  return (
    <div className="max-w-xl m-auto py-16 px-8">
      <h1 className="text-2xl font-medium tracking-wide mb-8">About</h1>
      <div className="space-y-5 text-white/70 leading-relaxed">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div className="mt-12 pt-8 border-t border-white/10 text-sm text-white/50">
        <p>
          Questions about equipment, techniques, or inquiries about original full-res images?{" "}
          <a
            href="mailto:keccles56@yahoo.com"
            className="text-white/80 hover:text-white transition-colors underline underline-offset-4"
          >
            keccles56@yahoo.com
          </a>
        </p>
      </div>
    </div>
  )
}
