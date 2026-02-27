import { user_id } from '@/lib/constants';
import Link from 'next/link';

export default function recipesPage ({ params }) {
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
                <h2>Recipes</h2>
                <p className="page-description">Explore and create Matcha Recipes</p>
            </div>
        </div>

    </div>

    )
}