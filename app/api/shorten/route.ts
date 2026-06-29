import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { nanoid } from 'nanoid'

const MAX_LINKS = 500
const CUSTOM_CODE_REGEX = /^[a-zA-Z0-9_-]{2,20}$/

export async function POST(request: NextRequest) {
  const { url, customCode } = await request.json()

  if (!url) {
    return NextResponse.json({ error: 'URL invalide' }, { status: 400 })
  }

  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`

  let parsedUrl: URL
  try {
    parsedUrl = new URL(normalizedUrl)
  } catch {
    return NextResponse.json({ error: 'URL invalide' }, { status: 400 })
  }

  // Validate custom code format
  if (customCode !== undefined && customCode !== '') {
    if (!CUSTOM_CODE_REGEX.test(customCode)) {
      return NextResponse.json(
        { error: 'Lien court invalide (2-20 caractères, lettres, chiffres, - ou _)' },
        { status: 400 }
      )
    }

    const { data: existing } = await supabase
      .from('links')
      .select('id')
      .eq('short_code', customCode)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Ce lien court est déjà pris' }, { status: 409 })
    }
  }

  // Enforce global link limit
  const { count } = await supabase
    .from('links')
    .select('*', { count: 'exact', head: true })

  if ((count ?? 0) >= MAX_LINKS) {
    return NextResponse.json(
      { error: `Limite de ${MAX_LINKS} liens atteinte. Supprimez des liens depuis le dashboard.` },
      { status: 429 }
    )
  }

  const short_code = customCode || nanoid(6)

  const { data, error } = await supabase
    .from('links')
    .insert({ original_url: parsedUrl.toString(), short_code })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ short_code: data.short_code })
}
