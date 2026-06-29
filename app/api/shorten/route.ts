import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  const { url } = await request.json()

  if (!url || !url.startsWith('http')) {
    return NextResponse.json({ error: 'URL invalide' }, { status: 400 })
  }

  const short_code = nanoid(6)

  const { data, error } = await supabase
    .from('links')
    .insert({ original_url: url, short_code })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ short_code: data.short_code })
}
