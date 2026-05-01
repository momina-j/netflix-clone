'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaPlay, FaPlus, FaCheck, FaThumbsUp, FaChevronDown } from 'react-icons/fa';
import { Movie } from '@/types';
import { getImageUrl } from '@/lib/tmdb';
import { useMyList } from '@/store/useMyList';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToList, removeFromList, isInList } = useMyList();
  const router = useRouter();

  const title = movie.title || movie.name || 'Untitled';
  const inList = isInList(movie.id);
  const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
  const year = (movie.release_date || movie.first_air_date || '').substring(0, 4);
  const rating = Math.round(movie.vote_average * 10);

  const handleClick = () => {
    router.push(`/${mediaType}/${movie.id}`);
  };

  const handleListToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inList) {
      removeFromList(movie.id);
    } else {
      addToList(movie);
    }
  };

  return (
    <div
      className="relative cursor-pointer group flex-shrink-0"
      style={{ width: '100%' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] rounded overflow-hidden bg-zinc-800">
        {movie.poster_path && !imageError ? (
          <Image
            src={getImageUrl(movie.poster_path, 'w342')}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 15vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-900 p-2">
            <span className="text-3xl mb-2">🎬</span>
            <span className="text-xs text-gray-400 text-center line-clamp-2">{title}</span>
          </div>
        )}

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-black/20 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Expanded Hover Card - Desktop only */}
      {isHovered && (
        <div className="hidden md:block absolute z-20 top-0 left-1/2 -translate-x-1/2 w-[180%] bg-zinc-900 rounded-lg shadow-2xl overflow-hidden border border-zinc-700 -translate-y-2">
          {/* Backdrop/Poster image */}
          <div className="relative aspect-video bg-zinc-800">
            {movie.backdrop_path || movie.poster_path ? (
              <Image
                src={getImageUrl(movie.backdrop_path || movie.poster_path, 'w300')}
                alt={title}
                fill
                className="object-cover"
                sizes="300px"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center">
                <span className="text-4xl">🎬</span>
              </div>
            )}
            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                <FaPlay size={12} className="text-black ml-0.5" />
              </div>
            </div>
          </div>

          {/* Card Info */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => { e.stopPropagation(); handleClick(); }}
                  className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:bg-white/80"
                >
                  <FaPlay size={9} className="text-black ml-0.5" />
                </button>
                <button
                  onClick={handleListToggle}
                  className="w-7 h-7 rounded-full border border-gray-500 flex items-center justify-center hover:border-white"
                >
                  {inList ? (
                    <FaCheck size={10} className="text-green-400" />
                  ) : (
                    <FaPlus size={10} className="text-white" />
                  )}
                </button>
                <button className="w-7 h-7 rounded-full border border-gray-500 flex items-center justify-center hover:border-white">
                  <FaThumbsUp size={9} className="text-white" />
                </button>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleClick(); }}
                className="w-7 h-7 rounded-full border border-gray-500 flex items-center justify-center hover:border-white"
              >
                <FaChevronDown size={10} className="text-white" />
              </button>
            </div>

            <p className="text-white font-semibold text-xs mb-1 truncate">{title}</p>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-green-400 font-bold">{rating}%</span>
              {year && <span className="text-gray-400">{year}</span>}
              <span className="border border-gray-500 text-gray-400 px-1 text-[10px]">
                {movie.adult ? '18+' : 'PG-13'}
              </span>
            </div>

            {movie.overview && (
              <p className="text-gray-400 text-[11px] mt-1.5 line-clamp-2">{movie.overview}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
