'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import type { Recipe } from '@/lib/types';

interface RecipesResponse {
  recipes: Recipe[];
}

export default function RecipesPage() {
  const [data, setData] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setLoading(true);

      try {
        const response = await fetch('/api/recipes');
        if (!response.ok) {
          setError('Error fetching recipes');
          return;
        }
        const result = (await response.json()) as RecipesResponse;
        setData(result.recipes ?? []);
      } catch {
        setError('Error fetching recipes');
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  return (
    <>
      <SiteHeader />
      <main className="page-shell">
        <header className="page-intro">
          <div className="page-intro__copy">
            <p className="eyebrow">A small library for slow mornings</p>
            <h1>Recipes worth repeating.</h1>
            <p className="page-intro__description">
              Keep the preparations that make your daily cup feel like your own.
            </p>
          </div>
          <p className="page-intro__aside">
            <strong>{data.length || '—'}</strong>
            saved preparations
          </p>
        </header>

        <section className="recipe-grid" aria-live="polite">
          {loading && <p className="state-message">Opening the recipe shelf…</p>}
          {error && <p className="state-message state-message--error">{error}</p>}
          {!loading && !error && data.length === 0 && <p className="state-message">No recipes found yet.</p>}
          {!loading && !error && data.map((recipe, index) => (
            <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="recipe-card" style={{ '--card-index': index } as CSSProperties}>
              <article>
                <div className="recipe-card__image">
                  <img src={recipe.image_url || '/image.svg'} alt={recipe.name} />
                </div>
                <div className="recipe-card__body">
                  <p className="recipe-card__creator">{recipe.creator || 'MatchaLog kitchen'}</p>
                  <h3>{recipe.name}</h3>
                </div>
              </article>
            </Link>
          ))}
        </section>
      </main>
    </>
  );
}
