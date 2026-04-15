import Link from "next/link";
import KeystaticApp from "./keystatic";

// Fixed full-viewport overlay so Keystatic's own UI isn't obscured
// by the site header (z-40) or footer from the root layout.
export default function Layout() {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-white">
      <KeystaticApp />
      <Link
        href="/"
        className="fixed bottom-4 right-4 z-10 text-xs text-gray-500 hover:text-gray-900 bg-white border border-gray-200 rounded-md px-3 py-1.5 shadow-sm transition-colors"
      >
        ← Back to site
      </Link>
    </div>
  );
}
