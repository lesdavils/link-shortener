'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [url, setUrl] = useState('')
  const [shortCode, setShortCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const shorten = async () => {
    setError('')
    setShortCode('')
    setLoading(true)

    const res = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error)
      return
    }

    setShortCode(data.short_code)
  }

  const shortUrl = shortCode ? `${window.location.origin}/${shortCode}` : ''

  const copy = () => {
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <h1 className="text-4xl font-bold text-center mb-2 text-indigo-400">LinkShort</h1>
        <p className="text-center text-gray-400 mb-8">Raccourcissez vos URLs en un clic</p>

        <div className="bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-800">
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && shorten()}
              placeholder="https://exemple.com/votre-lien-tres-long"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-500"
            />
            <button
              onClick={shorten}
              disabled={loading || !url}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 rounded-lg font-medium text-sm transition-colors"
            >
              {loading ? '...' : 'Raccourcir'}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-red-400 text-sm">{error}</p>
          )}

          {shortCode && (
            <div className="mt-4 flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-3">
              <span className="flex-1 text-indigo-300 text-sm font-mono">{shortUrl}</span>
              <button
                onClick={copy}
                className="text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-md transition-colors"
              >
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/dashboard" className="text-gray-500 hover:text-indigo-400 text-sm transition-colors">
            Voir le dashboard →
          </Link>
        </div>
      </div>
    </main>
  )
}
