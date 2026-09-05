import test from 'node:test';
import assert from 'node:assert/strict';

async function loadStashControls() {
  const controlsModule = await import('../lib/stash-ui.ts').catch(() => ({}));
  assert.equal(typeof controlsModule.getStashRatingPreview, 'function');
  assert.equal(typeof controlsModule.getOrderedStashStatuses, 'function');
  return controlsModule;
}

const statuses = ['unopened', 'opened', 'finished', 'wishlist', 'repurchased', 'did not finish'];

test('rating hover previews every star up to the hovered star', async () => {
  const { getStashRatingPreview } = await loadStashControls();

  assert.equal(getStashRatingPreview(1, 4), 4);
  assert.equal(getStashRatingPreview(null, 2), 2);
  assert.equal(getStashRatingPreview(3, null), 3);
});

test('selected status is placed first without changing the available options', async () => {
  const { getOrderedStashStatuses } = await loadStashControls();

  assert.deepEqual(getOrderedStashStatuses('finished', statuses), [
    'finished',
    'unopened',
    'opened',
    'wishlist',
    'repurchased',
    'did not finish',
  ]);
  assert.deepEqual(getOrderedStashStatuses(null, statuses), statuses);
});
