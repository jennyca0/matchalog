"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('api/products')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => setError(error));
  }, []);     
  

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
        <h2>Discover</h2>
        <p className="page-description">Find matcha products</p>
        <div className="container">
          {data && data.products.map(product => (
            <div key={product.id} className="card">
              <img src={product.image_url} />
              <div className="card-text">
                <p>{product.name}</p>
                <p>{product.brand}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}