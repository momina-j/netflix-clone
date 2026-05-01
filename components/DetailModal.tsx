'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaPlay, FaPlus, FaThumbsUp, FaTimes } from 'react-icons/fa';
import { Movie, MovieDetail, Video, Cast } from '@/types';
import { getBackdropUrl, getImageUrl } from '@/lib/tmdb';
import AddToListButton from '@/components/AddToListButton';

interface DetailModalProps {
  movie: MovieDetail;
  videos: Video[];
  cast: Cast[];
  similar: Movie[];
  isModal?: boolean;
}

export default function DetailModal({ movie, videos, cast, similar, isModal = true }: DetailModalProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Lock body scroll when modal is open
    if (isModal) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isModal]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      router.back();
    }, 300); // Wait for exit animation
  };

  const trailer = videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube')
    || videos.find((v) => v.site === 'YouTube');

  const title = movie.title || movie.name || 'Unknown';
  const year = (movie.release_date || movie.first_air_date || '').substring(0, 4);
  const rating = Math.round((movie.vote_average || 0) * 10);
  const hours = movie.runtime ? Math.floor(movie.runtime / 60) : null;
  const minutes = movie.runtime ? movie.runtime % 60 : null;

  const content = (
    <div className={`w-full max-w-5xl mx-auto bg-[#181818] md:rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] relative border-x border-b border-zinc-800 ${isModal ? 'mt-8 mb-16' : ''}`}>
      
      {/* Close button */}
      {isModal && (
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 bg-[#181818] rounded-full flex items-center justify-center text-white hover:bg-zinc-800 transition-colors border border-zinc-700 hover-glow"
        >
          <FaTimes size={20} />
        </button>
      )}

      {/* Media Header */}
      <div className="relative w-full aspect-video bg-black">
        {trailer ? (
          <div className="w-full h-[140%] -top-[20%] relative overflow-hidden pointer-events-none">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${trailer.key}`}
              allow="autoplay; encrypted-media"
            />
          </div>
        ) : movie.backdrop_path ? (
          <Image
            src={getBackdropUrl(movie.backdrop_path)}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        ) : (
           <div className="w-full h-full flex items-center justify-center text-6xl">🎬</div>
        )}
        
        {/* Gradients to blend video into background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/20 to-transparent bottom-0 h-full" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#181818] via-[#181818]/80 to-transparent" />
        
        {/* Title & Primary Actions */}
        <div className="absolute bottom-10 left-10 right-10">
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 drop-shadow-2xl w-[80%] leading-tight uppercase tracking-wider text-shadow-lg">{title}</h1>
           <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 bg-white text-black font-bold px-8 py-2.5 rounded hover:bg-gray-200 transition-colors btn-hover-effect">
               <FaPlay size={16} /> Play
             </button>
             <AddToListButton movie={movie as any} />
             <button className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white transition-colors bg-[#2a2a2a]/60 hover:bg-[#2a2a2a] btn-hover-effect">
               <FaThumbsUp size={16} />
             </button>
           </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="px-10 py-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-[15px]">
        <div className="col-span-2">
          <div className="flex items-center gap-3 font-semibold mb-6">
            <span className="text-[#46d369]">{rating}% Match</span>
            <span className="text-gray-300">{year}</span>
            <span className="border border-gray-500 text-gray-300 px-1.5 py-0.5 rounded-sm text-[12px]">
              {movie.adult ? '18+' : '13+'}
            </span>
            {hours !== null && (
              <span className="text-gray-300">{hours}h {minutes}m</span>
            )}
            <span className="border border-gray-500 text-gray-300 px-1.5 py-0.5 rounded-sm text-[12px]">
              HD
            </span>
          </div>
          
          <p className="text-[16px] leading-relaxed text-white/90 mb-6 font-medium">
            {movie.overview}
          </p>
        </div>

        <div className="col-span-1 text-[14px]">
          {cast.length > 0 && (
            <div className="mb-4">
              <span className="text-gray-500">Cast: </span>
              <span className="text-white/90">{cast.slice(0, 5).map(c => c.name).join(', ')}</span>
              <span className="italic text-gray-500 cursor-pointer hover:underline">, more</span>
            </div>
          )}
          {movie.genres && movie.genres.length > 0 && (
            <div className="mb-4">
              <span className="text-gray-500">Genres: </span>
              <span className="text-white/90">{movie.genres.map(g => g.name).join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* More Like This Grid */}
      {similar.length > 0 && (
        <div className="px-10 py-8 bg-[#181818]">
          <h3 className="text-2xl font-bold mb-6 text-white tracking-wide">More Like This</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {similar.slice(0, 9).map((simMovie) => (
              <div key={simMovie.id} className="bg-[#2f2f2f] rounded overflow-hidden relative cursor-pointer group hover-glow">
                <div className="relative aspect-video">
                  {simMovie.backdrop_path || simMovie.poster_path ? (
                    <Image
                      src={getImageUrl(simMovie.backdrop_path || simMovie.poster_path, 'w300')}
                      alt={simMovie.title || simMovie.name || ''}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">🎬</div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                     <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center btn-hover-effect">
                        <FaPlay size={16} className="text-white ml-1" />
                     </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-[#46d369] font-bold text-sm">{Math.round((simMovie.vote_average || 0) * 10)}% Match</span>
                     <span className="border border-gray-500 text-gray-300 px-1 py-0.5 rounded-sm text-[10px]">
                       {(simMovie.release_date || simMovie.first_air_date || '').substring(0, 4)}
                     </span>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-3 leading-snug">{simMovie.overview}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (!isModal) {
    return content;
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />
      
      {/* Modal Scroll Container */}
      <div className={`fixed inset-0 z-[101] overflow-y-auto overflow-x-hidden hide-scrollbar transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}>
        <div className="min-h-full flex items-start justify-center p-0 md:p-4 text-center">
          {content}
        </div>
      </div>
    </>
  );
}
