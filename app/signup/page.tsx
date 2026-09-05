import { SignupForm } from '@/components/auth-forms';
import { getSafeRedirectPath } from '@/lib/auth-redirect';

interface SignupPageProps {
  searchParams: Promise<{ redirect?: string | string[] }>;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  return <SignupForm redirectTo={getSafeRedirectPath(firstParam(params.redirect))} />;
}
