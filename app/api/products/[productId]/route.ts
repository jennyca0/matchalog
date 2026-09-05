import { supabase } from '@/lib/supabase';
import type { ErrorResponse, MatchaProduct, RouteContext } from '@/lib/types';

export async function GET(
  _request: Request,
  { params }: RouteContext<{ productId: string }>,
): Promise<Response> {
  const { productId } = await params;
  const { data, error } = await supabase
    .from('matcha_products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error) {
    const body: ErrorResponse = { error: error.message };
    return Response.json(body, { status: 500 });
  }

  return Response.json(data as MatchaProduct);
}
