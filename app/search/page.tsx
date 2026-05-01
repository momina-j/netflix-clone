import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import SearchResults from '@/components/SearchResults';
import { fetchTrending } from '@/lib/tmdb';
import { Movie } from '@/types';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || '';

  // Only fetch top searches if there's no query
  let topSearches: Movie[] = [];
  if (!query) {
    topSearches = await fetchTrending('all', 'day');
  }

  return (
    <main className="min-h-screen bg-[#141414] pt-24">
      <Navbar />
      <div className="px-4 md:px-12 pb-16">
        {query ? (
          <>
            <h1 className="text-white text-xl md:text-2xl font-semibold mb-6">
              Search results for: <span className="text-gray-300">&ldquo;{query}&rdquo;</span>
            </h1>
            <Suspense fallback={
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="aspect-[2/3] rounded skeleton" />
                ))}
              </div>
            }>
              <SearchResults query={query} />
            </Suspense>
          </>
        ) : (
          <div className="pt-4">
            <h1 className="text-white text-2xl md:text-3xl font-bold mb-8 tracking-wide">Top Searches</h1>
            {topSearches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                {topSearches.slice(0, 15).map((movie, idx) => (
                  <div key={movie.id} className="group flex items-center gap-4 bg-[#2a2a2a] hover:bg-zinc-700 transition-colors rounded overflow-hidden cursor-pointer h-[80px]">
                     <div className="w-[140px] h-full relative flex-shrink-0">
                       <img 
                          src={`https://image.tmdb.org/t/p/w300${movie.backdrop_path || movie.poster_path}`} 
                          alt={movie.title || movie.name || ''} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                       />
                     </div>
                     <span className="text-white font-semibold flex-1 truncate pr-4 text-[15px]">{movie.title || movie.name}</span>
                     <div className="w-10 h-10 border-2 border-white/50 group-hover:border-white rounded-full flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-white group-hover:text-black transition-all duration-300 group-hover:scale-110">
                       <span className="text-sm ml-0.5">▶</span>
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <span className="text-6xl mb-4">🔍</span>
                <h2 className="text-white text-2xl font-bold mb-2">Search for movies & shows</h2>
                <p className="text-gray-400">Use the search bar above to find your favorites</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
