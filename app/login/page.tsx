'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const submit = async () => {
    if (!password) return
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    setLoading(false)

    if (!res.ok) {
      setError('Mot de passe incorrect')
      return
    }

    const from = searchParams.get('from') ?? '/dashboard'
    router.push(from)
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#e8e8e8] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="text-xs text-[#444] tracking-[0.2em] uppercase mb-8">LinkShort</p>

        <h1 className="text-2xl font-semibold text-white mb-2">Accès dashboard</h1>
        <p className="text-sm text-[#444] mb-8">Entrez le mot de passe pour continuer.</p>

        <div className="flex border border-[#222] rounded-xl overflow-hidden bg-[#0f0f0f] focus-within:border-[#333] transition-colors">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Mot de passe"
            autoFocus
            className="flex-1 bg-transparent px-5 py-4 text-sm focus:outline-none placeholder-[#333] text-[#e8e8e8]"
          />
          <button
            onClick={submit}
            disabled={loading || !password}
            className="bg-white text-black px-6 py-4 text-sm font-semibold hover:bg-[#e8e8e8] disabled:opacity-20 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            {loading ? '...' : '→'}
          </button>
        </div>

        {error && (
          <p className="mt-3 text-xs text-red-500/80">{error}</p>
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
