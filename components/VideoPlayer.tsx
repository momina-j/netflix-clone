'use client';

import { useState } from 'react';
import { FaPlay, FaExpand } from 'react-icons/fa';

interface VideoPlayerProps {
  videoKey: string;
  title: string;
}

export default function VideoPlayer({ videoKey, title }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative w-full aspect-video bg-zinc-900 rounded-xl overflow-hidden shadow-2xl">
      {!playing ? (
        // Thumbnail / click to play
        <div className="relative w-full h-full">
          <img
            src={`https://img.youtube.com/vi/${videoKey}/maxresdefault.jpg`}
            alt={`${title} trailer`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoKey}/hqdefault.jpg`;
            }}
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <button
              onClick={() => setPlaying(true)}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
            >
              <FaPlay size={24} className="text-white ml-1" />
            </button>
          </div>
          <div className="absolute bottom-4 right-4">
            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
              Click to play trailer
            </span>
          </div>
        </div>
      ) : (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
          title={`${title} - Trailer`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      )}
    </div>
  );
}
