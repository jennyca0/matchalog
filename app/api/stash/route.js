import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const TEMP_USER_ID = '7116c015-aca4-4666-b1dd-32d4015dece8'

async function getUserId(supabase) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      console.error('Auth error:', error)
      return null
    }
    return user?.id ?? null
  } catch (error) {
    console.error('Unable to resolve user:', error)
    return null
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const userId = (await getUserId(supabase)) ?? TEMP_USER_ID

    const { data, error } = await supabase
      .from('user_stash')
      .select('*, matcha_products(*), product_status(*)') // Also get status info
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase GET error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Map status_id data to status for frontend compatibility
    const stashWithStatus = (data ?? []).map(item => ({
      ...item,
      status: item.product_status?.name?.toLowerCase() || 'unopened'
    }))

    return NextResponse.json({ stash: stashWithStatus })
  } catch (error) {
    console.error('GET /api/stash error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { product_id, status } = body

    if (!product_id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const userId = (await getUserId(supabase)) ?? TEMP_USER_ID

    // Look up the status_id for "unopened"
    const statusName = status || 'unopened'
    const { data: statusData, error: statusError } = await supabase
      .from('product_status')
      .select('id')
      .ilike('name', statusName)
      .single()

    if (statusError || !statusData) {
      console.error('Status lookup error:', statusError)
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Insert with status_id
    const { data, error } = await supabase
      .from('user_stash')
      .insert({
        user_id: userId,
        product_id: product_id,
        status_id: statusData.id
      })
      .select()  // ← Simplified: just return the inserted row
      .single()

    if (error) {
      console.error('Supabase POST error:', error)
      return NextResponse.json({ error: 'Failed to add to stash' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('POST /api/stash error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}