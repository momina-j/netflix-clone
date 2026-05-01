import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Movie } from '@/types';

interface MyListStore {
  myList: Movie[];
  addToList: (movie: Movie) => void;
  removeFromList: (movieId: number) => void;
  isInList: (movieId: number) => boolean;
  clearList: () => void;
}

export const useMyList = create<MyListStore>()(
  persist(
    (set, get) => ({
      myList: [],
      addToList: (movie: Movie) => {
        const { myList } = get();
        if (!myList.find((m) => m.id === movie.id)) {
          set({ myList: [...myList, movie] });
        }
      },
      removeFromList: (movieId: number) => {
        set({ myList: get().myList.filter((m) => m.id !== movieId) });
      },
      isInList: (movieId: number) => {
        return get().myList.some((m) => m.id === movieId);
      },
      clearList: () => set({ myList: [] }),
    }),
    {
      name: 'netflix-my-list',
    }
  )
);
