"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    const res = await fetch("/api/keystatic-login", {
      method: "POST",
      body: JSON.stringify({ password }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      router.push("/keystatic");
    } else {
      setError(true);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-80 flex flex-col gap-3">
        <h1 className="text-xl font-medium mb-2">Admin login</h1>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="px-3 py-2.5 text-sm rounded-lg border border-white/20 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40"
        />
        {error && (
          <p className="text-red-400 text-xs">Incorrect password</p>
        )}
        <button
          onClick={handleSubmit}
          className="px-3 py-2.5 text-sm rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
