import { notFound } from 'next/navigation';
import DetailModal from '@/components/DetailModal';
import {
  fetchMovieDetails, fetchMovieVideos, fetchMovieCast, fetchSimilarMovies
} from '@/lib/tmdb';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieModalPage({ params }: PageProps) {
  const { id } = await params;

  const [movie, videos, cast, similar] = await Promise.all([
    fetchMovieDetails(id, 'movie'),
    fetchMovieVideos(id, 'movie'),
    fetchMovieCast(id, 'movie'),
    fetchSimilarMovies(id, 'movie'),
  ]);

  if (!movie) notFound();

  return (
    <DetailModal 
      movie={movie} 
      videos={videos} 
      cast={cast} 
      similar={similar} 
      isModal={true} 
    />
  );
}
