"use client"
import { useEffect, useState } from 'react';
import { user_id } from '@/lib/constants';
import Link from 'next/link';

export default function recipesPage () {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setLoading(true); 

      const response = await fetch(
        `/api/recipes`
      );
      if (!response.ok) {
        setError('Error fetching recipes');
        setLoading(false);
        return;
      }
    };
});

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
            <div className="page-header">
                <h2>Recipes</h2>
                <p className="page-description">Explore and create Matcha Recipes</p>
            </div>
        <div className="container">
          {loading && <p className="info">Loading recipes…</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && data.length === 0 && (
            <p className="info">No recipes found.</p>
          )}

          {!loading && !error && data.map((recipe) => (
                <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="recipe-link">
                    <div className="card">
                    <div className="card-image-container">
                   {/* <img src={recipe.image_url || '/image.svg'} alt={recipe.name} /> */}
                    </div>
                    <div className="card-text">
                        <h3 className="card-title">{recipe.name}</h3>
                        <p className="card-brand">{recipe.creator}</p>
                    </div>
                    </div>
                </Link>
                ))}
            </div>
        </div>
    </div>

    );
}