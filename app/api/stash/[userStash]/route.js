import { supabase } from "@/lib/supabase";

export async function GET(request, { params }) {
    const { userStash } = await params;

    const { data, error } = await supabase
    .from('user_stash')
    .select('*, matcha_products(*)')
    .eq('user_id', userStash)

    if (error) {
        console.log(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
    return Response.json({ stash: data })
}