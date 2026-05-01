import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import SearchResults from '@/components/SearchResults';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || '';

  return (
    <main className="min-h-screen bg-zinc-950 pt-20">
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
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <span className="text-6xl mb-4">🔍</span>
            <h2 className="text-white text-2xl font-bold mb-2">Search for movies & shows</h2>
            <p className="text-gray-400">Use the search bar above to find your favorites</p>
          </div>
        )}
      </div>
    </main>
  );
}
