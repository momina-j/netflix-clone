'use client';

import { useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Movie } from '@/types';
import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
}

export default function MovieRow({ title, movies, isLoading = false }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;
    const scrollAmount = rowRef.current.offsetWidth * 0.8;
    rowRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-white text-lg md:text-xl font-bold mb-3 px-4 md:px-12">{title}</h2>
        <div className="flex gap-2 px-4 md:px-12 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) return null;

  return (
    <div className="mb-8 group/row relative">
      <h2 className="text-white text-lg md:text-xl font-bold mb-3 px-4 md:px-12">{title}</h2>

      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 w-10 md:w-14 flex items-center justify-center bg-gradient-to-r from-zinc-950/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity hover:from-zinc-950"
          >
            <FaChevronLeft size={20} className="text-white" />
          </button>
        )}

        {/* Row */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex gap-2 overflow-x-auto hide-scrollbar px-4 md:px-12 pb-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {movies.map((movie) => (
            <div
              key={`${movie.id}-${movie.media_type}`}
              className="flex-shrink-0"
              style={{
                width: 'clamp(120px, 15vw, 200px)',
                scrollSnapAlign: 'start',
              }}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 w-10 md:w-14 flex items-center justify-center bg-gradient-to-l from-zinc-950/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity hover:from-zinc-950"
          >
            <FaChevronRight size={20} className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
