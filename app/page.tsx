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
    <main className="min-h-screen bg-[#141414]">
      <Navbar />
      <Banner movies={trending.slice(0, 10)} />
      
      {/* 
        The negative margin pulls the rows up over the banner gradient.
        We use z-10 to ensure it sits above the video background.
      */}
      <div className="relative z-10 -mt-16 md:-mt-20 pb-8 overflow-visible">
        <MovieRow title="Trending Now" movies={trending} />
        
        {/* Top 10 Row using topRatedMovies */}
        <MovieRow title="Top 10 Movies Today" movies={topRatedMovies.slice(0, 10)} isTop10={true} />
        
        <MovieRow title="Continue Watching for User" movies={nowPlaying} />
        <MovieRow title="New Releases" movies={upcoming} />
        <MovieRow title="Popular on Netflix" movies={popularMovies} />
        <MovieRow title="Binge-Worthy TV Shows" movies={popularTV} />
        <MovieRow title="Airing Today" movies={airingToday} />
        <MovieRow title="Critically Acclaimed TV" movies={topRatedTV} />
      </div>
      
      <Footer />
    </main>
  );
}
