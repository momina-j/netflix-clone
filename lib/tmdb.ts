import axios from 'axios';
import { Movie, MovieDetail, Video, Cast, SearchResult } from '@/types';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'demo';
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'en-US',
  },
});

// Image URL helpers
export const getImageUrl = (path: string | null, size: string = 'w500') => {
  if (!path) return '/placeholder-movie.jpg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null) => {
  if (!path) return '/placeholder-backdrop.jpg';
  return `${IMAGE_BASE_URL}/original${path}`;
};

// Movie API functions
export const fetchTrending = async (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> => {
  try {
    const { data } = await tmdbApi.get(`/trending/${mediaType}/${timeWindow}`);
    return data.results;
  } catch {
    return getMockMovies();
  }
};

export const fetchTopRated = async (mediaType: 'movie' | 'tv' = 'movie'): Promise<Movie[]> => {
  try {
    const { data } = await tmdbApi.get(`/${mediaType}/top_rated`);
    return data.results;
  } catch {
    return getMockMovies();
  }
};

export const fetchPopular = async (mediaType: 'movie' | 'tv' = 'movie'): Promise<Movie[]> => {
  try {
    const { data } = await tmdbApi.get(`/${mediaType}/popular`);
    return data.results;
  } catch {
    return getMockMovies();
  }
};

export const fetchNowPlaying = async (): Promise<Movie[]> => {
  try {
    const { data } = await tmdbApi.get('/movie/now_playing');
    return data.results;
  } catch {
    return getMockMovies();
  }
};

export const fetchUpcoming = async (): Promise<Movie[]> => {
  try {
    const { data } = await tmdbApi.get('/movie/upcoming');
    return data.results;
  } catch {
    return getMockMovies();
  }
};

export const fetchAiringToday = async (): Promise<Movie[]> => {
  try {
    const { data } = await tmdbApi.get('/tv/airing_today');
    return data.results;
  } catch {
    return getMockMovies();
  }
};

export const fetchMovieDetails = async (movieId: string | number, mediaType: 'movie' | 'tv' = 'movie'): Promise<MovieDetail | null> => {
  try {
    const { data } = await tmdbApi.get(`/${mediaType}/${movieId}`);
    return data;
  } catch {
    return null;
  }
};

export const fetchMovieVideos = async (movieId: string | number, mediaType: 'movie' | 'tv' = 'movie'): Promise<Video[]> => {
  try {
    const { data } = await tmdbApi.get(`/${mediaType}/${movieId}/videos`);
    return data.results;
  } catch {
    return [];
  }
};

export const fetchMovieCast = async (movieId: string | number, mediaType: 'movie' | 'tv' = 'movie'): Promise<Cast[]> => {
  try {
    const { data } = await tmdbApi.get(`/${mediaType}/${movieId}/credits`);
    return data.cast?.slice(0, 10) || [];
  } catch {
    return [];
  }
};

export const fetchSimilarMovies = async (movieId: string | number, mediaType: 'movie' | 'tv' = 'movie'): Promise<Movie[]> => {
  try {
    const { data } = await tmdbApi.get(`/${mediaType}/${movieId}/similar`);
    return data.results;
  } catch {
    return getMockMovies();
  }
};

export const fetchMovieImages = async (movieId: string | number, mediaType: 'movie' | 'tv' = 'movie'): Promise<any> => {
  try {
    const { data } = await tmdbApi.get(`/${mediaType}/${movieId}/images`, {
      params: {
        include_image_language: 'en,null',
      }
    });
    return data;
  } catch {
    return null;
  }
};

export const searchMovies = async (query: string, page: number = 1): Promise<SearchResult> => {
  try {
    const { data } = await tmdbApi.get('/search/multi', {
      params: { query, page, include_adult: false },
    });
    return data;
  } catch {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
};

export const fetchByGenre = async (genreId: number, mediaType: 'movie' | 'tv' = 'movie'): Promise<Movie[]> => {
  try {
    const { data } = await tmdbApi.get(`/discover/${mediaType}`, {
      params: { with_genres: genreId, sort_by: 'popularity.desc' },
    });
    return data.results;
  } catch {
    return getMockMovies();
  }
};

// Mock data for when API key is not configured
function getMockMovies(): Movie[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `Sample Movie ${i + 1}`,
    overview: 'This is a sample movie overview. Configure your TMDB API key to see real movies.',
    poster_path: null,
    backdrop_path: null,
    vote_average: 7.5,
    vote_count: 1000,
    release_date: '2024-01-01',
    genre_ids: [28, 12],
    popularity: 100,
    adult: false,
    original_language: 'en',
  }));
}
