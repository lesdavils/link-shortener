import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  const { data: link } = await supabase
    .from('links')
    .select('original_url')
    .eq('short_code', code)
    .single()

  if (!link) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.redirect(link.original_url)
}
