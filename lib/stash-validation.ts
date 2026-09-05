export const STASH_STATUS_NAMES = [
  'unopened',
  'opened',
  'finished',
  'wishlist',
  'repurchased',
  'did not finish',
] as const;

export type StashStatusName = (typeof STASH_STATUS_NAMES)[number];

export interface CreateStashInput {
  product_id: string;
  status: StashStatusName | null;
  rating: number | null;
  notes: string | null;
}

export interface UpdateStashInput {
  status?: StashStatusName | null;
  rating?: number | null;
  notes?: string | null;
}

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeStatus(value: unknown): ValidationResult<StashStatusName | null> {
  if (value === undefined || value === null || value === '') {
    return { ok: true, value: null };
  }

  if (typeof value !== 'string') {
    return { ok: false, error: 'Choose a valid stash status.' };
  }

  const status = value.trim().toLowerCase();
  if ((STASH_STATUS_NAMES as readonly string[]).includes(status)) {
    return { ok: true, value: status as StashStatusName };
  }

  return { ok: false, error: 'Choose a valid stash status.' };
}

function normalizeRating(value: unknown): ValidationResult<number | null> {
  if (value === undefined || value === null) {
    return { ok: true, value: null };
  }

  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 5) {
    return { ok: false, error: 'Rating must be a whole number from 1 to 5.' };
  }

  return { ok: true, value };
}

function normalizeNotes(value: unknown): ValidationResult<string | null> {
  if (value === undefined || value === null) {
    return { ok: true, value: null };
  }

  if (typeof value !== 'string') {
    return { ok: false, error: 'Notes must be text.' };
  }

  const notes = value.trim();
  if (notes.length > 2000) {
    return { ok: false, error: 'Notes must be 2,000 characters or fewer.' };
  }

  return { ok: true, value: notes || null };
}

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_PATTERN.test(value);
}

export function parseCreateStashInput(value: unknown): ValidationResult<CreateStashInput> {
  if (!isRecord(value) || !isUuid(value.product_id)) {
    return { ok: false, error: 'A valid product is required.' };
  }

  const status = normalizeStatus(value.status);
  if (!status.ok) return status;

  const rating = normalizeRating(value.rating);
  if (!rating.ok) return rating;

  const notes = normalizeNotes(value.notes);
  if (!notes.ok) return notes;

  return {
    ok: true,
    value: {
      product_id: value.product_id,
      status: status.value,
      rating: rating.value,
      notes: notes.value,
    },
  };
}

export function parseUpdateStashInput(value: unknown): ValidationResult<UpdateStashInput> {
  if (!isRecord(value)) {
    return { ok: false, error: 'Add a status, rating, or note before saving.' };
  }

  const result: UpdateStashInput = {};

  if ('status' in value) {
    const status = normalizeStatus(value.status);
    if (!status.ok) return status;
    result.status = status.value;
  }

  if ('rating' in value) {
    const rating = normalizeRating(value.rating);
    if (!rating.ok) return rating;
    result.rating = rating.value;
  }

  if ('notes' in value) {
    const notes = normalizeNotes(value.notes);
    if (!notes.ok) return notes;
    result.notes = notes.value;
  }

  if (Object.keys(result).length === 0) {
    return { ok: false, error: 'Add a status, rating, or note before saving.' };
  }

  return { ok: true, value: result };
}
