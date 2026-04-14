'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const router = useRouter()

  async function handleSubmit() {
    const res = await fetch('/api/keystatic-login', {
      method: 'POST',
      body: JSON.stringify({ password }),
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.ok) {
      router.push('/keystatic')
    } else {
      setError(true)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, margin: '0 0 8px' }}>Admin login</h1>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={{ padding: '10px 12px', fontSize: 15, borderRadius: 8, border: '1px solid #ddd' }}
        />
        {error && (
          <p style={{ color: 'red', fontSize: 13, margin: 0 }}>Incorrect password</p>
        )}
        <button
          onClick={handleSubmit}
          style={{ padding: '10px 12px', fontSize: 15, borderRadius: 8, cursor: 'pointer' }}
        >
          Sign in
        </button>
      </div>
    </div>
  )
}