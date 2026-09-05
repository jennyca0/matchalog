import test from 'node:test';
import assert from 'node:assert/strict';

async function loadStashValidation() {
  const validationModule = await import('../lib/stash-validation.ts').catch(() => ({}));
  assert.equal(typeof validationModule.parseCreateStashInput, 'function');
  assert.equal(typeof validationModule.parseUpdateStashInput, 'function');
  return validationModule;
}

const productId = 'ac68c744-bf4b-4403-8d82-80e2172a7a93';

test('normalizes a valid create payload without accepting a user id', async () => {
  const { parseCreateStashInput } = await loadStashValidation();

  assert.deepEqual(
    parseCreateStashInput({
      product_id: productId,
      status: 'opened',
      rating: 4,
      notes: '  Silky and bright.  ',
      user_id: 'attacker-controlled-id',
    }),
    {
      ok: true,
      value: {
        product_id: productId,
        status: 'opened',
        rating: 4,
        notes: 'Silky and bright.',
      },
    },
  );
});

test('rejects invalid product ids, ratings, and statuses', async () => {
  const { parseCreateStashInput } = await loadStashValidation();

  assert.equal(parseCreateStashInput({ product_id: 'not-a-uuid' }).ok, false);
  assert.equal(parseCreateStashInput({ product_id: productId, rating: 6 }).ok, false);
  assert.equal(parseCreateStashInput({ product_id: productId, status: 'secret-status' }).ok, false);
});

test('allows clearing optional fields in a partial update', async () => {
  const { parseUpdateStashInput } = await loadStashValidation();

  assert.deepEqual(
    parseUpdateStashInput({ status: '', rating: null, notes: '   ' }),
    {
      ok: true,
      value: { status: null, rating: null, notes: null },
    },
  );
});

test('rejects an empty partial update', async () => {
  const { parseUpdateStashInput } = await loadStashValidation();

  assert.deepEqual(parseUpdateStashInput({}), {
    ok: false,
    error: 'Add a status, rating, or note before saving.',
  });
});
