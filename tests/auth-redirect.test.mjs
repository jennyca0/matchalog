import test from 'node:test';
import assert from 'node:assert/strict';

async function loadRedirectHelper() {
  const authModule = await import('../lib/auth-redirect.ts').catch(() => ({}));
  assert.equal(typeof authModule.getSafeRedirectPath, 'function');
  return authModule.getSafeRedirectPath;
}

test('preserves a safe internal redirect path', async () => {
  const getSafeRedirectPath = await loadRedirectHelper();

  assert.equal(getSafeRedirectPath('/products/matcha-1?from=login'), '/products/matcha-1?from=login');
});

test('falls back home for external redirect targets', async () => {
  const getSafeRedirectPath = await loadRedirectHelper();

  assert.equal(getSafeRedirectPath('https://example.com/account'), '/');
  assert.equal(getSafeRedirectPath('//example.com/account'), '/');
  assert.equal(getSafeRedirectPath('\\\\example.com\\account'), '/');
});
