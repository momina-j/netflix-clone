import Navbar from '@/components/Navbar';
import Banner from '@/components/Banner';
import MovieRow from '@/components/MovieRow';
import Footer from '@/components/Footer';
import {
  fetchTrending, fetchTopRated, fetchPopular,
  fetchNowPlaying, fetchUpcoming, fetchAiringToday,
} from '@/lib/tmdb';

export const revalidate = 3600;

export default async function HomePage() {
  const [trending, topRatedMovies, popularMovies, nowPlaying, upcoming, popularTV, airingToday, topRatedTV] =
    await Promise.all([
      fetchTrending('all', 'week'),
      fetchTopRated('movie'),
      fetchPopular('movie'),
      fetchNowPlaying(),
      fetchUpcoming(),
      fetchPopular('tv'),
      fetchAiringToday(),
      fetchTopRated('tv'),
    ]);

  return (
    <main className="min-h-screen bg-zinc-950">
      <Navbar />
      <Banner movies={trending.slice(0, 5)} />
      <div className="relative z-10 -mt-20 pb-8">
        <MovieRow title="🔥 Trending Now" movies={trending} />
        <MovieRow title="🎬 Now Playing" movies={nowPlaying} />
        <MovieRow title="⭐ Top Rated Movies" movies={topRatedMovies} />
        <MovieRow title="🎭 Popular Movies" movies={popularMovies} />
        <MovieRow title="🚀 Upcoming Movies" movies={upcoming} />
        <MovieRow title="📺 Popular TV Shows" movies={popularTV} />
        <MovieRow title="📡 Airing Today" movies={airingToday} />
        <MovieRow title="🏆 Top Rated TV Shows" movies={topRatedTV} />
      </div>
      <Footer />
    </main>
  );
}
