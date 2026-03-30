"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';

export default function StashPage ({ params }) {
    const [userStash, setUserStash] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [savingStatusId, setSavingStatusId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const [activeFilter, setActiveFilter] = useState("All");
    const filterOptions = ["All", "Unopened", "Opened", "Finished", "Wishlist", "Repurchased", "Did Not Finish"];

    useEffect(() => {
        const fetchUserStash = async () => {
            const response = await fetch(`/api/stash`);
            
            if (!response.ok) {
                setError('Error fetching stash');
                setLoading(false);
                return;
            }

            const data = await response.json();
            console.log(data);
            const stashItems = (data.stash || []).map((item) => ({
                ...item,
                status: item.status || item.status_id || 'unopened',
            }));
            setUserStash(stashItems); //store in state so react can render it
            setLoading(false); //tell when done loading
    };

    fetchUserStash();
    }, []);

    const broadcastStashChange = (payload) => {
        if (typeof window === 'undefined') return;
        window.dispatchEvent(new CustomEvent('stash-sync', { detail: payload }));
        localStorage.setItem('stash-sync', JSON.stringify({ ...payload, ts: Date.now() }));
    }

    const handleStatusChange = async (stashId, productId, newStatus, previousStatus) => {
        setSavingStatusId(stashId);
        setUserStash((prev) =>
            prev.map((item) =>
                item.id === stashId ? { ...item, status: newStatus, status_id: newStatus } : item
            )
        );

        try {
            const response = await fetch(`/api/stash/${stashId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }), // ← Use newStatus, remove product_id
            });

            if (!response.ok) {
                throw new Error('Status update failed');
            }

            broadcastStashChange({ action: 'updated', productId });
        } catch (error) {
            console.error('Error updating stash status:', error);
            setUserStash((prev) =>
                prev.map((item) =>
                    item.id === stashId ? { ...item, status: previousStatus, status_id: previousStatus } : item
                )
            );
            setError('Unable to update status. Please try again.');
        } finally {
            setSavingStatusId(null);
        }
    }

    const handleDelete = async (stashId, productId) => {
        if (!stashId) {
            console.error('Delete failed: missing stashId');
            setError('Unable to delete item. Missing stash id.');
            return;
        }

        setDeletingId(stashId);

        try {
            const response = await fetch(`/api/stash/${stashId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Delete failed');
            }

            setUserStash((prev) => prev.filter((item) => item.id !== stashId));
            broadcastStashChange({ action: 'deleted', productId });
        } catch (error) {
            console.error('Error deleting stash item:', error);
            setError(error.message || 'Unable to delete item. Please try again.');
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div> 
            <Navbar />
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
                                                <select
                                                    className="stash-status-select"
                                                    value={product.status || 'unopened'}
                                                    disabled={savingStatusId === product.id || deletingId === product.id}
                                                    onChange={(event) =>
                                                        handleStatusChange(
                                                            product.id,
                                                            product.matcha_products?.id,
                                                            event.target.value,
                                                            product.status || 'unopened'
                                                        )
                                                    }
                                                >
                                                    <option value="unopened">Unopened</option>
                                                    <option value="opened">Opened</option>
                                                    <option value="finished">Finished</option>
                                                    <option value="wishlist">Wishlist</option>
                                                    <option value="repurchased">Repurchased</option>
                                                    <option value="did not finish">Did Not Finish</option>
                                                </select>
                                                <button
                                                    className="stash-delete-btn"
                                                    disabled={deletingId === product.id}
                                                    onClick={() => handleDelete(product.id, product.matcha_products?.id)}
                                                >
                                                    {deletingId === product.id ? 'Deleting...' : 'Delete'}
                                                </button>
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