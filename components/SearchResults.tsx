'use client';

import { useEffect, useState } from 'react';
import { Movie, SearchResult } from '@/types';
import { searchMovies } from '@/lib/tmdb';
import MovieCard from './MovieCard';

interface SearchResultsProps {
  query: string;
}

export default function SearchResults({ query }: SearchResultsProps) {
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    searchMovies(query, 1).then((data: SearchResult) => {
      setResults(data.results.filter((m) => m.poster_path || m.backdrop_path));
      setTotalPages(data.total_pages);
      setLoading(false);
    });
  }, [query]);

  const loadMore = async () => {
    const nextPage = page + 1;
    const data = await searchMovies(query, nextPage);
    setResults((prev) => [
      ...prev,
      ...data.results.filter((m) => m.poster_path || m.backdrop_path),
    ]);
    setPage(nextPage);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] rounded skeleton" />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
        <span className="text-6xl mb-4">😕</span>
        <h2 className="text-white text-xl font-bold mb-2">No results found</h2>
        <p className="text-gray-400">Try searching for something else</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-gray-400 text-sm mb-4">{results.length} results</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {results.map((movie) => (
          <MovieCard key={`${movie.id}-${movie.media_type}`} movie={movie} />
        ))}
      </div>
      {page < totalPages && (
        <div className="text-center mt-10">
          <button
            onClick={loadMore}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded font-semibold transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
