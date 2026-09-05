import { NextResponse, type NextRequest } from 'next/server';
import { getSafeRedirectPath } from '@/lib/auth-redirect';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest): Promise<Response> {
  const code = request.nextUrl.searchParams.get('code');
  const next = getSafeRedirectPath(request.nextUrl.searchParams.get('next'));

  if (!code) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'invalid-callback');
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'invalid-callback');
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL(next, request.url));
}
