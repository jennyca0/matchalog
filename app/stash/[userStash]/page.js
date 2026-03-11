"use client";
import { useEffect, useState } from 'react';
import { user_id } from '@/lib/constants';
import Link from 'next/link';


export default function StashPage ({ params }) {
    const [userStash, setUserStash] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [activeFilter, setActiveFilter] = useState("All");
    const filterOptions = ["All", "Unopened", "Opened", "Finished", "Wishlist", "Repurchased", "Did Not Finish"];

    useEffect(() => {
        const fetchUserStash = async () => {
            const response = await fetch(`/api/stash/${user_id}`);
            
            if (!response.ok) {
                setError('Error fetching stash');
                setLoading(false);
                return;
            }

            const data = await response.json();
            console.log(data);
            setUserStash(data.stash); //store in state so react can render it
            setLoading(false); //tell when done loading
    };

    fetchUserStash();
    }, []);




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
                <h2>My Stash</h2>
                    <p className="page-description">Your Matcha Products</p>
                </div>    
               <div className="stash-container">
                    {loading ? (
                        <div className='loading-state'>
                            <p>Loading your stash...</p>
                        </div>
                    ) : userStash.length === 0 ? ( 
                        <div className="empty-stash">
                            <><p>No products in your stash yet! </p>
                            <p>Start adding matcha products to keep track of your collection</p></> 
                            <Link href="/"> <button className="discover-button">Discover Matcha</button></Link>
                        </div>
                    ) : (
                        <div className="stash-main">
                            
                            <div className="stash-products">
                                {userStash
                                .filter((product) => activeFilter === "All" || product.status === activeFilter.toLowerCase())
                                .map((product) => ( 
                                    <div key={product.id} className="stash-product-card">
                                        <div className='stash-product-image'>
                                            <img src={product.matcha_products?.image_url || '/image.svg'} alt={product.matcha_products?.name} />
                                        </div>
                                        <div className= "stash-product-details"> 
                                            <div className='stash-product-info'>
                                                <p className='stash-product-brand'>{product.matcha_products?.brand}</p>
                                                <h3 className='stash-product-name'>{product.matcha_products?.name}</h3>
                                                    <div className="stash-item-rating">
                                                    <p className='stash-rating'>Your Rating</p>
                                                    <div className="star-rating">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <span key={star} className={star <= (product.rating || 0) ? 'star filled' : 'star'}>★</span>
                                                        ))}
                                                    </div>
                                            </div>

                                            </div>
                                            <div className="stash-product-actions">
                                                <select className="stash-status-select" defaultValue={product.status}>
                                                    <option value="unopened">Unopened</option>
                                                    <option value="opened">Opened</option>
                                                    <option value="finished">Finished</option>
                                                    <option value="wishlist">Wishlist</option>
                                                    <option value="repurchased">Repurchased</option>
                                                    <option value="did not finish">Did Not Finish</option>
                                                </select>
                                                <button className="stash-delete-btn">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>  
                        </div>
                    )}
                </div>
            </div>        
        </div>
    )
}