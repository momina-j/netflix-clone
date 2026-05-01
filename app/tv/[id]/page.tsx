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
  const show = await fetchMovieDetails(id, 'tv');
  return {
    title: show ? `${show.name || show.title} - Netflix` : 'TV Show - Netflix',
  };
}

export default async function TVPage({ params }: PageProps) {
  const { id } = await params;

  const [show, videos, cast, similar] = await Promise.all([
    fetchMovieDetails(id, 'tv'),
    fetchMovieVideos(id, 'tv'),
    fetchMovieCast(id, 'tv'),
    fetchSimilarMovies(id, 'tv'),
  ]);

  if (!show) notFound();

  return (
    <main className="min-h-screen bg-[#141414] text-white">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-0">
        <DetailModal 
          movie={show} 
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
