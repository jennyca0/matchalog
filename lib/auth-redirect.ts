export function getSafeRedirectPath(value: string | null | undefined): string {
  if (!value) return '/';

  let decodedValue = value;
  try {
    decodedValue = decodeURIComponent(value);
  } catch {
    return '/';
  }

  if (
    !decodedValue.startsWith('/') ||
    decodedValue.startsWith('//') ||
    decodedValue.includes('\\')
  ) {
    return '/';
  }

  return value;
}
