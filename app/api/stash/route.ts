import { createClient } from '@/lib/supabase/server';
import { parseCreateStashInput } from '@/lib/stash-validation';
import type { ErrorResponse, StashItem, StashMutationResponse, StashResponse } from '@/lib/types';

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

export async function GET(): Promise<Response> {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return errorResponse('Authentication required', 401);
  }

  const { data, error } = await supabase
    .from('user_stash')
    .select('*, matcha_products(*), product_status(id, name, description)')
    .eq('user_id', authData.user.id);

  if (error) {
    return errorResponse(error.message, 500);
  }

  const body: StashResponse = {
    stash: (data ?? []).map((row) => normalizeStashRow(row as Record<string, unknown>)),
  };
  return Response.json(body);
}

export async function POST(request: Request): Promise<Response> {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return errorResponse('Authentication required', 401);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return errorResponse('Invalid request body.', 400);
  }

  const parsed = parseCreateStashInput(payload);
  if (!parsed.ok) {
    return errorResponse(parsed.error, 400);
  }

  const { data: product, error: productError } = await supabase
    .from('matcha_products')
    .select('id')
    .eq('id', parsed.value.product_id)
    .maybeSingle();

  if (productError) {
    return errorResponse(productError.message, 500);
  }

  if (!product) {
    return errorResponse('That matcha product could not be found.', 404);
  }

  const { data: existingStashItem, error: existingError } = await supabase
    .from('user_stash')
    .select('id')
    .eq('user_id', authData.user.id)
    .eq('product_id', parsed.value.product_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) {
    return errorResponse(existingError.message, 500);
  }

  if (existingStashItem) {
    return Response.json(
      { error: 'This matcha is already in your stash.', stash_id: existingStashItem.id },
      { status: 409 },
    );
  }

  let statusId: string | null = null;
  if (parsed.value.status) {
    const { data: status, error: statusError } = await supabase
      .from('product_status')
      .select('id')
      .eq('name', parsed.value.status)
      .maybeSingle();

    if (statusError) {
      return errorResponse(statusError.message, 500);
    }

    if (!status) {
      return errorResponse('That stash status is not available.', 400);
    }

    statusId = status.id;
  }

  const { data, error } = await supabase
    .from('user_stash')
    .insert({
      product_id: parsed.value.product_id,
      user_id: authData.user.id,
      status_id: statusId,
      rating: parsed.value.rating,
      notes: parsed.value.notes,
    })
    .select('*, matcha_products(*), product_status(id, name, description)')
    .single();

  if (error) {
    if (error.code === '23505') {
      return errorResponse('This matcha is already in your stash.', 409);
    }
    return errorResponse(error.message, 500);
  }

  const body: StashMutationResponse = {
    stash: normalizeStashRow(data as Record<string, unknown>),
  };
  return Response.json(body, { status: 201 });
}
