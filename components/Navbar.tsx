'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { FaSearch, FaBell, FaCaretDown, FaUser } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/browse/tv', label: 'TV Shows' },
    { href: '/browse/movies', label: 'Movies' },
    { href: '/browse/new', label: 'New & Popular' },
    { href: '/my-list', label: 'My List' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 py-4 transition-all duration-500 ${
        scrolled ? 'bg-zinc-950' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      {/* Logo + Nav Links */}
      <div className="flex items-center gap-6 md:gap-8">
        <Link href="/" className="text-red-600 font-black text-2xl md:text-3xl tracking-tighter select-none">
          NETFLIXCLONE
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-4 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-gray-300 ${
                pathname === link.href ? 'text-white font-semibold' : 'text-gray-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <div className="relative lg:hidden">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="flex items-center gap-1 text-sm text-white"
          >
            <GiHamburgerMenu size={20} />
          </button>
          {showMobileMenu && (
            <div className="absolute top-8 left-0 bg-zinc-900 border border-zinc-700 rounded shadow-xl min-w-[180px] py-2 z-50">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-zinc-800"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Search */}
        <div className="flex items-center">
          {showSearch ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="flex items-center border border-white/50 bg-black/80 backdrop-blur-sm">
                <button type="submit" className="px-2 text-white">
                  <FaSearch size={14} />
                </button>
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Titles, people, genres"
                  className="bg-transparent text-white text-sm py-1 pr-2 w-40 md:w-56 outline-none placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowSearch(false)}
                  className="px-2 text-gray-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="text-white hover:text-gray-300 transition-colors p-1"
            >
              <FaSearch size={18} />
            </button>
          )}
        </div>

        {/* Notifications */}
        <button className="text-white hover:text-gray-300 hidden md:block">
          <FaBell size={18} />
        </button>

        {/* User Menu */}
        {session ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-white font-bold text-sm">
                {session.user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <FaCaretDown
                size={12}
                className={`text-white transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
              />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-10 bg-zinc-900 border border-zinc-700 rounded shadow-xl min-w-[180px] py-2 z-50">
                <div className="px-4 py-2 border-b border-zinc-700">
                  <p className="text-sm font-medium text-white">{session.user?.name}</p>
                  <p className="text-xs text-gray-400">{session.user?.email}</p>
                </div>
                <Link
                  href="/my-list"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-zinc-800"
                >
                  My List
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-zinc-800"
                >
                  Account
                </Link>
                <hr className="border-zinc-700 my-1" />
                <button
                  onClick={() => signOut({ callbackUrl: '/auth' })}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-zinc-800"
                >
                  Sign out of Netflix
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/auth"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm font-semibold transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
