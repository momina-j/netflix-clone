'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import { Movie } from '@/types';
import { getBackdropUrl, fetchMovieVideos, fetchMovieImages, getImageUrl } from '@/lib/tmdb';
import ReactPlayer from 'react-player';

interface BannerProps {
  movies: Movie[];
}

export default function Banner({ movies }: BannerProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (movies && movies.length > 0) {
      // Pick a random movie from trending to be the hero
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      setMovie(randomMovie);
    }
  }, [movies]);

  useEffect(() => {
    async function fetchMedia() {
      if (!movie) return;
      const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
      
      const [videos, images] = await Promise.all([
        fetchMovieVideos(movie.id, mediaType as 'movie' | 'tv'),
        fetchMovieImages(movie.id, mediaType as 'movie' | 'tv')
      ]);

      // Look for a trailer or teaser
      const trailer = videos.find((v) => v.type === 'Trailer' || v.type === 'Teaser');
      if (trailer) {
        setTrailerKey(trailer.key);
        // Delay showing video to allow image to load first
        setTimeout(() => setShowVideo(true), 3000);
      } else {
        setShowVideo(false);
      }

      // Look for a logo in English
      if (images && images.logos && images.logos.length > 0) {
        const logo = images.logos.find((l: any) => l.iso_639_1 === 'en') || images.logos[0];
        setLogoUrl(logo.file_path);
      } else {
        setLogoUrl(null);
      }
    }
    fetchMedia();
  }, [movie]);

  if (!movie) return <div className="h-[80vh] bg-[#141414] animate-pulse" />;

  const title = movie.title || movie.name || 'Unknown Title';
  const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');

  const handlePlay = () => {
    router.push(`/${mediaType}/${movie.id}`);
  };

  const handleMoreInfo = () => {
    router.push(`/${mediaType}/${movie.id}`);
  };

  return (
    <div className="relative w-full h-[85vh] min-h-[500px] max-h-[1000px] bg-[#141414] overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0 w-full h-full">
        {trailerKey && showVideo ? (
          <div className="relative w-full h-[130%] -top-[15%]">
             <ReactPlayer
              url={`https://www.youtube.com/watch?v=${trailerKey}`}
              width="100%"
              height="100%"
              playing={true}
              muted={true}
              loop={true}
              controls={false}
              config={{
                youtube: {
                  playerVars: {
                    disablekb: 1,
                    modestbranding: 1,
                    showinfo: 0,
                    rel: 0,
                    iv_load_policy: 3
                  }
                }
              }}
              style={{ position: 'absolute', top: 0, left: 0, opacity: 1, transition: 'opacity 1s ease-in-out' }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 transition-opacity duration-1000 opacity-100">
            {movie.backdrop_path && (
              <Image
                src={getBackdropUrl(movie.backdrop_path)}
                alt={title}
                fill
                className="object-cover object-top scale-105"
                priority
                sizes="100vw"
              />
            )}
          </div>
        )}
      </div>

      {/* Cinematic Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/50 to-transparent w-[75%]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent top-auto h-[60%]" />
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="absolute bottom-[30%] md:bottom-[35%] left-4 md:left-12 max-w-xl lg:max-w-2xl z-10">
        
        {/* Animated Title or Logo */}
        {logoUrl ? (
          <div className="relative w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] h-[100px] md:h-[140px] mb-6 animate-fade-in">
            <Image
              src={getImageUrl(logoUrl, 'w500')}
              alt={title}
              fill
              className="object-contain object-left-bottom drop-shadow-2xl"
            />
          </div>
        ) : (
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight text-shadow-lg animate-fade-in uppercase tracking-wider">
            {title}
          </h1>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-3 mb-4 animate-fade-in animation-delay-100 font-medium">
          <span className="text-[#46d369] font-bold text-[15px]">
            {Math.round(movie.vote_average * 10)}% Match
          </span>
          <span className="text-white text-xs border border-white/40 px-1.5 py-0.5 rounded-sm bg-black/40">
            {movie.adult ? '18+' : '13+'}
          </span>
          <span className="text-gray-300 text-sm">
            {(movie.release_date || movie.first_air_date || '').substring(0, 4)}
          </span>
          <span className="text-white text-[10px] border border-white/40 px-1.5 rounded-sm">
            HD
          </span>
        </div>

        {/* Overview */}
        <p className="text-white/90 text-[15px] md:text-[17px] line-clamp-3 mb-6 drop-shadow-md max-w-lg md:max-w-xl animate-fade-in animation-delay-300 font-medium leading-snug">
          {movie.overview}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 animate-fade-in animation-delay-500">
          <button
            onClick={handlePlay}
            className="flex items-center gap-2.5 bg-white text-black font-bold px-6 md:px-8 py-2 md:py-2.5 rounded hover:bg-white/80 transition-colors text-[15px] md:text-base btn-hover-effect"
          >
            <FaPlay size={18} /> Play
          </button>
          <button
            onClick={handleMoreInfo}
            className="flex items-center gap-2.5 bg-zinc-500/70 text-white font-bold px-6 md:px-8 py-2 md:py-2.5 rounded hover:bg-zinc-500/50 transition-colors text-[15px] md:text-base backdrop-blur-md btn-hover-effect"
          >
            <FaInfoCircle size={20} /> More Info
          </button>
        </div>
      </div>
    </div>
  );
}
