'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import type { StashItem, StashResponse } from '@/lib/types';

export default function StashPage() {
  const [userStash, setUserStash] = useState<StashItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
            {userStash.length === 1 ? 'matcha in your stash' : 'matcha in your stash'}
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
                {userStash.map((product) => (
                  <div key={product.id} className="stash-product-card">
                    <div className="stash-product-image">
                      <img src={product.matcha_products?.image_url || '/image.svg'} alt={product.matcha_products?.name ?? 'Matcha product'} />
                    </div>
                    <div className="stash-product-details">
                      <div className="stash-product-info">
                        <p className="stash-product-brand">{product.matcha_products?.brand}</p>
                        <h3 className="stash-product-name">{product.matcha_products?.name}</h3>
                        <div className="stash-item-rating">
                          <p className="stash-rating">Your Rating</p>
                          <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={star <= (product.rating || 0) ? 'star filled' : 'star'}>★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="stash-product-actions">
                        <select className="stash-status-select" defaultValue={product.status ?? ''}>
                          <option value="unopened">Unopened</option>
                          <option value="opened">Opened</option>
                          <option value="finished">Finished</option>
                          <option value="wishlist">Wishlist</option>
                          <option value="repurchased">Repurchased</option>
                          <option value="did not finish">Did Not Finish</option>
                        </select>
                        <button type="button" className="stash-delete-btn">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
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
    </>
  );
}
