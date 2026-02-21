"use client";
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import Link from 'next/link';

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
            <Link key={product.id} href={`/products/${product.id}`}>
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