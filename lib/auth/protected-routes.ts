export function isProtectedRoute(pathname: string): boolean {
  return pathname === '/stash' || pathname.startsWith('/stash/');
}

export function hasAuthenticatedClaims(
  claimsData: { claims?: unknown } | null,
): boolean {
  return Boolean(claimsData?.claims);
}
