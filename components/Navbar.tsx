'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { FaSearch, FaBell, FaCaretDown, FaTimes } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import Image from 'next/image';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const session = { user: { name: 'Demo User' } }; // Mock session to fix Turbopack context issue
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

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
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 py-4 transition-all duration-500 ease-in-out ${
        scrolled ? 'bg-[#141414] shadow-md shadow-black/50' : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
      }`}
    >
      {/* Logo + Nav Links */}
      <div className="flex items-center gap-6 md:gap-10">
        <Link href="/" className="text-[#E50914] font-black text-2xl md:text-3xl tracking-tighter select-none">
          NETFLIX
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-5 text-[14px]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors duration-300 hover:text-gray-300 ${
                pathname === link.href ? 'text-white font-medium' : 'text-gray-200'
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
            <div className="absolute top-8 left-0 bg-black/95 border border-zinc-800 rounded shadow-xl min-w-[200px] py-2 z-50 flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setShowMobileMenu(false)}
                  className="px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Search */}
        <div className="flex items-center">
          <form onSubmit={handleSearch} className="flex items-center relative">
            <div
              className={`flex items-center transition-all duration-300 overflow-hidden ${
                showSearch
                  ? 'border border-white bg-black/80 w-48 md:w-64 px-2 py-1 translate-x-0 opacity-100'
                  : 'w-0 border-transparent translate-x-4 opacity-0 pointer-events-none absolute right-0'
              }`}
            >
              <button type="submit" className="text-white">
                <FaSearch size={16} />
              </button>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Titles, people, genres"
                className="bg-transparent text-white text-[14px] w-full ml-2 outline-none placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-white"
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>
            
            {!showSearch && (
              <button
                type="button"
                onClick={() => setShowSearch(true)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <FaSearch size={20} />
              </button>
            )}
          </form>
        </div>

        {/* Kids */}
        <div className="hidden md:block text-[14px] text-white hover:text-gray-300 cursor-pointer">
          Kids
        </div>

        {/* Notifications */}
        <button className="text-white hover:text-gray-300 hidden md:block relative group">
          <FaBell size={20} />
          {/* Notification Badge */}
          <div className="absolute top-0 right-0 w-2 h-2 bg-[#E50914] rounded-full border border-black group-hover:scale-110 transition-transform"></div>
        </button>

        {/* User Menu */}
        {session ? (
          <div 
            className="relative flex items-center gap-2 cursor-pointer group"
            onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
          >
            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center overflow-hidden hover-glow">
               <span className="text-white text-xs font-bold">{session.user?.name?.[0]?.toUpperCase() || 'U'}</span>
            </div>
            <FaCaretDown
              size={12}
              className={`text-white transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`}
            />
            
            {showUserMenu && (
              <div className="absolute right-0 top-full pt-4 animate-fade-in origin-top-right">
                <div className="bg-black/95 border border-zinc-800 rounded shadow-[0_0_20px_rgba(0,0,0,0.8)] w-[220px] py-2 z-50">
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-blue-600 flex flex-shrink-0 items-center justify-center">
                       <span className="text-white text-xs font-bold">{session.user?.name?.[0]?.toUpperCase() || 'U'}</span>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-white truncate">{session.user?.name}</p>
                    </div>
                  </div>
                  <hr className="border-zinc-800 my-1" />
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-zinc-800"
                  >
                    Manage Profiles
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-zinc-800"
                  >
                    Account
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-zinc-800"
                  >
                    Help Center
                  </Link>
                  <hr className="border-zinc-800 my-1" />
                  <button
                    onClick={() => signOut({ callbackUrl: '/auth' })}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-zinc-800"
                  >
                    Sign out of Netflix
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/auth"
            className="bg-[#E50914] hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm font-semibold transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

