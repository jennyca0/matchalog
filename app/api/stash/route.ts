import { createClient } from '@/lib/supabase/server';
import type { ErrorResponse, StashItem, StashResponse } from '@/lib/types';

export async function GET(): Promise<Response> {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    const body: ErrorResponse = { error: 'Authentication required' };
    return Response.json(body, { status: 401 });
  }

  const { data, error } = await supabase
    .from('user_stash')
    .select('*, matcha_products(*)')
    .eq('user_id', authData.user.id);

  if (error) {
    const body: ErrorResponse = { error: error.message };
    return Response.json(body, { status: 500 });
  }

  const body: StashResponse = { stash: (data ?? []) as StashItem[] };
  return Response.json(body);
}
