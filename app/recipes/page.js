"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';

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
        <Navbar />

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