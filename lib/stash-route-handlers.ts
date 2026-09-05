import { createClient } from '@/lib/supabase/server';
import { isUuid, parseUpdateStashInput, type StashStatusName } from '@/lib/stash-validation';
import type { ErrorResponse, RouteContext, StashItem, StashMutationResponse } from '@/lib/types';

type StashRouteContext = RouteContext<{ userStash: string }>;
type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

function errorResponse(error: string, status: number): Response {
  const body: ErrorResponse = { error };
  return Response.json(body, { status });
}

function normalizeStashRow(row: Record<string, unknown>): StashItem {
  const productStatus = (row.product_status ?? null) as StashItem['product_status'];

  return {
    ...row,
    status: productStatus?.name ?? null,
    product_status: productStatus,
  } as StashItem;
}

async function resolveStatusId(
  supabase: SupabaseServerClient,
  status: StashStatusName | null,
): Promise<{ id: string | null; error: Response | null }> {
  if (!status) return { id: null, error: null };

  const { data, error } = await supabase
    .from('product_status')
    .select('id')
    .eq('name', status)
    .maybeSingle();

  if (error) return { id: null, error: errorResponse(error.message, 500) };
  if (!data) return { id: null, error: errorResponse('That stash status is not available.', 400) };

  return { id: data.id, error: null };
}

export async function handleStashPatch(
  request: Request,
  context: StashRouteContext,
): Promise<Response> {
  const { userStash: stashId } = await context.params;
  if (!isUuid(stashId)) return errorResponse('A valid stash item is required.', 400);

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return errorResponse('Authentication required', 401);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return errorResponse('Invalid request body.', 400);
  }

  const parsed = parseUpdateStashInput(payload);
  if (!parsed.ok) return errorResponse(parsed.error, 400);

  const update: Record<string, unknown> = {};
  if ('status' in parsed.value) {
    const statusResult = await resolveStatusId(supabase, parsed.value.status ?? null);
    if (statusResult.error) return statusResult.error;
    update.status_id = statusResult.id;
  }
  if ('rating' in parsed.value) update.rating = parsed.value.rating;
  if ('notes' in parsed.value) update.notes = parsed.value.notes;

  const { data, error } = await supabase
    .from('user_stash')
    .update(update)
    .eq('id', stashId)
    .eq('user_id', authData.user.id)
    .select('*, matcha_products(*), product_status(id, name, description)')
    .maybeSingle();

  if (error) return errorResponse(error.message, 500);
  if (!data) return errorResponse('That stash item could not be found.', 404);

  const body: StashMutationResponse = {
    stash: normalizeStashRow(data as Record<string, unknown>),
  };
  return Response.json(body);
}

export async function handleStashDelete(
  _request: Request,
  context: StashRouteContext,
): Promise<Response> {
  const { userStash: stashId } = await context.params;
  if (!isUuid(stashId)) return errorResponse('A valid stash item is required.', 400);

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return errorResponse('Authentication required', 401);

  const { data, error } = await supabase
    .from('user_stash')
    .delete()
    .eq('id', stashId)
    .eq('user_id', authData.user.id)
    .select('id')
    .maybeSingle();

  if (error) return errorResponse(error.message, 500);
  if (!data) return errorResponse('That stash item could not be found.', 404);

  return Response.json({ success: true });
}
