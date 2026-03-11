import { supabase } from "@/lib/supabase"

// fetch products from the database and return them as json
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const page = Number(searchParams.get('page') ?? 0)
  const pageSize = Number(searchParams.get('pageSize') ?? 12)

  const offset = page * pageSize

  let query = supabase
    .from('matcha_products')
    // request count so the client can paginate
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1)

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data, error, count } = await query

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return Response.json({ products: data ?? [], count: count ?? 0 })
}

