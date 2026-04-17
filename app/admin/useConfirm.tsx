"use client"

import { useState } from "react"

type State = { message: string; resolve: (confirmed: boolean) => void }

export function useConfirm() {
  const [state, setState] = useState<State | null>(null)

  function confirm(message: string): Promise<boolean> {
    return new Promise((resolve) => setState({ message, resolve }))
  }

  function handleConfirm() {
    state?.resolve(true)
    setState(null)
  }

  function handleCancel() {
    state?.resolve(false)
    setState(null)
  }

  const dialog = state ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 w-80 flex flex-col gap-5">
        <p className="text-sm text-gray-800">{state.message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  ) : null

  return { dialog, confirm }
}
