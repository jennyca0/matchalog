'use client';

import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { debounce } from 'lodash';
import ReactPaginate from 'react-paginate';
import { ProductCard } from '@/components/product-card';
import { SiteHeader } from '@/components/site-header';
import type { MatchaProduct, ProductsResponse } from '@/lib/types';

export default function Home() {
  const [data, setData] = useState<MatchaProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 12;

  const debouncedSearch = useMemo(
    () =>
      debounce((text: string) => {
        setCurrentPage(0);
        setSearchText(text);
      }, 300),
    [],
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setLoading(true);

      try {
        const response = await fetch(
          `/api/products?search=${encodeURIComponent(searchText)}&page=${currentPage}&pageSize=${itemsPerPage}`,
        );
        if (!response.ok) {
          setError('Error fetching products');
          return;
        }

        const result = (await response.json()) as ProductsResponse;
        setData(result.products ?? []);
        setTotalCount(result.count ?? 0);
        setPageCount(Math.ceil((result.count ?? 0) / itemsPerPage));
      } catch {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [searchText, currentPage]);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return (
    <>
      <SiteHeader />
      <main className="page-shell">
        <header className="page-intro">
          <div className="page-intro__copy">
            <p className="eyebrow">A quiet record of good things</p>
            <h1>Find your next daily matcha.</h1>
            <p className="page-intro__description">
              Browse the collection, notice what you like, and keep the ones worth returning to close at hand.
            </p>
          </div>
          <p className="page-intro__aside">
            <strong>{totalCount || '—'}</strong>
            products in the collection
          </p>
        </header>

        <div className="catalog-toolbar">
          <div className="search-field">
            <label htmlFor="search-input">Search the collection</label>
          <input
            type="text"
            id="search-input"
            placeholder="Try a name, maker, or place"
            onChange={(event: ChangeEvent<HTMLInputElement>) => debouncedSearch(event.target.value)}
          />
          </div>
          <p className="catalog-count">{loading ? 'Refreshing…' : 'Sorted by newest'}</p>
        </div>

        <section className="product-grid" aria-live="polite">
          {loading && <p className="state-message">Looking through the collection…</p>}
          {error && <p className="state-message state-message--error">{error}</p>}
          {!loading && !error && data.length === 0 && <p className="state-message">No products found. Try a broader search.</p>}
          {!loading && !error && data.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </section>

        {pageCount > 1 && (
          <div className="pagination-wrap">
            <ReactPaginate
              pageCount={pageCount}
              forcePage={currentPage}
              onPageChange={handlePageClick}
              marginPagesDisplayed={1}
              pageRangeDisplayed={3}
              containerClassName="paginate"
              activeClassName="paginate-active"
              previousLabel="←"
              nextLabel="→"
              breakLabel="…"
            />
            {!loading && !error && totalCount > 0 && (
              <p className="page-note">Showing {data.length} of {totalCount} products</p>
            )}
          </div>
        )}

        {pageCount <= 1 && !loading && !error && totalCount > 0 && (
          <p className="page-note page-note--spaced">Showing {data.length} of {totalCount} products</p>
        )}
      </main>
    </>
  );
}
