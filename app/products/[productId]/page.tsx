'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { user_id } from '@/lib/constants';
import type { MatchaProduct, Review, ReviewsResponse } from '@/lib/types';

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<MatchaProduct | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [productReviews, setProductReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { productId } = await params;
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          setError('Error fetching product');
          return;
        }
        const data = (await response.json()) as MatchaProduct;
        setProduct(data);
      } catch {
        setError('Error fetching product');
      } finally {
        setLoading(false);
      }
    };

    void fetchProduct();
  }, [params]);

  useEffect(() => {
    if (!product) return;

    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews/${product.id}`);
        if (!response.ok) return;
        const data = (await response.json()) as ReviewsResponse;
        setProductReviews(data.reviews ?? []);
      } catch {
        setProductReviews([]);
      }
    };

    void fetchReviews();
  }, [product]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading product.</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div>
      <nav className="topnav">
        <div className="nav-wrapper">
          <Link href="/" className="nav-logo">MatchaLog</Link>
          <ul>
            <li><Link href="/" className="nav-link">Discover</Link></li>
            <li><Link href={`/stash/${user_id}`} className="nav-linkStash">Stash</Link></li>
            <li><Link href="/recipes" className="nav-linkRecipes">Recipes</Link></li>
            <li><Link href={`/profile/${user_id}`} className="nav-linkProfile">Profile</Link></li>
          </ul>
        </div>
      </nav>

      <div className="page-wrapper">
        <div className="product-container">
          <div className="backlink">
            <Link href="/" className="breadcrumb-catalog">← Back to Catalog</Link>
          </div>

          <div className="product-page">
            <div className="product-card">
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
              <button className="add-to-stash" type="button">Add to Stash</button>
            </div>
          </div>

          <div className="product-reviews">
            <div className="reviews-header">
              <h2>Reviews ({productReviews.length})</h2>
            </div>
            <div className="reviews-content">
              <div className="reviews-list">
                {productReviews.length === 0 && <p>No reviews yet. Be the first to review this matcha!</p>}
                {productReviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <h3 className="username">{review.username}</h3>
                    <div className="review-rating">Rating: {review.rating} / 5</div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
              {!showReviewForm && (
                <button type="button" onClick={() => setShowReviewForm(true)} className="write-review-button">
                  Write Review
                </button>
              )}
              {showReviewForm && (
                <form className="review-form visible">
                  <textarea placeholder="Share your thoughts about this matcha..." className="review-textarea" />
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
