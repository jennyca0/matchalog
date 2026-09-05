'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AuthNav } from '@/components/auth-nav';
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading recipe.</div>;
  if (!recipe) return <div>Recipe not found.</div>;

  return (
    <div>
      <nav className="topnav">
        <div className="nav-wrapper">
          <Link href="/" className="nav-logo">MatchaLog</Link>
          <ul>
            <li><Link href="/" className="nav-link">Discover</Link></li>
            <li><Link href="/stash" className="nav-linkStash">Stash</Link></li>
            <li><Link href="/recipes" className="nav-linkRecipes">Recipes</Link></li>
            <li><Link href="/profile" className="nav-linkProfile">Profile</Link></li>
          </ul>
          <AuthNav />
        </div>
      </nav>

      <div className="page-wrapper">
        <div className="product-container">
          <div className="backlink">
            <Link href="/recipes" className="breadcrumb-recipes">← Back to Recipes</Link>
          </div>
        </div>
      </div>

      <div className="recipe-page">
        <div key={recipe.id} className="recipe-card">
          <div className="recipe-card-image-container">
            <img src={recipe.image_url || '/image.svg'} alt={recipe.name} />
          </div>
        </div>
        <div className="recipe-details">
          <div className="recipe-creator">{recipe.creator}</div>
          <h1>{recipe.name}</h1>
          <p className="recipe-description">{recipe.description}</p>
        </div>
      </div>
    </div>
  );
}
