import Navbar from '@/components/Navbar';
import Banner from '@/components/Banner';
import MovieRow from '@/components/MovieRow';
import Footer from '@/components/Footer';
import {
  fetchTrending, fetchTopRated, fetchPopular,
  fetchNowPlaying, fetchUpcoming, fetchAiringToday,
} from '@/lib/tmdb';

export const revalidate = 3600;

interface BrowsePageProps {
  params: Promise<{ type: string }>;
}

export async function generateMetadata({ params }: BrowsePageProps) {
  const { type } = await params;
  const titles: Record<string, string> = {
    movies: 'Movies',
    tv: 'TV Shows',
    new: 'New & Popular',
  };
  return { title: `${titles[type] || 'Browse'} - Netflix Clone` };
}

export default async function BrowsePage({ params }: BrowsePageProps) {
  const { type } = await params;

  let banner, rows;

  if (type === 'movies') {
    const [trending, popular, topRated, upcoming, nowPlaying] = await Promise.all([
      fetchTrending('movie', 'week'),
      fetchPopular('movie'),
      fetchTopRated('movie'),
      fetchUpcoming(),
      fetchNowPlaying(),
    ]);
    banner = trending;
    rows = [
      { title: '🔥 Trending Movies', movies: trending },
      { title: '🎭 Popular Movies', movies: popular },
      { title: '⭐ Top Rated', movies: topRated },
      { title: '🚀 Upcoming', movies: upcoming },
      { title: '🎬 Now Playing', movies: nowPlaying },
    ];
  } else if (type === 'tv') {
    const [trending, popular, topRated, airing] = await Promise.all([
      fetchTrending('tv', 'week'),
      fetchPopular('tv'),
      fetchTopRated('tv'),
      fetchAiringToday(),
    ]);
    banner = trending;
    rows = [
      { title: '🔥 Trending TV', movies: trending },
      { title: '📺 Popular Shows', movies: popular },
      { title: '🏆 Top Rated Shows', movies: topRated },
      { title: '📡 Airing Today', movies: airing },
    ];
  } else {
    // New & Popular
    const [trending, upcoming, airing] = await Promise.all([
      fetchTrending('all', 'day'),
      fetchUpcoming(),
      fetchAiringToday(),
    ]);
    banner = trending;
    rows = [
      { title: '🔥 Trending Today', movies: trending },
      { title: '🚀 Coming Soon', movies: upcoming },
      { title: '📡 New Episodes', movies: airing },
    ];
  }

  return (
    <main className="min-h-screen bg-zinc-950">
      <Navbar />
      <Banner movies={banner.slice(0, 5)} />
      <div className="relative z-10 -mt-20 pb-8">
        {rows.map((row) => (
          <MovieRow key={row.title} title={row.title} movies={row.movies} />
        ))}
      </div>
      <Footer />
    </main>
  );
}
