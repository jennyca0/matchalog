import { supabase } from '@/lib/supabase';
import type { ErrorResponse, RouteContext, StashItem, StashResponse } from '@/lib/types';

export async function GET(
  _request: Request,
  { params }: RouteContext<{ userStash: string }>,
): Promise<Response> {
  const { userStash } = await params;
  const { data, error } = await supabase
    .from('user_stash')
    .select('*, matcha_products(*)')
    .eq('user_id', userStash);

  if (error) {
    const body: ErrorResponse = { error: error.message };
    return Response.json(body, { status: 500 });
  }

  const body: StashResponse = { stash: (data ?? []) as StashItem[] };
  return Response.json(body);
}
