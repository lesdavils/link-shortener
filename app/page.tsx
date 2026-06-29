'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const features = [
  {
    icon: '⚡',
    title: 'Instantané',
    desc: 'Vos liens raccourcis en moins d\'une seconde. Zéro friction, zéro délai.',
  },
  {
    icon: '📊',
    title: 'Analytics',
    desc: 'Suivez chaque clic avec précision — dates, referrers, user-agents.',
  },
  {
    icon: '🔓',
    title: 'Open Source',
    desc: 'Code entièrement ouvert. Auditez, forkez, déployez où vous voulez.',
  },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
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
    <div className="relative min-h-screen bg-[#030712] text-white overflow-hidden">

      {/* ── Aurora background ── */}
      <div className="fixed inset-0 pointer-events-none select-none">
        <div className="aurora-1 absolute -top-48 -left-48 w-[650px] h-[650px] rounded-full bg-indigo-600/20 blur-[110px]" />
        <div className="aurora-2 absolute -top-24 -right-48 w-[550px] h-[550px] rounded-full bg-violet-500/15 blur-[110px]" />
        <div className="aurora-3 absolute -bottom-64 left-1/2 -translate-x-1/2 w-[750px] h-[750px] rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="dot-grid absolute inset-0" />
        {/* Top edge glow line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      </div>

      {/* ── Navbar ── */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <span className="shimmer-text font-black text-xl tracking-tight">LinkShort</span>
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/lesdavils/link-shortener"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block"
          >
            GitHub
          </a>
          <Link
            href="/dashboard"
            className="text-sm glass-card px-4 py-2 rounded-full hover:border-indigo-500/40 transition-all"
          >
            Dashboard →
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main className="relative z-10 flex flex-col items-center text-center px-4 pt-16 pb-28">

        {/* Badge */}
        <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 glass-card px-4 py-1.5 rounded-full text-xs text-indigo-300 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Open Source · Gratuit · Sans compte requis
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.1)}
          className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight mb-6 max-w-3xl"
        >
          <span className="text-white">Raccourcissez,</span>
          <br />
          <span className="text-white/70">partagez,</span>
          <br />
          <span className="shimmer-text">analysez.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.2)}
          className="text-gray-400 text-lg max-w-sm mb-14 leading-relaxed"
        >
          Transformez vos URLs interminables en liens élégants et suivez leurs performances en temps réel.
        </motion.p>

        {/* Input card */}
        <motion.div {...fadeUp(0.3)} className="w-full max-w-xl">
          <div className="glass-card input-wrapper rounded-2xl p-2">
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && shorten()}
                placeholder="https://votre-lien-tres-long.com/article/..."
                className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none placeholder-gray-600 text-white"
              />
              <button
                onClick={shorten}
                disabled={loading || !url}
                className="btn-primary px-6 py-3 rounded-xl font-semibold text-sm text-white"
              >
                {loading ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : 'Raccourcir →'}
              </button>
            </div>

            <AnimatePresence>
              {showCustom && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 pt-2 border-t border-white/5 mt-2 px-2 pb-1">
                    <span className="text-xs text-gray-500 shrink-0">
                      {typeof window !== 'undefined' ? window.location.host : 'localhost:3000'}/
                    </span>
                    <input
                      type="text"
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                      onKeyDown={(e) => e.key === 'Enter' && shorten()}
                      placeholder="mon-lien"
                      maxLength={20}
                      className="flex-1 bg-transparent text-sm focus:outline-none placeholder-gray-600 text-indigo-300 font-mono"
                    />
                    <span className="text-xs text-gray-600">{customCode.length}/20</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => { setShowCustom(v => !v); setCustomCode('') }}
            className="mt-2 text-xs text-gray-600 hover:text-indigo-400 transition-colors flex items-center gap-1 mx-auto"
          >
            <span>{showCustom ? '✕ Annuler' : '✦ Personnaliser le lien court'}</span>
          </button>

          <AnimatePresence>
            {error && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-400 text-sm mt-3 text-center"
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
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                className="mt-3 glass-card rounded-xl px-5 py-4 flex items-center justify-between gap-4"
              >
                <div className="text-left min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Votre lien court</p>
                  <p className="font-mono text-indigo-300 font-medium truncate">{shortUrl}</p>
                </div>
                <button
                  onClick={copy}
                  className={`shrink-0 text-xs px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    copied
                      ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                      : 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/25'
                  }`}
                >
                  {copied ? '✓ Copié !' : 'Copier'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Social proof */}
        <motion.p {...fadeUp(0.45)} className="mt-8 text-xs text-gray-600">
          Liens raccourcis, clics suivis, données privées.
        </motion.p>
      </main>

      {/* ── Features ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 pb-32">
        {/* Section divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-xs text-gray-600 tracking-widest uppercase">Pourquoi LinkShort</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              {...fadeUp(0.5 + i * 0.1)}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="glass-card rounded-2xl p-6 cursor-default group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-xl mb-4 group-hover:bg-indigo-600/20 transition-colors">
                {f.icon}
              </div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 text-center pb-10 text-gray-700 text-xs">
        LinkShort · Open Source ·{' '}
        <a
          href="https://github.com/lesdavils/link-shortener"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition-colors"
        >
          GitHub
        </a>
      </footer>
    </div>
  )
}
