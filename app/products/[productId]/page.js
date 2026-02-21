"use client";
import { useState, useEffect } from 'react';

export default function ProductPage ({ params }) {
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchProduct = async () => {
            const { productId } = await params;
            const response = await fetch(`/api/products/${productId}`);
            
            if (!response.ok) {
                setError('Error fetching product');
                setLoading(false);
                return;
            }

            const data = await response.json();
            setProduct(data); //store in state so react can render it
            setLoading(false); //tell when done loading
    };

    fetchProduct();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading product</div>;
    if (!product) return <div>Product not found</div>;

    //render the product details

    return (
        <div>
            <nav className="topnav">
                <div className="nav-wrapper">
                    <a href="#home" className="nav-logo">MatchaLog</a>
                <ul>
                    <li><a href="#discover">Discover</a></li>
                    <li><a href="#stash">Stash</a></li>
                    <li><a href="#recipes">Recipes</a></li>
                    <li><a href="#profile">Profile</a></li>
                </ul>
                </div>
            </nav>
        <div>
            <h2>{product.name}</h2>
            <p>{product.brand}</p>
            <p>{product.description}</p> 
            <p>{product.origin}</p>
            <p>{product.weight_grams}</p>
        </div>
        </div>
    );
}