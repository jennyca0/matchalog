'use client';

import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { debounce } from 'lodash';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import { AuthNav } from '@/components/auth-nav';
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
    <div>
      <nav className="topnav">
        <div className="nav-wrapper">
          <Link href="/" className="nav-logo">MatchaLog</Link>
          <ul>
            <li><Link href="/" className="nav-link">Discover</Link></li>
            <li><Link href="/stash" className="nav-linkStash">Stash</Link></li>
            <li><Link href="/recipes" className="nav-linkRecipes">Recipes</Link></li>
            <li><Link href="/profile" className="nav-linkProfile">Profile</Link></li>
          </ul>
          <AuthNav />
        </div>
      </nav>

      <div className="page-wrapper">
        <div className="page-header">
          <h2>Discover</h2>
          <p className="page-description">Find matcha products</p>
        </div>
        <div className="search-bar">
          <input
            type="text"
            id="search-input"
            placeholder="Search for matcha products..."
            onChange={(event: ChangeEvent<HTMLInputElement>) => debouncedSearch(event.target.value)}
          />
        </div>

        <div className="container">
          {loading && <p className="info">Loading products…</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && data.length === 0 && <p className="info">No products found.</p>}
          {!loading && !error && data.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="product-link">
              <div className="card">
                <div className="card-image-container">
                  <img src={product.image_url || '/image.svg'} alt={product.name} />
                </div>
                <div className="card-text">
                  <h3 className="card-title">{product.name}</h3>
                  <p className="card-brand">{product.brand}</p>
                  <p className="card-origin">{product.origin}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {pageCount > 1 && (
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
        )}
        {!loading && !error && totalCount > 0 && (
          <p className="info">Showing {data.length} of {totalCount} products</p>
        )}
      </div>
    </div>
  );
}
