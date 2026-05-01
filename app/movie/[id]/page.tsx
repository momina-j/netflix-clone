import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DetailModal from '@/components/DetailModal';
import {
  fetchMovieDetails, fetchMovieVideos, fetchMovieCast, fetchSimilarMovies
} from '@/lib/tmdb';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const movie = await fetchMovieDetails(id, 'movie');
  return {
    title: movie ? `${movie.title || movie.name} - Netflix` : 'Movie - Netflix',
  };
}

export default async function MoviePage({ params }: PageProps) {
  const { id } = await params;

  const [movie, videos, cast, similar] = await Promise.all([
    fetchMovieDetails(id, 'movie'),
    fetchMovieVideos(id, 'movie'),
    fetchMovieCast(id, 'movie'),
    fetchSimilarMovies(id, 'movie'),
  ]);

  if (!movie) notFound();

  return (
    <main className="min-h-screen bg-[#141414] text-white">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-0">
        <DetailModal 
          movie={movie} 
          videos={videos} 
          cast={cast} 
          similar={similar} 
          isModal={false} 
        />
      </div>
      <Footer />
    </main>
  );
}
