export function getStashRatingPreview(savedRating: number | null, hoveredRating: number | null): number {
  const preview = hoveredRating ?? savedRating ?? 0;
  return Math.min(5, Math.max(0, preview));
}

export function getOrderedStashStatuses<T extends string>(
  selectedStatus: T | null,
  statuses: readonly T[],
): T[] {
  if (!selectedStatus || !statuses.includes(selectedStatus)) {
    return [...statuses];
  }

  return [selectedStatus, ...statuses.filter((status) => status !== selectedStatus)];
}
