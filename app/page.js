"use client";
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import Link from 'next/link';
import { user_id } from '@/lib/constants';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

const debouncedSearch = debounce((text) => {
  setSearchText(text);
}, 300); //wait 300ms after the user stops typing to update the search text

const [searchText, setSearchText] = useState('');
  useEffect(() => {
    fetch(`api/products?search=${encodeURIComponent(searchText)}`)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => setError(error));
  }, [searchText]);



return (
    <div>
      <nav className="topnav">
        <div className="nav-wrapper">
            <Link href={`/`} className="nav-logo">MatchaLog</Link>
          <ul>
            <li><Link href={`/`} className="nav-link">Discover</Link></li>
            <li><Link href={`/stash/${user_id}`} className="nav-linkStash">Stash</Link></li>
            <li><Link href={`/recipes`} className="nav-linkRecipes">Recipes</Link></li>
            <li><Link href={`/profile/${user_id}`} className="nav-linkProfile">Profile</Link></li>
          </ul>
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
          onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>

        <div className="container">
          {data && data.products.map(product => (
            <Link key={product.id} href={`/products/${product.id}`} className="product-link">
            <div key={product.id} className="card">
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
      </div>
    </div>
  );
}

{/*PAGINATION */} 