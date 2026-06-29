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

  useEffect(() => {
    const fetchLinks = async () => {
      const { data } = await supabase
        .from('links')
        .select('id, original_url, short_code, created_at, clicks(count)')
        .order('created_at', { ascending: false })

      setLinks((data as LinkRow[]) ?? [])
      setLoading(false)
    }

    fetchLinks()
  }, [])

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-indigo-400">Dashboard</h1>
          <Link href="/" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
            ← Raccourcir un lien
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center py-20">Chargement...</p>
        ) : links.length === 0 ? (
          <p className="text-gray-500 text-center py-20">Aucun lien pour l&apos;instant.</p>
        ) : (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="text-left px-5 py-4 font-medium">Lien court</th>
                  <th className="text-left px-5 py-4 font-medium">URL originale</th>
                  <th className="text-left px-5 py-4 font-medium">Clics</th>
                  <th className="text-left px-5 py-4 font-medium">Créé le</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr key={link.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <a
                        href={`${origin}/${link.short_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 font-mono"
                      >
                        /{link.short_code}
                      </a>
                    </td>
                    <td className="px-5 py-4 text-gray-300 max-w-xs truncate">
                      <a href={link.original_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        {link.original_url}
                      </a>
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-indigo-900/50 text-indigo-300 px-2.5 py-1 rounded-full text-xs font-medium">
                        {link.clicks[0]?.count ?? 0}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {new Date(link.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
