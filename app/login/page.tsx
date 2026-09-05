import { LoginForm } from '@/components/auth-forms';
import { getSafeRedirectPath } from '@/lib/auth-redirect';

interface LoginPageProps {
  searchParams: Promise<{
    redirect?: string | string[];
    error?: string | string[];
  }>;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const error = firstParam(params.error);

  return (
    <LoginForm
      redirectTo={getSafeRedirectPath(firstParam(params.redirect))}
      initialError={error ? 'The authentication link is invalid or has expired.' : null}
    />
  );
}
