'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
  const [url, setUrl] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const [shortCode, setShortCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const shorten = async () => {
    if (!url) return
    setError('')
    setShortCode('')
    setLoading(true)

    const res = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, customCode: customCode.trim() || undefined }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error)
      return
    }

    setShortCode(data.short_code)
    setCustomCode('')
    setShowCustom(false)
  }

  const shortUrl = shortCode
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/${shortCode}`
    : ''

  const copy = () => {
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#e8e8e8] flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-5xl mx-auto w-full">
        <img src="/logo.png" alt="LinkShort" className="h-16" />
        <a
          href="https://github.com/lesdavils/link-shortener"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#444] hover:text-[#888] transition-colors"
        >
          GitHub
        </a>
      </nav>

      <div className="h-px bg-[#1a1a1a] max-w-5xl mx-auto w-full" />

      {/* Hero */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-8 pt-20 pb-16 flex flex-col justify-center">

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-xs text-[#444] tracking-[0.2em] uppercase mb-10"
        >
          URL Shortener
        </motion.p>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[clamp(3rem,8vw,6.5rem)] leading-[1] tracking-tight mb-2 font-extralight text-[#e8e8e8]"
        >
          Raccourcissez
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-[clamp(3rem,8vw,6.5rem)] leading-[1] tracking-tight mb-12 font-bold text-white"
        >
          n&apos;importe quel lien.
        </motion.h1>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="max-w-lg"
        >
          <div className="flex border border-[#222] rounded-xl overflow-hidden bg-[#0f0f0f] focus-within:border-[#333] transition-colors duration-200">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && shorten()}
              placeholder="https://votre-url.com/tres-longue/..."
              className="flex-1 bg-transparent px-5 py-4 text-sm focus:outline-none placeholder-[#333] text-[#e8e8e8]"
            />
            <button
              onClick={shorten}
              disabled={loading || !url}
              className="bg-white text-black px-6 py-4 text-sm font-semibold hover:bg-[#e8e8e8] disabled:opacity-20 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              {loading ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : '→'}
            </button>
          </div>

          {/* Custom slug */}
          <AnimatePresence>
            {showCustom && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 mt-2 border border-[#1e1e1e] rounded-xl px-5 py-3 bg-[#0f0f0f]">
                  <span className="text-xs text-[#444] shrink-0 font-mono">
                    {typeof window !== 'undefined' ? window.location.host : 'localhost:3000'}/
                  </span>
                  <input
                    type="text"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && shorten()}
                    placeholder="mon-lien"
                    maxLength={20}
                    autoFocus
                    className="flex-1 bg-transparent text-sm focus:outline-none placeholder-[#333] text-[#e8e8e8] font-mono"
                  />
                  <span className="text-xs text-[#333] font-mono">{customCode.length}/20</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => { setShowCustom(v => !v); setCustomCode('') }}
            className="mt-3 text-xs text-[#444] hover:text-[#888] transition-colors"
          >
            {showCustom ? '− Annuler' : '+ Personnaliser le lien'}
          </button>

          <AnimatePresence>
            {error && (
              <motion.p
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-red-500/80 text-xs mt-3"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {shortCode && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-3 border border-[#1e1e1e] rounded-xl px-5 py-4 flex items-center justify-between gap-4 bg-[#0f0f0f]"
              >
                <div className="min-w-0">
                  <p className="text-[10px] text-[#444] mb-1 uppercase tracking-widest">Lien raccourci</p>
                  <p className="font-mono text-sm text-white truncate">{shortUrl}</p>
                </div>
                <button
                  onClick={copy}
                  className={`shrink-0 text-xs px-4 py-2 rounded-lg border transition-colors duration-200 ${
                    copied
                      ? 'border-white/20 text-white bg-white/5'
                      : 'border-[#2a2a2a] text-[#666] hover:border-[#333] hover:text-[#999]'
                  }`}
                >
                  {copied ? '✓ Copié' : 'Copier'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      <div className="h-px bg-[#1a1a1a] max-w-5xl mx-auto w-full" />
      <footer className="max-w-5xl mx-auto w-full px-8 py-5 flex items-center justify-between text-xs text-[#333]">
        <img src="/logo.png" alt="LinkShort" className="h-5 opacity-40" />
        <a
          href="https://github.com/lesdavils/link-shortener"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#666] transition-colors"
        >
          GitHub →
        </a>
      </footer>
    </div>
  )
}
