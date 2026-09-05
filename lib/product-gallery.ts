import type { ProductImage } from '@/lib/types';

export function getOrderedProductImages(
  images: ProductImage[],
  fallback: ProductImage,
): ProductImage[] {
  if (images.length === 0) return [fallback];

  return [...images].sort((left, right) => {
    if (left.is_primary !== right.is_primary) {
      return left.is_primary ? -1 : 1;
    }

    const sortOrderDifference = left.sort_order - right.sort_order;
    if (sortOrderDifference !== 0) return sortOrderDifference;

    const createdAtDifference = (left.created_at ?? '').localeCompare(right.created_at ?? '');
    if (createdAtDifference !== 0) return createdAtDifference;

    return left.id.localeCompare(right.id);
  });
}
