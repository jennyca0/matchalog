'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getOrderedProductImages } from '@/lib/product-gallery';
import type { MatchaProduct, ProductImage, Review, ReviewsResponse } from '@/lib/types';

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<MatchaProduct | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);

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

  if (loading) return <><SiteHeader /><main className="page-shell"><p className="state-message">Opening the product record…</p></main></>;
  if (error) return <><SiteHeader /><main className="page-shell"><p className="state-message state-message--error">Error loading product.</p></main></>;
  if (!product) return <><SiteHeader /><main className="page-shell"><p className="state-message">Product not found.</p></main></>;

  const fallbackImage: ProductImage = {
    id: `fallback-${product.id}`,
    product_id: product.id,
    image_url: product.image_url || '/image.svg',
    alt_text: product.name,
    sort_order: 0,
    is_primary: true,
  };
  const galleryImages = getOrderedProductImages(product.images ?? [], fallbackImage);
  const activeImage = galleryImages.find((image) => image.id === activeImageId) ?? galleryImages[0];

  return (
    <>
      <SiteHeader />
      <main className="page-shell">
        <Link href="/" className="back-link">← Back to collection</Link>

        <article className="detail-layout">
          <div className="product-gallery" role="group" aria-label={`${product.name} images`}>
            <div className="detail-visual product-gallery__hero">
              <img src={activeImage.image_url} alt={activeImage.alt_text || product.name} />
            </div>
            {galleryImages.length > 1 && (
              <div className="product-gallery__thumbs" role="group" aria-label="Choose a product image">
                {galleryImages.map((image, index) => {
                  const isActive = image.id === activeImage.id;

                  return (
                    <button
                      key={image.id}
                      type="button"
                      className={`product-gallery__thumb${isActive ? ' product-gallery__thumb--active' : ''}`}
                      aria-label={`View image ${index + 1}`}
                      aria-pressed={isActive}
                      onClick={() => setActiveImageId(image.id)}
                    >
                      <img src={image.image_url} alt="" aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="detail-panel">
            <p className="detail-panel__brand">{product.brand || 'Independent maker'}</p>
            <h1>{product.name}</h1>
            <div className="detail-meta">
              <Badge variant="outline">{product.origin || 'Origin not listed'}</Badge>
              {product.price !== null && product.price !== undefined && <Badge variant="outline">$ {product.price}</Badge>}
            </div>
            <p className="detail-description">{product.description || 'A matcha waiting to be noticed.'}</p>
            <Button className="detail-panel__cta" type="button">Add to stash</Button>
          </div>
        </article>

        <section className="reviews-section" aria-labelledby="reviews-title">
          <div className="reviews-header">
            <h2 id="reviews-title">Notes from the community</h2>
            <span>{productReviews.length} {productReviews.length === 1 ? 'note' : 'notes'}</span>
          </div>
          <div className="reviews-content">
            <div className="reviews-list">
              {productReviews.length === 0 && <p className="state-message">No notes yet. Be the first to share what you noticed.</p>}
              {productReviews.map((review) => (
                <article key={review.id} className="review-card">
                  <div className="review-card__top">
                    <h3>{review.username || 'Anonymous taster'}</h3>
                    <span className="review-rating">{review.rating ?? '—'} / 5</span>
                  </div>
                  <p className="review-comment">{review.comment || 'No written note.'}</p>
                </article>
              ))}
            </div>
            {!showReviewForm && (
              <Button variant="outline" type="button" onClick={() => setShowReviewForm(true)} className="write-review-button">
                Write a note
              </Button>
            )}
            {showReviewForm && (
              <form className="review-form">
                <Textarea placeholder="What did you notice?" className="review-textarea" />
                <div className="review-form__actions">
                  <Button type="submit">Save note</Button>
                  <Button variant="outline" type="button" onClick={() => setShowReviewForm(false)}>Cancel</Button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
