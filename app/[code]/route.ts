import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  const { data: link } = await supabase
    .from('links')
    .select('id, original_url')
    .eq('short_code', code)
    .single()

  if (!link) {
    return NextResponse.redirect(new URL('/?error=not_found', request.url))
  }

  await supabase.from('clicks').insert({
    link_id: link.id,
    user_agent: request.headers.get('user-agent'),
    referrer: request.headers.get('referer'),
  })

  return NextResponse.redirect(link.original_url)
}
