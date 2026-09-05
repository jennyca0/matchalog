import test from 'node:test';
import assert from 'node:assert/strict';

async function loadGalleryHelper() {
  const galleryModule = await import('../lib/product-gallery.ts').catch(() => ({}));
  assert.equal(typeof galleryModule.getOrderedProductImages, 'function');
  return galleryModule.getOrderedProductImages;
}

const fallbackImage = {
  id: 'fallback',
  product_id: 'product-1',
  image_url: '/image.svg',
  alt_text: 'Matcha product placeholder',
  sort_order: 0,
  is_primary: true,
  created_at: '2026-01-01T00:00:00.000Z',
};

test('puts the primary image first, then respects gallery order', async () => {
  const getOrderedProductImages = await loadGalleryHelper();
  const images = [
    { ...fallbackImage, id: 'third', image_url: '/third.jpg', sort_order: 2, is_primary: false },
    { ...fallbackImage, id: 'second', image_url: '/second.jpg', sort_order: 1, is_primary: false },
    { ...fallbackImage, id: 'primary', image_url: '/primary.jpg', sort_order: 9, is_primary: true },
  ];

  assert.deepEqual(
    getOrderedProductImages(images, fallbackImage).map((image) => image.id),
    ['primary', 'second', 'third'],
  );
});

test('uses created time as a stable tie breaker for equal sort orders', async () => {
  const getOrderedProductImages = await loadGalleryHelper();
  const images = [
    { ...fallbackImage, id: 'later', image_url: '/later.jpg', created_at: '2026-02-02T00:00:00.000Z', is_primary: false },
    { ...fallbackImage, id: 'earlier', image_url: '/earlier.jpg', created_at: '2026-02-01T00:00:00.000Z', is_primary: false },
  ];

  assert.deepEqual(
    getOrderedProductImages(images, fallbackImage).map((image) => image.id),
    ['earlier', 'later'],
  );
});

test('falls back to the product image when the gallery is empty', async () => {
  const getOrderedProductImages = await loadGalleryHelper();

  assert.deepEqual(getOrderedProductImages([], fallbackImage), [fallbackImage]);
});
