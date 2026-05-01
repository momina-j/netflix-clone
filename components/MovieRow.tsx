'use client';

import { useRef, useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Movie } from '@/types';
import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
  isTop10?: boolean;
}

export default function MovieRow({ title, movies, isLoading = false, isTop10 = false }: MovieRowProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const slide = (direction: 'left' | 'right') => {
    if (!wrapperRef.current || !trackRef.current) return;
    
    const clientWidth = wrapperRef.current.clientWidth;
    const trackWidth = trackRef.current.scrollWidth;
    
    // Slide by 80% of the visible width
    const slideAmount = clientWidth * 0.8;
    
    if (direction === 'left') {
      setTranslateX(prev => {
        const newTranslate = prev + slideAmount;
        return newTranslate > 0 ? 0 : newTranslate;
      });
    } else {
      const maxSlide = -(trackWidth - clientWidth);
      setTranslateX(prev => {
        const newTranslate = prev - slideAmount;
        return newTranslate < maxSlide ? maxSlide : newTranslate;
      });
    }
  };

  useEffect(() => {
    if (wrapperRef.current && trackRef.current) {
      const clientWidth = wrapperRef.current.clientWidth;
      const trackWidth = trackRef.current.scrollWidth;
      const maxSlide = -(trackWidth - clientWidth);
      setShowRightArrow(translateX > maxSlide + 10 && trackWidth > clientWidth);
    }
  }, [translateX, movies]);

  const showLeftArrow = translateX < -10;

  if (isLoading) {
    return (
      <div className="mb-6 md:mb-10 relative z-20">
        <h2 className="text-[#e5e5e5] text-[1.2vw] md:text-[1.4vw] font-bold mb-2 md:mb-4 px-4 md:px-12">{title}</h2>
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
    <div className="mb-6 md:mb-10 group/row relative z-20 hover:z-50 focus-within:z-50">
      <h2 className="text-[#e5e5e5] text-lg md:text-[1.4vw] font-bold mb-2 md:mb-4 px-4 md:px-12 tracking-wide hover:text-white transition-colors cursor-pointer inline-block">
        {title}
      </h2>

      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => slide('left')}
            className="absolute left-0 top-0 bottom-0 z-30 w-10 md:w-12 flex items-center justify-center bg-black/50 backdrop-blur-sm opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:bg-black/70 hover:w-12 md:hover:w-14"
          >
            <FaChevronLeft size={24} className="text-white drop-shadow-md" />
          </button>
        )}

        {/* Row Wrapper - Overflow Visible to allow hover cards to pop out */}
        <div ref={wrapperRef} className="w-full overflow-visible">
          {/* Slider Track */}
          <div
            ref={trackRef}
            className="flex px-4 md:px-12 pb-16 pt-16 -mt-14 -mb-6 gap-2 md:gap-3 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(${translateX}px)` }}
          >
            {movies.map((movie, index) => (
              <div
                key={`${movie.id}-${movie.media_type}`}
                className="flex-shrink-0 relative group/item hover:z-[100]"
                style={{
                  width: isTop10 ? 'clamp(140px, 18vw, 240px)' : 'clamp(120px, 15vw, 200px)',
                }}
              >
                {isTop10 ? (
                  <div className="flex items-center w-full h-full">
                    {/* Big Number */}
                    <div className="w-[40%] flex justify-end shrink-0 -mr-4 md:-mr-6 z-0 pointer-events-none text-black font-black"
                         style={{ 
                           fontSize: 'clamp(80px, 14vw, 200px)', 
                           lineHeight: '0.8',
                           letterSpacing: '-5px',
                           WebkitTextStroke: '2px #595959',
                           textShadow: '0px 0px 10px rgba(0,0,0,0.5)'
                         }}>
                      {index + 1}
                    </div>
                    <div className="w-[60%] shrink-0 z-10">
                      <MovieCard movie={movie} isTop10={true} />
                    </div>
                  </div>
                ) : (
                  <MovieCard movie={movie} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => slide('right')}
            className="absolute right-0 top-0 bottom-0 z-30 w-10 md:w-12 flex items-center justify-center bg-black/50 backdrop-blur-sm opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:bg-black/70 hover:w-12 md:hover:w-14"
          >
            <FaChevronRight size={24} className="text-white drop-shadow-md" />
          </button>
        )}
      </div>
    </div>
  );
}
