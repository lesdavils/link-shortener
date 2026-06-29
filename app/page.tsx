'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const features = [
  { n: '01', title: 'Instantané', desc: 'Vos liens raccourcis en moins d\'une seconde, sans friction.' },
  { n: '02', title: 'Analytics', desc: 'Chaque clic tracé — dates, referrers, user-agents.' },
  { n: '03', title: 'Open Source', desc: 'Code ouvert. Auditez, forkez, déployez où vous voulez.' },
]

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, delay },
})

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

      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-5xl mx-auto w-full">
        <span className="text-sm font-semibold tracking-wide text-white">LinkShort</span>
        <div className="flex items-center gap-8 text-sm text-[#666]">
          <a
            href="https://github.com/lesdavils/link-shortener"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#e8e8e8] transition-colors"
          >
            GitHub
          </a>
          <Link href="/dashboard" className="hover:text-[#e8e8e8] transition-colors">
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="h-px bg-[#1a1a1a] max-w-5xl mx-auto w-full" />

      {/* ── Hero ── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-8 pt-20 pb-16">

        <motion.p
          {...fadeIn(0)}
          className="text-xs text-[#444] tracking-[0.2em] uppercase mb-10"
        >
          URL Shortener
        </motion.p>

        <motion.h1
          {...fadeIn(0.1)}
          className="text-[clamp(3rem,8vw,6.5rem)] leading-[1] tracking-tight mb-2 font-extralight text-[#e8e8e8]"
        >
          Raccourcissez
        </motion.h1>
        <motion.h1
          {...fadeIn(0.2)}
          className="text-[clamp(3rem,8vw,6.5rem)] leading-[1] tracking-tight mb-10 font-bold text-white"
        >
          n&apos;importe quel lien.
        </motion.h1>

        <motion.p
          {...fadeIn(0.3)}
          className="text-[#555] text-base max-w-xs leading-relaxed mb-12"
        >
          Transformez vos longues URLs en liens courts et suivez chaque clic en temps réel.
        </motion.p>

        {/* ── Input ── */}
        <motion.div {...fadeIn(0.4)} className="max-w-lg">
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

          {/* Error */}
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

          {/* Result */}
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

      {/* ── Features ── */}
      <div className="h-px bg-[#1a1a1a] max-w-5xl mx-auto w-full" />

      <section className="max-w-5xl mx-auto w-full px-8 py-12">
        {features.map((f) => (
          <div
            key={f.n}
            className="flex items-baseline gap-8 py-5 border-b border-[#141414] last:border-0"
          >
            <span className="font-mono text-[11px] text-[#2e2e2e] w-6 shrink-0">{f.n}</span>
            <span className="text-sm text-[#888] w-28 shrink-0">{f.title}</span>
            <span className="text-sm text-[#444]">{f.desc}</span>
          </div>
        ))}
      </section>

      {/* ── Footer ── */}
      <div className="h-px bg-[#1a1a1a] max-w-5xl mx-auto w-full" />
      <footer className="max-w-5xl mx-auto w-full px-8 py-5 flex items-center justify-between text-xs text-[#333]">
        <span>LinkShort</span>
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
