"use client"

import { useState } from "react"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)

  async function handleSubmit() {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password }),
      headers: { "Content-Type": "application/json" },
    })
    if (res.ok) {
      window.location.href = "/admin"
    } else {
      setError(true)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-57px)]">
      <div className="w-80 flex flex-col gap-3">
        <h1 className="text-xl font-medium mb-2">Sign in</h1>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-gray-500"
        />
        {error && <p className="text-red-500 text-xs">Incorrect password</p>}
        <button
          onClick={handleSubmit}
          className="px-3 py-2.5 text-sm rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-700 transition-colors"
        >
          Sign in
        </button>
      </div>
    </div>
  )
}
