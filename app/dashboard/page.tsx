'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type LinkRow = {
  id: string
  original_url: string
  short_code: string
  created_at: string
  clicks: { count: number }[]
}

export default function Dashboard() {
  const [links, setLinks] = useState<LinkRow[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchLinks = async () => {
      const { data } = await supabase
        .from('links')
        .select('id, original_url, short_code, created_at, clicks(count)')
        .order('created_at', { ascending: false })

      const rows = (data as LinkRow[]) ?? []
      setLinks(rows)
      setTotal(rows.reduce((sum, l) => sum + Number(l.clicks[0]?.count ?? 0), 0))
      setLoading(false)
    }

    fetchLinks()
  }, [])

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#e8e8e8] flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-5xl mx-auto w-full">
        <Link href="/" className="text-sm font-semibold tracking-wide text-white">
          LinkShort
        </Link>
        <span className="text-xs text-[#444] tracking-widest uppercase">Dashboard</span>
      </nav>

      <div className="h-px bg-[#1a1a1a] max-w-5xl mx-auto w-full" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-8 py-12">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
          {[
            { label: 'Liens créés', value: links.length },
            { label: 'Clics totaux', value: total },
            { label: 'Capacité', value: `${links.length} / 500` },
          ].map((s) => (
            <div key={s.label} className="border border-[#1a1a1a] rounded-xl px-5 py-4">
              <p className="text-[10px] text-[#444] uppercase tracking-widest mb-2">{s.label}</p>
              <p className="text-2xl font-semibold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-[#333] text-sm py-20 text-center">Chargement...</p>
        ) : links.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-[#333] text-sm mb-4">Aucun lien pour l&apos;instant.</p>
            <Link href="/" className="text-xs text-[#666] hover:text-white transition-colors">
              Raccourcir un premier lien →
            </Link>
          </div>
        ) : (
          <div className="border border-[#1a1a1a] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a1a1a]">
                  <th className="text-left px-5 py-3 text-[10px] text-[#444] font-normal uppercase tracking-widest">Lien court</th>
                  <th className="text-left px-5 py-3 text-[10px] text-[#444] font-normal uppercase tracking-widest">URL originale</th>
                  <th className="text-left px-5 py-3 text-[10px] text-[#444] font-normal uppercase tracking-widest">Clics</th>
                  <th className="text-left px-5 py-3 text-[10px] text-[#444] font-normal uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr
                    key={link.id}
                    className="border-b border-[#141414] last:border-0 hover:bg-[#0f0f0f] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <a
                        href={`${origin}/${link.short_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-white hover:text-[#888] transition-colors text-xs"
                      >
                        /{link.short_code}
                      </a>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <a
                        href={link.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#555] hover:text-[#888] transition-colors truncate block text-xs"
                      >
                        {link.original_url}
                      </a>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-white">
                        {Number(link.clicks[0]?.count ?? 0)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#444] text-xs font-mono">
                      {new Date(link.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <div className="h-px bg-[#1a1a1a] max-w-5xl mx-auto w-full" />
      <footer className="max-w-5xl mx-auto w-full px-8 py-5 flex items-center justify-between text-xs text-[#333]">
        <Link href="/" className="hover:text-[#666] transition-colors">← Accueil</Link>
        <span>{links.length} liens</span>
      </footer>
    </div>
  )
}
