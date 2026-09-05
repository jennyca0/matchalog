'use client';

import { useEffect, useState, type FormEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { STASH_STATUS_NAMES } from '@/lib/stash-validation';
import { getOrderedStashStatuses, getStashRatingPreview } from '@/lib/stash-ui';
import type { StashItem, StashMutationResponse } from '@/lib/types';

interface AddToStashDialogProps {
  open: boolean;
  productId: string;
  productName: string;
  onOpenChange: (open: boolean) => void;
  onCreated: (stash: StashItem) => void;
}

const STATUS_LABELS: Record<(typeof STASH_STATUS_NAMES)[number], string> = {
  unopened: 'Unopened',
  opened: 'Opened',
  finished: 'Finished',
  wishlist: 'Wishlist',
  repurchased: 'Repurchased',
  'did not finish': 'Did not finish',
};

export function AddToStashDialog({
  open,
  productId,
  productName,
  onOpenChange,
  onCreated,
}: AddToStashDialogProps) {
  const [status, setStatus] = useState<(typeof STASH_STATUS_NAMES)[number]>('unopened');
  const [rating, setRating] = useState('');
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setStatus('unopened');
      setRating('');
      setHoveredRating(null);
      setNotes('');
      setError(null);
      setIsSubmitting(false);
    }
  }, [open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/stash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          status,
          rating: rating ? Number(rating) : null,
          notes,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as Partial<StashMutationResponse> & { error?: string };

      if (response.status === 401) {
        const redirect = encodeURIComponent(window.location.pathname);
        window.location.assign(`/login?redirect=${redirect}`);
        return;
      }

      if (!response.ok || !data.stash) {
        setError(data.error || 'That entry could not be added right now.');
        return;
      }

      onCreated(data.stash);
      onOpenChange(false);
    } catch {
      setError('That entry could not be added right now.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="stash-dialog-content">
        <DialogHeader>
          <p className="eyebrow">A new shelf entry</p>
          <DialogTitle>Add {productName} to your stash</DialogTitle>
          <DialogDescription>
            Keep the details that will help you remember this cup later. You can change them anytime.
          </DialogDescription>
        </DialogHeader>

        <form className="stash-dialog-form" onSubmit={handleSubmit}>
          <div className="stash-dialog-field">
            <Label htmlFor="stash-status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as (typeof STASH_STATUS_NAMES)[number])}>
              <SelectTrigger id="stash-status" className="w-full">
                <SelectValue placeholder="Choose a status" />
              </SelectTrigger>
              <SelectContent>
                {getOrderedStashStatuses(status, STASH_STATUS_NAMES).map((statusName) => (
                  <SelectItem key={statusName} value={statusName}>
                    {STATUS_LABELS[statusName]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <fieldset className="stash-dialog-field">
            <legend>Rating <span>(optional)</span></legend>
            <div
              className="stash-dialog-rating"
              aria-label="Rating out of five"
              onMouseLeave={() => setHoveredRating(null)}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`stash-rating-choice${getStashRatingPreview(Number(rating) || null, hoveredRating) >= value ? ' stash-rating-choice--active' : ''}`}
                  aria-label={`${value} out of 5`}
                  aria-pressed={Number(rating) === value}
                  onMouseEnter={() => setHoveredRating(value)}
                  onFocus={() => setHoveredRating(value)}
                  onClick={() => setRating(String(value))}
                >
                  ★
                </button>
              ))}
              {rating && (
                <button type="button" className="stash-rating-clear" onClick={() => setRating('')}>
                  Clear
                </button>
              )}
            </div>
          </fieldset>

          <div className="stash-dialog-field">
            <Label htmlFor="stash-notes">Private note <span>(optional)</span></Label>
            <Textarea
              id="stash-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="What made you curious about it?"
              maxLength={2000}
            />
          </div>

          {error && <p className="stash-dialog-error" role="alert">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding…' : 'Add to stash'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
