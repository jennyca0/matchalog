import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function getUserId(supabase) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      console.error('Auth error:', error);
      return null;
    }
    return user.id;
  } catch (error) {
    console.error('Unable to resolve user:', error);
    return null;
  }
}

// PATCH - Update status
export async function PATCH(request, { params }) {
  try {
    const { stashId } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const userId = await getUserId(supabase);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Look up the status_id
    const { data: statusData, error: statusError } = await supabase
      .from('product_status')
      .select('id')
      .ilike('name', status)
      .single();

    if (statusError || !statusData) {
      console.error('Status lookup error:', statusError);
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update the stash item
    const { data, error } = await supabase
      .from('user_stash')
      .update({ status_id: statusData.id })
      .eq('id', stashId)
      .eq('user_id', userId)  // Use real user ID
      .select()
      .single();

    if (error) {
      console.error('Supabase PATCH error:', error);
      return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('PATCH /api/stash/[stashId] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove from stash
export async function DELETE(request, { params }) {
  try {
    const { stashId } = await params;

    const supabase = await createClient();
    const userId = await getUserId(supabase);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('user_stash')
      .delete()
      .eq('id', stashId)
      .eq('user_id', userId);  // Use real user ID

    if (error) {
      console.error('Supabase DELETE error:', error);
      return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/stash/[stashId] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}