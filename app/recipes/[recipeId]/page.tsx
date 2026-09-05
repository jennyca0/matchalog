'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import type { Recipe } from '@/lib/types';

interface RecipePageProps {
  params: Promise<{ recipeId: string }>;
}

export default function RecipePage({ params }: RecipePageProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { recipeId } = await params;
        const response = await fetch(`/api/recipes/${recipeId}`);
        if (!response.ok) {
          setError('Error fetching recipe');
          return;
        }
        const data = (await response.json()) as Recipe;
        setRecipe(data);
      } catch {
        setError('Error fetching recipe');
      } finally {
        setLoading(false);
      }
    };

    void fetchRecipe();
  }, [params]);

  if (loading) return <><SiteHeader /><main className="page-shell"><p className="state-message">Opening the recipe…</p></main></>;
  if (error) return <><SiteHeader /><main className="page-shell"><p className="state-message state-message--error">Error loading recipe.</p></main></>;
  if (!recipe) return <><SiteHeader /><main className="page-shell"><p className="state-message">Recipe not found.</p></main></>;

  return (
    <>
      <SiteHeader />
      <main className="page-shell">
        <Link href="/recipes" className="back-link">← Back to recipes</Link>
        <article className="detail-layout recipe-detail">
          <div className="detail-visual">
            <img src={recipe.image_url || '/image.svg'} alt={recipe.name} />
          </div>
          <div className="detail-panel">
            <p className="recipe-detail__creator">{recipe.creator || 'MatchaLog kitchen'}</p>
            <h1>{recipe.name}</h1>
            <p className="recipe-detail__description">{recipe.description || 'A simple preparation for a thoughtful cup.'}</p>
            <Link href="/recipes" className="button button--secondary">Browse all recipes</Link>
          </div>
        </article>
      </main>
    </>
  );
}
