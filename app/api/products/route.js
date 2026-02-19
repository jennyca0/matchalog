import { supabase } from "@/lib/supabase"
// fetch products from the database and return them as json
export async function GET(request) {
    const { data, error } = await supabase
    .from('matcha_products')
    .select()
    .order('created_at', { ascending: false })

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
    return Response.json({products: data})
}

