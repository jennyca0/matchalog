import { ForgotPasswordForm } from '@/components/auth-forms';
import { getSafeRedirectPath } from '@/lib/auth-redirect';

interface ForgotPasswordPageProps {
  searchParams: Promise<{ redirect?: string | string[] }>;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const params = await searchParams;
  return <ForgotPasswordForm redirectTo={getSafeRedirectPath(firstParam(params.redirect))} />;
}
