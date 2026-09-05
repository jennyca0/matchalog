import test from 'node:test';
import assert from 'node:assert/strict';

async function loadRouteGuard() {
  const authModule = await import('../lib/auth/protected-routes.ts').catch(() => ({}));
  assert.equal(typeof authModule.isProtectedRoute, 'function');
  return authModule.isProtectedRoute;
}

async function loadClaimsGuard() {
  const authModule = await import('../lib/auth/protected-routes.ts').catch(() => ({}));
  assert.equal(typeof authModule.hasAuthenticatedClaims, 'function');
  return authModule.hasAuthenticatedClaims;
}

test('protects the canonical stash route and legacy stash URLs', async () => {
  const isProtectedRoute = await loadRouteGuard();

  assert.equal(isProtectedRoute('/stash'), true);
  assert.equal(isProtectedRoute('/stash/ac68c744-bf4b-4403-8d82-80e2172a7a93'), true);
  assert.equal(isProtectedRoute('/products/matcha-1'), false);
});

test('treats missing Supabase claims data as unauthenticated', async () => {
  const hasAuthenticatedClaims = await loadClaimsGuard();

  assert.equal(hasAuthenticatedClaims(null), false);
  assert.equal(hasAuthenticatedClaims({ claims: { sub: 'user-1' } }), true);
});
