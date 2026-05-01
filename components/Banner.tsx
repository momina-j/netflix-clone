'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaPlay, FaInfoCircle, FaPlus, FaCheck } from 'react-icons/fa';
import { Movie } from '@/types';
import { getBackdropUrl } from '@/lib/tmdb';
import { useMyList } from '@/store/useMyList';

interface BannerProps {
  movies: Movie[];
}

export default function Banner({ movies }: BannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { addToList, removeFromList, isInList } = useMyList();
  const router = useRouter();

  const movie = movies[currentIndex];

  // Auto-rotate banner
  useEffect(() => {
    if (movies.length <= 1) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
        setIsTransitioning(false);
      }, 500);
    }, 8000);
    return () => clearInterval(interval);
  }, [movies.length]);

  if (!movie) return null;

  const title = movie.title || movie.name || 'Unknown Title';
  const inList = isInList(movie.id);
  const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');

  const handlePlay = () => {
    router.push(`/${mediaType}/${movie.id}`);
  };

  const handleMoreInfo = () => {
    router.push(`/${mediaType}/${movie.id}`);
  };

  const handleListToggle = () => {
    if (inList) {
      removeFromList(movie.id);
    } else {
      addToList(movie);
    }
  };

  return (
    <div className="relative w-full h-[56vw] min-h-[400px] max-h-[780px] overflow-hidden bg-zinc-900">
      {/* Backdrop Image */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {movie.backdrop_path ? (
          <Image
            src={getBackdropUrl(movie.backdrop_path)}
            alt={title}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            <span className="text-6xl">🎬</span>
          </div>
        )}
      </div>

      {/* Gradients */}
      <div className="absolute inset-0 banner-gradient" />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 banner-bottom-gradient" />

      {/* Content */}
      <div
        className={`absolute bottom-[20%] md:bottom-[25%] left-4 md:left-12 max-w-xl lg:max-w-2xl transition-all duration-700 ${
          isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight drop-shadow-2xl">
          {title}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-green-400 font-bold text-sm">
            {Math.round(movie.vote_average * 10)}% Match
          </span>
          <span className="text-gray-300 text-sm border border-gray-500 px-1">
            {movie.adult ? '18+' : '13+'}
          </span>
          <span className="text-gray-300 text-sm">
            {(movie.release_date || movie.first_air_date || '').substring(0, 4)}
          </span>
        </div>

        {/* Overview */}
        <p className="text-gray-200 text-sm md:text-base line-clamp-3 mb-5 drop-shadow max-w-lg">
          {movie.overview}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handlePlay}
            className="flex items-center gap-2 bg-white text-black font-bold px-5 py-2.5 rounded hover:bg-white/80 transition-colors text-sm md:text-base"
          >
            <FaPlay size={14} /> Play
          </button>
          <button
            onClick={handleMoreInfo}
            className="flex items-center gap-2 bg-gray-500/70 text-white font-semibold px-5 py-2.5 rounded hover:bg-gray-500/50 transition-colors text-sm md:text-base backdrop-blur-sm"
          >
            <FaInfoCircle size={14} /> More Info
          </button>
          <button
            onClick={handleListToggle}
            className="flex items-center gap-2 bg-zinc-800/80 text-white px-4 py-2.5 rounded hover:bg-zinc-700 transition-colors border border-gray-500 backdrop-blur-sm"
            title={inList ? 'Remove from My List' : 'Add to My List'}
          >
            {inList ? <FaCheck size={14} className="text-green-400" /> : <FaPlus size={14} />}
          </button>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-4 right-4 md:right-12 flex gap-1.5">
        {movies.slice(0, 5).map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentIndex(idx);
                setIsTransitioning(false);
              }, 300);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? 'bg-red-600 w-4' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
