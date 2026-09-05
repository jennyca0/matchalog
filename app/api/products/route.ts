import { supabase } from '@/lib/supabase';
import type { MatchaProduct, ProductsResponse, ErrorResponse } from '@/lib/types';

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page') ?? 0);
  const pageSize = Number(searchParams.get('pageSize') ?? 12);
  const offset = page * pageSize;

  let query = supabase
    .from('matcha_products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    const body: ErrorResponse = { error: error.message };
    return Response.json(body, { status: 500 });
  }

  const body: ProductsResponse = {
    products: (data ?? []) as MatchaProduct[],
    count: count ?? 0,
  };
  return Response.json(body);
}
