import { useQuery } from '@tanstack/react-query';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { tmdbService } from '../services/tmdb';
import { MovieGrid } from '../components/movie/MovieGrid';

export const Trending = () => {
  const { data: trending, isLoading, isError } = useQuery({
    queryKey: ['trending', 'day', 'full'],
    queryFn: () => tmdbService.getTrending('day'),
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-3 pb-6 border-b border-white/10">
        <TrendingUp className="w-8 h-8 text-orange-500" />
        <div>
          <h1 className="text-3xl font-bold text-white">Top 10 Trending Today</h1>
          <p className="text-gray-400">The most popular movies right now</p>
        </div>
      </div>

      {isError ? (
        <div className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Failed to load trending</h3>
          <p className="text-gray-400">Please check your connection and try again.</p>
        </div>
      ) : isLoading ? (
        <div className="h-[400px] rounded-2xl bg-dark-800/50 animate-pulse border border-white/5" />
      ) : trending?.results && trending.results.length > 0 ? (
        <MovieGrid movies={trending.results.slice(0, 10)} />
      ) : null}
    </div>
  );
};
