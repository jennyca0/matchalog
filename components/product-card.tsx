import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { MatchaProduct } from '@/lib/types';

interface ProductCardProps {
  product: MatchaProduct;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="product-card"
      style={{ '--card-index': index } as CSSProperties}
    >
      <article>
        <div className="product-card__image">
          <img src={product.image_url || '/image.svg'} alt={product.name} />
        </div>
        <div className="product-card__body">
          <p className="eyebrow">{product.origin || 'Matcha product'}</p>
          <h3>{product.name}</h3>
          <div className="product-card__meta">
            <span>{product.brand || 'Independent maker'}</span>
            {product.price !== null && product.price !== undefined && <span>${product.price}</span>}
          </div>
        </div>
      </article>
    </Link>
  );
}
