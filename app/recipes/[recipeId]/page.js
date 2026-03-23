"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { user_id } from '@/lib/constants';

export default function recipesPage () {
    const [recipe, setRecipe] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            const { recipeId } = await paramsl;
            const response = await fetch(`/api/recipes/${recipeId}`);

            if (!response.ok) {
                setError('Error fetching recipe');
                setLoading(false);
                return;
            }

            const data = await response.json();
            setRecipe(data); //store in state so react can render it
            setLoading(false);

        };

    fetchRecipe();
    }, []);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading recipe.</div>;
    if (!recipe) return <div>Recipe not found.</div>;

return (
    <div>
        <nav className="topnav"> 
            <div className="nav-wrapper">
                <Link href={`/`} className="nav-logo">MatchaLog</Link>
            <ul>
                <li><Link href={`/`} className="nav-link">Discover</Link></li>
                <li><Link href={`/stash/${user_id}`} className="nav-linkStash">Stash</Link></li>
                <li><Link href={`/recipes`} className="nav-linkRecipes">Recipes</Link></li>
                <li><Link href={`/profile/${user_id}`} className="nav-linkProfile">Profile</Link></li>
            </ul>
            </div>
        </nav>

        <div className="page-wrapper">
            <div className="product-container">
                <div className="backlink">
                    <Link href="/" className="breadcrumb-recipes">← Back to Recipes
                    </Link>
                </div>
            </div>
        </div>

        <div className="recipe-page">
            {/*recipe image*/}
            <div key={recipe.id} className="recipe-card">
              <div className="recipe-card-image-container">
                <img src={recipe.image_url || '/image.svg'} alt={recipe.name} />
              </div>
            </div>
            {/*recipe details*/}
            <div className="recipe-details">
                <div className="recipe-creator">{product.brand}</div>
                <h1>{recipe.name}</h1>
                <div className="recipe-tags"> 
                    {/*<span className="tag">{recipe.category}</span> */}
                </div>
                <p className="recipe-description">{recipe.description}</p> 

            </div>
    </div>

    </div> //last div 
);
}