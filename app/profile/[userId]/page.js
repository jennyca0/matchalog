"use client";
import { useEffect, useState } from 'react';
import { user_id } from '@/lib/constants';
import Link from 'next/link';

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
        </div>
    )