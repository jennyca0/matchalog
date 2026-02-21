import { supabase } from "@/lib/supabase"
// fetch products from the database and return them as json
export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    let searchQuery = supabase
    .from('matcha_products')
    .select()
    .order('created_at', { ascending: false })

    if (search) {
        searchQuery = searchQuery.ilike('name', `%${search}%`)
        }

    const { data, error } = await searchQuery

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
    return Response.json({products: data})
}

