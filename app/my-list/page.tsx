'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MovieCard from '@/components/MovieCard';
import { useMyList } from '@/store/useMyList';
import { FaTrash } from 'react-icons/fa';

export default function MyListPage() {
  const { myList, clearList } = useMyList();

  return (
    <main className="min-h-screen bg-zinc-950 pt-24">
      <Navbar />

      <div className="px-4 md:px-12 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">My List</h1>
          {myList.length > 0 && (
            <button
              onClick={clearList}
              className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm transition-colors"
            >
              <FaTrash size={14} /> Clear All
            </button>
          )}
        </div>

        {myList.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <span className="text-8xl mb-6">📋</span>
            <h2 className="text-white text-2xl font-bold mb-3">Your list is empty</h2>
            <p className="text-gray-400 mb-6 max-w-md">
              Add movies and TV shows to your list by clicking the + button on any title.
            </p>
            <a
              href="/"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded font-semibold transition-colors"
            >
              Browse Content
            </a>
          </div>
        ) : (
          <>
            <p className="text-gray-400 text-sm mb-6">{myList.length} title{myList.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {myList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
