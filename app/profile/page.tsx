import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';

export default function ProfilePage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell">
        <header className="page-intro">
          <div className="page-intro__copy">
            <p className="eyebrow">Your MatchaLog</p>
            <h1>Make room for the rituals that stay.</h1>
            <p className="page-intro__description">
              This is your quiet corner for the matcha you keep coming back to and the notes that help you remember why.
            </p>
          </div>
        </header>

        <section className="profile-layout">
          <div className="profile-note">
            <p>Good taste is often just paying attention.</p>
          </div>
          <nav className="profile-links" aria-label="Profile sections">
            <Link href="/stash" className="profile-link">
              <span>My stash</span>
              <span>→</span>
            </Link>
            <Link href="/recipes" className="profile-link">
              <span>Saved recipes</span>
              <span>→</span>
            </Link>
            <Link href="/" className="profile-link">
              <span>Keep discovering</span>
              <span>→</span>
            </Link>
          </nav>
        </section>
      </main>
    </>
  );
}
