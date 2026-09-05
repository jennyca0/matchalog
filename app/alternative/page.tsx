'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from 'react';
import { AuthNav } from '@/components/auth-nav';
import type { MatchaProduct, ProductsResponse } from '@/lib/types';

const controls = ['All', 'Newest', 'Price', 'Name'];

export default function AlternativePage() {
  const [products, setProducts] = useState<MatchaProduct[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [activeControl, setActiveControl] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/products?search=${encodeURIComponent(search)}&page=0&pageSize=24`,
        );
        if (!response.ok) {
          setError('The archive could not be loaded.');
          return;
        }

        const result = (await response.json()) as ProductsResponse;
        setProducts(result.products ?? []);
      } catch {
        setError('The archive could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, [search]);

  const displayedProducts = useMemo(() => {
    const next = [...products];

    if (activeControl === 'Price') {
      next.sort((a, b) => Number(a.price ?? Number.POSITIVE_INFINITY) - Number(b.price ?? Number.POSITIVE_INFINITY));
    }

    if (activeControl === 'Name') {
      next.sort((a, b) => a.name.localeCompare(b.name));
    }

    return next;
  }, [activeControl, products]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(searchInput.trim());
  }

  return (
    <div className="archive-page">
      <header className="archive-header">
        <div className="archive-header__inner">
          <Link href="/alternative" className="archive-brand" aria-label="MatchaLog archive home">
            <span className="archive-brand__mark" aria-hidden="true">M</span>
            <span>MatchaLog / archive</span>
          </Link>

          <nav className="archive-nav" aria-label="Archive navigation">
            <Link href="/alternative" aria-current="page">Collection</Link>
            <Link href="/">Discover</Link>
            <Link href="/recipes">Recipes</Link>
            <Link href="/profile">Profile</Link>
          </nav>

          <div className="archive-header__actions">
            <Link href="/" className="archive-quiet-link">Quiet view →</Link>
            <AuthNav />
          </div>
        </div>
      </header>

      <main className="archive-main">
        <header className="archive-hero">
          <div>
            <p className="eyebrow">Alternative direction / archive study</p>
            <h1>Matcha archive.</h1>
          </div>
          <p>A denser, catalog-first reading of the same collection. More index than journal.</p>
        </header>

        <section className="archive-controls" aria-label="Archive controls">
          <form className="archive-search" onSubmit={handleSearch}>
            <label htmlFor="archive-search-input">Search products</label>
            <input
              id="archive-search-input"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by name or maker"
            />
          </form>
          <div className="archive-filters" aria-label="Sort collection">
            {controls.map((control) => (
              <button
                key={control}
                type="button"
                className={activeControl === control ? 'archive-filter archive-filter--active' : 'archive-filter'}
                aria-pressed={activeControl === control}
                onClick={() => setActiveControl(control)}
              >
                {control}
              </button>
            ))}
          </div>
        </section>

        <div className="archive-meta">
          <span><strong>{loading ? '—' : displayedProducts.length}</strong> records shown</span>
          <span>{search ? `Search: ${search}` : 'Latest additions first'}</span>
        </div>

        <section className="archive-grid" aria-live="polite">
          {loading && <p className="archive-state">Loading archive…</p>}
          {error && <p className="archive-state">{error}</p>}
          {!loading && !error && displayedProducts.length === 0 && <p className="archive-state">No records match that search.</p>}
          {!loading && !error && displayedProducts.map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="archive-card"
              style={{ '--card-index': index } as CSSProperties}
            >
              <article>
                <div className="archive-card__image">
                  <img src={product.image_url || '/image.svg'} alt={product.name} />
                </div>
                <div className="archive-card__body">
                  <span className="archive-card__index">{String(index + 1).padStart(2, '0')}</span>
                  <h2>{product.name}</h2>
                  <p className="archive-card__brand">{product.brand || 'Independent maker'}</p>
                  <div className="archive-card__meta">
                    <span>{product.origin || 'Origin not listed'}</span>
                    {product.price !== null && product.price !== undefined && (
                      <span className="archive-card__price">${product.price}</span>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </section>

        <footer className="archive-footer">
          <span>MatchaLog / alternate visual direction</span>
          <span><Link href="/">Return to the quiet journal →</Link></span>
        </footer>
      </main>
    </div>
  );
}
