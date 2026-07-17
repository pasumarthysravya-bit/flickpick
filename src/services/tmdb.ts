import type { Movie, MovieDetails, PaginatedResponse, Genre, PersonDetails, MultiSearchResult } from '../types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const fetchFromTMDB = async <T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> => {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    ...params,
  });

  const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`);

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const tmdbService = {
  // Get genres list
  getGenres: () => 
    fetchFromTMDB<{ genres: Genre[] }>('/genre/movie/list'),

  // Discover movies with filters
  discoverMovies: (params: {
    with_original_language?: string;
    primary_release_year?: number;
    with_genres?: string;
    sort_by?: string;
    page?: number;
    'vote_average.gte'?: number;
    'vote_count.gte'?: number;
    with_runtime_gte?: number;
    with_runtime_lte?: number;
    with_origin_country?: string;
    with_watch_providers?: string;
    watch_region?: string;
    certification_country?: string;
    'certification.lte'?: string;
    'primary_release_date.gte'?: string;
    'primary_release_date.lte'?: string;
  }) => fetchFromTMDB<PaginatedResponse<Movie>>('/discover/movie', params),

  // Get movie details including credits, videos, and similar
  getMovieDetails: (id: number) =>
    fetchFromTMDB<MovieDetails>(`/movie/${id}`, {
      append_to_response: 'credits,videos,similar',
    }),

  // Get trending movies
  getTrending: (timeWindow: 'day' | 'week' = 'day') =>
    fetchFromTMDB<PaginatedResponse<Movie>>(`/trending/movie/${timeWindow}`),

  // Search movies by query
  searchMovies: (query: string, page: number = 1) =>
    fetchFromTMDB<PaginatedResponse<Movie>>('/search/movie', { query, page }),

  // Search movies, TV, and people
  searchMulti: (query: string, page: number = 1) =>
    fetchFromTMDB<PaginatedResponse<MultiSearchResult>>('/search/multi', { query, page }),

  // Get person details including movie credits
  getPersonDetails: (id: number) =>
    fetchFromTMDB<PersonDetails>(`/person/${id}`, {
      append_to_response: 'movie_credits',
    }),
};
