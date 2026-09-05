import { UpdatePasswordForm } from '@/components/auth-forms';
import { getSafeRedirectPath } from '@/lib/auth-redirect';

interface UpdatePasswordPageProps {
  searchParams: Promise<{ redirect?: string | string[] }>;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function UpdatePasswordPage({ searchParams }: UpdatePasswordPageProps) {
  const params = await searchParams;
  return <UpdatePasswordForm redirectTo={getSafeRedirectPath(firstParam(params.redirect))} />;
}
