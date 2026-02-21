import { supabase } from "@/lib/supabase";

export async function GET(request, { params }) {
    const { productId } = await params;
    const { data, error } = await supabase
        .from("matcha_products")
        .select("*")
        .eq("id", productId)
        .single();

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}