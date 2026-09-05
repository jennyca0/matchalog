'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { STASH_STATUS_NAMES, type StashStatusName } from '@/lib/stash-validation';
import { getOrderedStashStatuses, getStashRatingPreview } from '@/lib/stash-ui';
import type { StashItem, StashMutationResponse, StashResponse } from '@/lib/types';

const STATUS_LABELS: Record<StashStatusName, string> = {
  unopened: 'Unopened',
  opened: 'Opened',
  finished: 'Finished',
  wishlist: 'Wishlist',
  repurchased: 'Repurchased',
  'did not finish': 'Did not finish',
};

type StashUpdate = {
  status?: StashStatusName | null;
  rating?: number | null;
};

export default function StashPage() {
  const [userStash, setUserStash] = useState<StashItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StashItem | null>(null);
  const [hoveredRating, setHoveredRating] = useState<{ id: string; value: number } | null>(null);

  useEffect(() => {
    const fetchUserStash = async () => {
      try {
        const response = await fetch('/api/stash');
        if (!response.ok) {
          setError(response.status === 401 ? 'Please sign in to view your stash.' : 'Error fetching stash');
          return;
        }
        const data = (await response.json()) as StashResponse;
        setUserStash(data.stash ?? []);
      } catch {
        setError('Error fetching stash');
      } finally {
        setLoading(false);
      }
    };

    void fetchUserStash();
  }, []);

  async function updateStashItem(stashId: string, update: StashUpdate) {
    const previousStash = userStash;
    setActionError(null);
    setSavingId(stashId);
    setUserStash((current) => current.map((item) => item.id === stashId ? { ...item, ...update } : item));

    try {
      const response = await fetch(`/api/stash/${stashId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update),
      });
      const data = (await response.json().catch(() => ({}))) as Partial<StashMutationResponse> & { error?: string };

      if (response.status === 401) {
        window.location.assign(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      if (!response.ok || !data.stash) {
        throw new Error(data.error || 'That change could not be saved.');
      }

      setUserStash((current) => current.map((item) => item.id === stashId ? data.stash! : item));
    } catch (updateError) {
      setUserStash(previousStash);
      setActionError(updateError instanceof Error ? updateError.message : 'That change could not be saved.');
    } finally {
      setSavingId(null);
    }
  }

  async function deleteStashItem() {
    if (!deleteTarget) return;

    const target = deleteTarget;
    setActionError(null);
    setDeletingId(target.id);

    try {
      const response = await fetch(`/api/stash/${target.id}`, { method: 'DELETE' });
      const data = (await response.json().catch(() => ({}))) as { error?: string };

      if (response.status === 401) {
        window.location.assign(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'That item could not be deleted.');
      }

      setUserStash((current) => current.filter((item) => item.id !== target.id));
      setDeleteTarget(null);
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : 'That item could not be deleted.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="page-shell">
        <header className="page-intro">
          <div className="page-intro__copy">
            <p className="eyebrow">Your personal shelf</p>
            <h1>Keep the cups worth remembering.</h1>
            <p className="page-intro__description">
              A small record of what is open, what is finished, and what you want to return to.
            </p>
          </div>
          <p className="page-intro__aside">
            <strong>{userStash.length || '—'}</strong>
            matcha in your stash
          </p>
        </header>

        <div className="stash-layout">
          <section className="stash-list" aria-live="polite">
            {loading ? (
              <p className="state-message">Opening your shelf…</p>
            ) : error ? (
              <p className="state-message state-message--error">{error}</p>
            ) : userStash.length === 0 ? (
              <div className="empty-stash">
                <div className="empty-stash__visual" aria-hidden="true">
                  <svg viewBox="0 0 160 120" role="presentation">
                    <path d="M63 19c-7 9-7 17 0 24M86 14c-7 10-7 18 0 26M109 19c-7 9-7 17 0 24" />
                    <path d="M36 57h88c-2 25-18 39-44 39S38 82 36 57Z" />
                    <path d="M30 56c3 7 12 11 22 11h56c10 0 19-4 22-11" />
                    <path d="M55 99h50" />
                    <circle cx="80" cy="52" r="4" />
                  </svg>
                </div>
                <p className="eyebrow">The first entry</p>
                <h2>Nothing here yet.</h2>
                <p>Start with one matcha you are curious about. Your shelf will grow from there.</p>
                <Link href="/" className="button button--primary">Discover matcha</Link>
              </div>
            ) : (
              <>
                {actionError && <p className="state-message state-message--error" role="alert">{actionError}</p>}
                {userStash.map((item) => {
                  const product = item.matcha_products;
                  const currentStatus = (item.status ?? 'unopened') as StashStatusName;
                  const isSaving = savingId === item.id;
                  const previewRating = getStashRatingPreview(
                    item.rating,
                    hoveredRating?.id === item.id ? hoveredRating.value : null,
                  );

                  return (
                    <div key={item.id} className="stash-product-card">
                      <div className="stash-product-image">
                        <img src={product?.image_url || '/image.svg'} alt={product?.name ?? 'Matcha product'} />
                      </div>
                      <div className="stash-product-details">
                        <div className="stash-product-info">
                          <p className="stash-product-brand">{product?.brand || 'Independent maker'}</p>
                          <h3 className="stash-product-name">{product?.name || 'Untitled matcha'}</h3>
                          <div className="stash-item-rating">
                            <p className="stash-rating">Your rating</p>
                            <div
                              className="star-rating"
                              aria-label={`Your rating: ${item.rating ?? 'not rated'} out of 5`}
                              onMouseLeave={() => setHoveredRating(null)}
                            >
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  className={star <= previewRating ? 'star star-button filled' : 'star star-button'}
                                  aria-label={`Rate ${star} out of 5`}
                                  aria-pressed={item.rating === star}
                                  disabled={isSaving}
                                  onMouseEnter={() => setHoveredRating({ id: item.id, value: star })}
                                  onFocus={() => setHoveredRating({ id: item.id, value: star })}
                                  onClick={() => void updateStashItem(item.id, { rating: star })}
                                >
                                  ★
                                </button>
                              ))}
                            </div>
                          </div>
                          {item.notes && <p className="stash-product-note">“{item.notes}”</p>}
                        </div>
                        <div className="stash-product-actions">
                          <Select
                            value={currentStatus}
                            onValueChange={(status) => void updateStashItem(item.id, { status: status as StashStatusName })}
                            disabled={isSaving}
                          >
                            <SelectTrigger className="stash-status-select" aria-label={`Status for ${product?.name || 'matcha'}`}>
                              <SelectValue>{STATUS_LABELS[currentStatus]}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {getOrderedStashStatuses(currentStatus, STASH_STATUS_NAMES).map((statusName) => (
                                <SelectItem key={statusName} value={statusName}>{STATUS_LABELS[statusName]}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="stash-delete-btn"
                            onClick={() => setDeleteTarget(item)}
                            disabled={deletingId === item.id || isSaving}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </section>
          <aside className="stash-aside">
            <p className="eyebrow">A gentle practice</p>
            <h2>Notice what you reach for.</h2>
            <p>Use status and ratings as a memory aid, not a scorecard.</p>
          </aside>
        </div>
      </main>

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open && !deletingId) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this matcha?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {deleteTarget?.matcha_products?.name || 'this entry'} from your shelf. Your community notes stay untouched.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={Boolean(deletingId)}>Keep it</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={Boolean(deletingId)}
              onClick={(event) => {
                event.preventDefault();
                void deleteStashItem();
              }}
            >
              {deletingId ? 'Removing…' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
