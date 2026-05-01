'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaPlay, FaPlus, FaCheck, FaThumbsUp, FaChevronDown } from 'react-icons/fa';
import { Movie } from '@/types';
import { getImageUrl } from '@/lib/tmdb';
import { useMyList } from '@/store/useMyList';

interface MovieCardProps {
  movie: Movie;
  isTop10?: boolean;
}

export default function MovieCard({ movie, isTop10 = false }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { addToList, removeFromList, isInList } = useMyList();
  const router = useRouter();

  const title = movie.title || movie.name || 'Untitled';
  const inList = isInList(movie.id);
  const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
  const year = (movie.release_date || movie.first_air_date || '').substring(0, 4);
  const rating = Math.round(movie.vote_average * 10);

  const handleClick = () => {
    // Navigate to a dedicated detail page or open a modal
    router.push(`/${mediaType}/${movie.id}`);
  };

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 400); // Delay to avoid flashing on quick mouse passes
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(false);
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
      style={{ width: '100%', height: '100%' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Poster */}
      <div className={`relative ${isTop10 ? 'aspect-[2/3]' : 'aspect-video md:aspect-[16/9]'} rounded-md overflow-hidden bg-zinc-800 transition-all duration-300`}>
        {/* We use backdrop_path for normal cards to look like Netflix rows, but poster_path for Top 10 */}
        {((isTop10 ? movie.poster_path : movie.backdrop_path) || movie.poster_path) && !imageError ? (
          <Image
            src={getImageUrl((isTop10 ? movie.poster_path : movie.backdrop_path) || movie.poster_path, 'w342')}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 15vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-900 p-2">
            <span className="text-3xl mb-2">🎬</span>
            <span className="text-xs text-gray-400 text-center line-clamp-2 px-2">{title}</span>
          </div>
        )}
      </div>

      {/* Expanded Hover Card - Desktop only */}
      {isHovered && (
        <div className="hidden md:block absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] min-w-[300px] bg-[#141414] rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.9)] overflow-hidden animate-scale-up border border-zinc-800">
          {/* Backdrop image */}
          <div className="relative aspect-video bg-zinc-800 cursor-pointer" onClick={handleClick}>
            {movie.backdrop_path || movie.poster_path ? (
              <Image
                src={getImageUrl(movie.backdrop_path || movie.poster_path, 'w500')}
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
            
            <div className="absolute inset-0 bg-black/10 transition-colors hover:bg-transparent" />
            <div className="absolute bottom-2 left-3 font-bold text-white drop-shadow-md text-sm truncate w-[90%]">
               {title}
            </div>
          </div>

          {/* Card Info */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-white">
                <button
                  onClick={(e) => { e.stopPropagation(); handleClick(); }}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors text-black btn-hover-effect"
                >
                  <FaPlay size={12} className="ml-1" />
                </button>
                <button
                  onClick={handleListToggle}
                  className="w-8 h-8 rounded-full border-2 border-gray-400/70 flex items-center justify-center hover:border-white transition-colors bg-[#2a2a2a]/60 hover:bg-[#2a2a2a] btn-hover-effect"
                >
                  {inList ? (
                    <FaCheck size={12} className="text-white" />
                  ) : (
                    <FaPlus size={12} className="text-white" />
                  )}
                </button>
                <button className="w-8 h-8 rounded-full border-2 border-gray-400/70 flex items-center justify-center hover:border-white transition-colors bg-[#2a2a2a]/60 hover:bg-[#2a2a2a] btn-hover-effect">
                  <FaThumbsUp size={12} className="text-white" />
                </button>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleClick(); }}
                className="w-8 h-8 rounded-full border-2 border-gray-400/70 flex items-center justify-center hover:border-white transition-colors bg-[#2a2a2a]/60 hover:bg-[#2a2a2a] text-white"
              >
                <FaChevronDown size={12} />
              </button>
            </div>

            <div className="flex items-center gap-2 text-[13px] font-semibold mb-1">
              <span className="text-[#46d369]">{rating}% Match</span>
              <span className="border border-gray-600 text-gray-300 px-1 py-0.5 rounded-sm text-[10px]">
                {movie.adult ? '18+' : '13+'}
              </span>
              <span className="text-gray-300">{year}</span>
              <span className="border border-gray-600 text-gray-300 px-1 py-0.5 rounded-sm text-[10px]">
                HD
              </span>
            </div>
            
            <div className="text-gray-400 text-[12px] flex items-center gap-1.5 mt-2">
               <span className="text-white">Action</span>
               <span className="w-1 h-1 bg-gray-600 rounded-full inline-block"></span>
               <span className="text-white">Thriller</span>
               <span className="w-1 h-1 bg-gray-600 rounded-full inline-block"></span>
               <span className="text-white">Drama</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
