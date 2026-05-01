import { notFound } from 'next/navigation';
import DetailModal from '@/components/DetailModal';
import {
  fetchMovieDetails, fetchMovieVideos, fetchMovieCast, fetchSimilarMovies
} from '@/lib/tmdb';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TVModalPage({ params }: PageProps) {
  const { id } = await params;

  const [show, videos, cast, similar] = await Promise.all([
    fetchMovieDetails(id, 'tv'),
    fetchMovieVideos(id, 'tv'),
    fetchMovieCast(id, 'tv'),
    fetchSimilarMovies(id, 'tv'),
  ]);

  if (!show) notFound();

  return (
    <DetailModal 
      movie={show} 
      videos={videos} 
      cast={cast} 
      similar={similar} 
      isModal={true} 
    />
  );
}
