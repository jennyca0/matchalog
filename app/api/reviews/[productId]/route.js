import { supabase } from "@/lib/supabase"

// fetch reviews from the database and return them as json
export async function GET(request, { params }) {
    const { productId } = await params;

    const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
    return Response.json({reviews: data})
}
