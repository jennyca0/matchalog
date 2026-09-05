import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { hasAuthenticatedClaims, isProtectedRoute } from '@/lib/auth/protected-routes';
import { getSupabaseConfig } from '@/lib/supabase/config';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const { url, key } = getSupabaseConfig();

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data: claimsData } = await supabase.auth.getClaims();

  if (!hasAuthenticatedClaims(claimsData) && isProtectedRoute(request.nextUrl.pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = '';
    loginUrl.searchParams.set(
      'redirect',
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}
