'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthNav } from '@/components/auth-nav';

const navigation = [
  { href: '/', label: 'Discover' },
  { href: '/stash', label: 'Stash' },
  { href: '/recipes', label: 'Recipes' },
  { href: '/profile', label: 'Profile' },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand" aria-label="MatchaLog home">
          <span className="brand__mark" aria-hidden="true">M</span>
          <span className="brand__name">MatchaLog</span>
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          {navigation.map((item) => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? 'site-nav__link site-nav__link--active' : 'site-nav__link'}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="site-header__actions">
          <AuthNav />
        </div>
      </div>
    </header>
  );
}
