"use client"

import { useEffect, useRef, useState } from "react"

type SaveStatus = "idle" | "saving" | "saved"

export function useSaveStatus() {
  const [status, setStatus] = useState<SaveStatus>("idle")
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    []
  )

  function begin() {
    setStatus("saving")
  }

  function finish() {
    setStatus("saved")
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setStatus("idle"), 2000)
  }

  function abort() {
    setStatus("idle")
  }

  return {
    saving: status === "saving",
    label: status === "saved" ? "Saved" : status === "saving" ? "Saving…" : "Save",
    begin,
    finish,
    abort,
  }
}
