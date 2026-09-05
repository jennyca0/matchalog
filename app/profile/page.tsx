import Link from 'next/link';
import { AuthNav } from '@/components/auth-nav';

export default function ProfilePage() {
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
    </div>
  );
}
