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
      <h1>MatchaLog</h1>
      <h2>Discover</h2>
      <h3>Find matcha products</h3>
      {/* Display products in a grid */} 
      <div className="container">
        {data && data.products.map(product => (
          <div key={product.id} className="card">
            <img src={product.image_url} />
            <div className="card-text">
              <p>{product.name}</p>
              <p>{product.brand}</p>
            </div>
         {/*add averge rating and number of reviews */}
          </div>
        ))}
      </div>
    </div>
  );
}