'use client';

import { FaPlus, FaCheck } from 'react-icons/fa';
import { Movie, MovieDetail } from '@/types';
import { useMyList } from '@/store/useMyList';

interface AddToListButtonProps {
  movie: Movie | MovieDetail;
}

export default function AddToListButton({ movie }: AddToListButtonProps) {
  const { addToList, removeFromList, isInList } = useMyList();
  const inList = isInList(movie.id);

  const handleClick = () => {
    if (inList) {
      removeFromList(movie.id);
    } else {
      addToList(movie as Movie);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded font-semibold transition-all text-sm ${
        inList
          ? 'bg-green-600/20 border border-green-500 text-green-400 hover:bg-red-600/20 hover:border-red-500 hover:text-red-400'
          : 'bg-zinc-800 border border-gray-500 text-white hover:bg-zinc-700'
      }`}
    >
      {inList ? (
        <>
          <FaCheck size={12} /> In My List
        </>
      ) : (
        <>
          <FaPlus size={12} /> My List
        </>
      )}
    </button>
  );
}
