import { notFound } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import MovieRow from '@/components/MovieRow';
import Footer from '@/components/Footer';
import VideoPlayer from '@/components/VideoPlayer';
import AddToListButton from '@/components/AddToListButton';
import {
  fetchMovieDetails, fetchMovieVideos, fetchMovieCast,
  fetchSimilarMovies, getBackdropUrl, getImageUrl,
} from '@/lib/tmdb';
import { FaPlay, FaStar, FaCalendar, FaTv } from 'react-icons/fa';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const show = await fetchMovieDetails(id, 'tv');
  return {
    title: show ? `${show.name || show.title} - Netflix Clone` : 'TV Show - Netflix Clone',
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

  const trailer = videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube')
    || videos.find((v) => v.site === 'YouTube');

  const title = show.name || show.title || 'Unknown';
  const year = (show.first_air_date || '').substring(0, 4);
  const rating = show.vote_average.toFixed(1);

  return (
    <main className="min-h-screen bg-zinc-950">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[60vw] min-h-[350px] max-h-[700px] overflow-hidden">
        {show.backdrop_path ? (
          <Image
            src={getBackdropUrl(show.backdrop_path)}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            <span className="text-8xl">📺</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="hidden md:block flex-shrink-0 w-52 lg:w-64">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
              {show.poster_path ? (
                <Image
                  src={getImageUrl(show.poster_path, 'w500')}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="256px"
                />
              ) : (
                <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
                  <span className="text-4xl">📺</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-2">{title}</h1>
            {show.tagline && (
              <p className="text-gray-400 italic mb-4 text-sm">&ldquo;{show.tagline}&rdquo;</p>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="flex items-center gap-1 text-yellow-400 font-bold">
                <FaStar size={14} /> {rating}
              </span>
              {year && (
                <span className="flex items-center gap-1 text-gray-300 text-sm">
                  <FaCalendar size={12} /> {year}
                </span>
              )}
              {show.number_of_seasons && (
                <span className="flex items-center gap-1 text-gray-300 text-sm">
                  <FaTv size={12} /> {show.number_of_seasons} Season{show.number_of_seasons > 1 ? 's' : ''}
                </span>
              )}
              {show.number_of_episodes && (
                <span className="text-gray-400 text-sm">{show.number_of_episodes} Episodes</span>
              )}
              <span className="border border-gray-500 text-gray-300 px-2 py-0.5 text-xs rounded">
                {show.status || 'Unknown'}
              </span>
            </div>

            {show.genres && show.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {show.genres.map((genre) => (
                  <span key={genre.id} className="bg-zinc-800 text-gray-300 text-xs px-3 py-1 rounded-full border border-zinc-700">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 max-w-2xl">
              {show.overview}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-black font-bold px-6 py-2.5 rounded hover:bg-white/80 transition-colors"
                >
                  <FaPlay size={14} /> Play Trailer
                </a>
              )}
              <AddToListButton movie={show} />
            </div>
          </div>
        </div>

        {trailer && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-white mb-4">🎬 Trailer</h2>
            <VideoPlayer videoKey={trailer.key} title={title} />
          </div>
        )}

        {cast.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-white mb-4">🎭 Cast</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
              {cast.map((person) => (
                <div key={person.id} className="flex-shrink-0 text-center" style={{ width: '80px' }}>
                  <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden bg-zinc-700 mb-2">
                    {person.profile_path ? (
                      <Image
                        src={getImageUrl(person.profile_path, 'w185')}
                        alt={person.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                    )}
                  </div>
                  <p className="text-white text-xs font-medium">{person.name}</p>
                  <p className="text-gray-500 text-xs">{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {similar.length > 0 && (
          <div className="mt-10">
            <MovieRow title="More Like This" movies={similar} />
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
