"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';

export default function ProductPage ({ params }) {
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [productReviews, setProductReviews] = useState([]);

    const [isInStash, setIsInStash] = useState(false);
    const [stashButtonText, setStashButtonText] = useState("Add to Stash");
    const [checkingStash, setCheckingStash] = useState(true); // New state

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
            setProduct(data);
            setLoading(false);
        };

        fetchProduct();
    }, []);

    // NEW: Check if product is already in stash
    useEffect(() => {
        if (!product) return;

        const checkIfInStash = async () => {
            try {
                const response = await fetch('/api/stash');
                if (!response.ok) return;

                const data = await response.json();
                const stashItems = data.stash || [];
                
                // Check if this product is in the stash
                const inStash = stashItems.some(
                    item => item.product_id === product.id
                );

                if (inStash) {
                    setIsInStash(true);
                    setStashButtonText("In Stash");
                }
            } catch (error) {
                console.error('Error checking stash:', error);
            } finally {
                setCheckingStash(false);
            }
        };

        checkIfInStash();
    }, [product]);

    useEffect(() => {
        if (!product) return;
        const fetchReviews = async () => {
            const response = await fetch(`/api/reviews/${product.id}`);
            const data = await response.json();
            setProductReviews(data.reviews);
        };
        fetchReviews();
    }, [product]);

    const handleAddToStash = async () => {
        if (!product) return;

        try {
            const response = await fetch('/api/stash', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: product.id,
                    status: 'unopened'
                }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                console.error('Server error:', responseData.error);
                throw new Error(responseData.error || 'Server returned error');
            }

            // Success path
            setIsInStash(true);
            setStashButtonText("Added to Stash");

            // Reset after 2 seconds
            setTimeout(() => {
                setStashButtonText("In Stash");
            }, 2000);

        } catch (error) {
            console.error('Error adding to stash:', error);
            setStashButtonText("Error - Try Again");
            
            // Reset error state after 3 seconds
            setTimeout(() => {
                setStashButtonText("Add to Stash");
            }, 3000);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading product.</div>;
    if (!product) return <div>Product not found.</div>;

    return (
        <div>
            <Navbar />
            <div className="page-wrapper">
                <div className="product-container">
                    <div className="backlink">
                        <Link href="/" className="breadcrumb-catalog">
                            ← Back to Catalog
                        </Link>
                    </div>

                    <div className="product-page">
                        <div key={product.id} className="product-card">
                            <div className="product-card-image-container">
                                <img src={product.image_url || '/image.svg'} alt={product.name} />
                            </div>
                        </div>
                        
                        <div className="product-details">
                            <div className="product-brand">{product.brand}</div>
                            <h1>{product.name}</h1>
                            <div className="product-tags"> 
                                <span className="tag">{product.origin}</span>
                                <span className="tag">$ {product.price}</span>
                            </div>
                            <p className="product-description">{product.description}</p> 
                            
                            <button 
                                className="add-to-stash" 
                                onClick={handleAddToStash}
                                disabled={isInStash || checkingStash}
                            >
                                {checkingStash ? "Checking..." : stashButtonText}
                            </button>
            </div>
    </div>
        {/* Reviews Section */}
        <div className="product-reviews">
            <div className="reviews-header">
            <h2 className="">Reviews ({productReviews.length})</h2>
            </div>
            <div className="reviews-content">
                <div className="reviews-list">
                    {productReviews.length === 0 && <p>No reviews yet. Be the first to review this matcha!</p>}
                    {productReviews.map(review => (
                        <div key={review.id} className="review-card">
                            <h3 className="username">{review.username}</h3>
                            <div className="review-rating">Rating: {review.rating} / 5</div>
                            <p className="review-comment">{review.comment}</p>
                        </div>
                    ))}
                </div>
                {!showReviewForm && (
                    <button onClick={() => setShowReviewForm(true)} className="write-review-button">
                    Write Review
                    </button>
                )}
                {showReviewForm && (
                <form className={`review-form ${showReviewForm ? 'visible' : 'hidden'}`}>
                    <textarea placeholder="Share your thoughts about this matcha..." className="review-textarea"></textarea>
                    <button type="submit" className="submit-review-button">Submit Review</button>
                    <button type="button" onClick={() => setShowReviewForm(false)} className="cancel-review-button">Cancel</button>
                </form>
                )}
            </div>
        </div>
            </div>
        </div>
        
    </div>
);
}