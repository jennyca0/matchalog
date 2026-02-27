"use client";
import { useEffect, useState } from 'react';
import { user_id } from '@/lib/constants';
import Link from 'next/link';


export default function StashPage ({ params }) {
    const [userStash, setUserStash] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

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
                        <p>Loading your stash...</p>
                    ) : userStash.length === 0 ? ( 
                        <div className="empty-stash">
                            <><p>No products in your stash yet! </p>
                            <p>Start adding matcha products to keep track of your collection</p></> 
                            <Link href="/"> <button className="discover-button">Discover Matcha</button></Link>
                        </div>
                    ) : (
                        <div className="stash-list">
                            {userStash.map((product) => ( 
                                <div key={product.id} className="stash-item">
                                    <p>{product.matcha_products.name}</p>
                                </div>
                            ))}
                        </div>  
                    )}
                </div>
            </div>        
        </div>
    )
}