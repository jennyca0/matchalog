'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getSafeRedirectPath } from '@/lib/auth-redirect';
import { createClient } from '@/lib/supabase/client';

interface AuthFormProps {
  redirectTo: string;
}

interface LoginFormProps extends AuthFormProps {
  initialError?: string | null;
}

function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <Link href="/" className="auth-logo">MatchaLog</Link>
        <h1 id="auth-title">{title}</h1>
        <p className="auth-description">{description}</p>
        {children}
      </section>
    </main>
  );
}

function AuthError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="auth-error" role="alert">
      {message}
    </p>
  );
}

export function LoginForm({ redirectTo, initialError = null }: LoginFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(initialError);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const safeRedirect = getSafeRedirectPath(redirectTo);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsSubmitting(false);
      return;
    }

    router.replace(safeRedirect);
    router.refresh();
  }

  return (
    <AuthCard title="Welcome back" description="Sign in to manage your matcha stash and reviews.">
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthError message={error} />
        <div className="auth-field">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="auth-field">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <Button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
        <Link href={`/forgot-password?redirect=${encodeURIComponent(safeRedirect)}`} className="auth-text-link">
          Forgot your password?
        </Link>
      </form>
      <p className="auth-footer">
        Don&apos;t have an account?{' '}
        <Link href={`/signup?redirect=${encodeURIComponent(safeRedirect)}`}>Create one</Link>
      </p>
    </AuthCard>
  );
}

export function SignupForm({ redirectTo }: AuthFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const safeRedirect = getSafeRedirectPath(redirectTo);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const callbackUrl = new URL('/auth/callback', window.location.origin);
    callbackUrl.searchParams.set('next', safeRedirect);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: callbackUrl.toString() },
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsSubmitting(false);
      return;
    }

    if (data.session) {
      router.replace(safeRedirect);
      router.refresh();
      return;
    }

    setMessage('Check your email to confirm your account, then sign in.');
    setIsSubmitting(false);
  }

  return (
    <AuthCard title="Create your account" description="Start keeping track of the matcha you discover and love.">
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthError message={error} />
        {message && <p className="auth-success" role="status">{message}</p>}
        <div className="auth-field">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="auth-field">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            name="password"
            autoComplete="new-password"
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <div className="auth-field">
          <Label htmlFor="signup-confirm-password">Confirm password</Label>
          <Input
            id="signup-confirm-password"
            type="password"
            name="confirm-password"
            autoComplete="new-password"
            minLength={6}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </div>
        <Button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
      <p className="auth-footer">
        Already have an account?{' '}
        <Link href={`/login?redirect=${encodeURIComponent(safeRedirect)}`}>Sign in</Link>
      </p>
    </AuthCard>
  );
}

export function ForgotPasswordForm({ redirectTo }: AuthFormProps) {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    const updatePasswordUrl = new URL('/update-password', window.location.origin);
    updatePasswordUrl.searchParams.set('redirect', getSafeRedirectPath(redirectTo));
    const callbackUrl = new URL('/auth/callback', window.location.origin);
    callbackUrl.searchParams.set('next', `${updatePasswordUrl.pathname}${updatePasswordUrl.search}`);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: callbackUrl.toString(),
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage('If an account exists for that email, you will receive reset instructions shortly.');
    }
    setIsSubmitting(false);
  }

  return (
    <AuthCard title="Reset your password" description="We’ll email you a secure link to choose a new password.">
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthError message={error} />
        {message && <p className="auth-success" role="status">{message}</p>}
        <div className="auth-field">
          <Label htmlFor="reset-email">Email</Label>
          <Input
            id="reset-email"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <Button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>
      <p className="auth-footer"><Link href="/login">Back to sign in</Link></p>
    </AuthCard>
  );
}

export function UpdatePasswordForm({ redirectTo }: AuthFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const safeRedirect = getSafeRedirectPath(redirectTo);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setIsSubmitting(false);
      return;
    }

    setIsUpdated(true);
    setIsSubmitting(false);
  }

  if (isUpdated) {
    return (
      <AuthCard title="Password updated" description="Your new password is ready to use.">
        <Button className="auth-submit" type="button" onClick={() => router.replace(safeRedirect)}>
          Continue
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Choose a new password" description="Use a password you do not reuse on other sites.">
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthError message={error} />
        <div className="auth-field">
          <Label htmlFor="update-password">New password</Label>
          <Input
            id="update-password"
            type="password"
            name="password"
            autoComplete="new-password"
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <div className="auth-field">
          <Label htmlFor="update-confirm-password">Confirm new password</Label>
          <Input
            id="update-confirm-password"
            type="password"
            name="confirm-password"
            autoComplete="new-password"
            minLength={6}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </div>
        <Button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </AuthCard>
  );
}
