"use client";
import Link from 'next/link';
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

    <div className="page-wrapper">
        <div className="product-container">
        <div className="backlink">
            <Link href="/">← Back to Catalog
            </Link>
        </div>
            

        <div className="product-page">
            {/*product image*/}
            <div key={product.id} className="card">
              <div className="card-image-container">
                <img src={product.image_url || '/image.svg'} alt={product.name} />
              </div>
            </div>
            {/*product details*/}
            <div className="product-details">
                <div className="product-brand">{product.brand}</div>
                <h1>{product.name}</h1>
                <div className="product-tags"> 
                    <span className="tag">{product.origin}</span>
                    {/*<span className="tag">{product.grade}</span> */}
                    <span className="tag">$ {product.price}</span>
                </div>
                <p className="product-description">{product.description}</p> 
                <button className="add-to-stash">Add to Stash</button>
            </div>
        {/* Reviews Section
        <div className="product-reviews">
            <div className="reviews-header">
            <h2 className="">Reviews ({productReviews.length})</h2>
            {!showReviewForm && (
                <button onClick={() => setShowReviewForm(true)} className="write-review-button">
                Write Review
                </button>
            )}
            </div>
            </div>*/}
        </div>
        </div>
    </div>
    </div>
);
}