'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export function AuthNav() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (isMounted) setUser(data.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSignOut() {
    setError(null);
    setIsSigningOut(true);
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      setIsSigningOut(false);
      return;
    }

    setIsSigningOut(false);
    router.refresh();
  }

  if (!user) {
    return <Link href="/login" className="auth-link">Log in</Link>;
  }

  return (
    <div className="auth-nav">
      <span className="auth-user" title={user.email ?? undefined}>{user.email}</span>
      <button className="auth-logout" type="button" onClick={handleSignOut} disabled={isSigningOut}>
        {isSigningOut ? 'Signing out…' : 'Log out'}
      </button>
      {error && <span className="auth-nav-error" role="alert">{error}</span>}
    </div>
  );
}
