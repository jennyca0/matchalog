import { supabase } from '@/lib/supabase';
import type { ErrorResponse, ReviewsResponse, RouteContext, Review } from '@/lib/types';

export async function GET(
  _request: Request,
  { params }: RouteContext<{ productId: string }>,
): Promise<Response> {
  const { productId } = await params;
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId);

  if (error) {
    const body: ErrorResponse = { error: error.message };
    return Response.json(body, { status: 500 });
  }

  const body: ReviewsResponse = { reviews: (data ?? []) as Review[] };
  return Response.json(body);
}
