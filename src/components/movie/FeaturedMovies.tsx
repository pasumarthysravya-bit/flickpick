import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { tmdbService } from '../../services/tmdb';
import { Star, Calendar, TrendingUp, Award, PlayCircle } from 'lucide-react';
import type { Movie } from '../../types';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w780';

const FeaturedCard = ({ movie, title, icon: Icon, isLoading }: { movie?: Movie, title: string, icon: any, isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="relative h-48 md:h-64 rounded-2xl bg-dark-800/50 animate-pulse border border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />
      </div>
    );
  }

  if (!movie) return null;

  return (
    <Link 
      to={`/movie/${movie.id}`}
      className="group relative h-48 md:h-64 rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-colors block"
    >
      <img
        src={`${IMAGE_BASE}${movie.backdrop_path || movie.poster_path}`}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
      
      <div className="absolute top-3 left-3 px-3 py-1 bg-dark-900/80 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
        <Icon className="w-4 h-4 text-orange-500" />
        <span className="text-xs font-bold text-white uppercase tracking-wider">{title}</span>
      </div>

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <PlayCircle className="w-12 h-12 text-orange-500" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg md:text-xl font-bold text-white line-clamp-1 mb-1 group-hover:text-orange-500 transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1 text-orange-500 font-medium">
            <Star className="w-4 h-4 fill-current" />
            {movie.vote_average.toFixed(1)}
          </span>
          <span className="text-gray-400">
            {new Date(movie.release_date).getFullYear()}
          </span>
        </div>
      </div>
    </Link>
  );
};

export const FeaturedMovies = () => {
  const { data: weekData, isLoading: weekLoading } = useQuery({
    queryKey: ['featured', 'week'],
    queryFn: () => tmdbService.getTrending('week'),
  });

  const { data: monthData, isLoading: monthLoading } = useQuery({
    queryKey: ['featured', 'month'],
    queryFn: () => {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      return tmdbService.discoverMovies({
        sort_by: 'popularity.desc',
        'primary_release_date.gte': date.toISOString().split('T')[0],
      });
    },
  });

  const { data: yearData, isLoading: yearLoading } = useQuery({
    queryKey: ['featured', 'year'],
    queryFn: () => tmdbService.discoverMovies({
      sort_by: 'popularity.desc',
      primary_release_year: new Date().getFullYear(),
    }),
  });

  const weekMovie = weekData?.results[0];
  const monthMovie = monthData?.results[0];
  const yearMovie = yearData?.results[0];

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <FeaturedCard 
          title="Movie of the Week" 
          movie={weekMovie} 
          icon={TrendingUp} 
          isLoading={weekLoading} 
        />
        <FeaturedCard 
          title="Movie of the Month" 
          movie={monthMovie} 
          icon={Calendar} 
          isLoading={monthLoading} 
        />
        <FeaturedCard 
          title="Movie of the Year" 
          movie={yearMovie} 
          icon={Award} 
          isLoading={yearLoading} 
        />
      </div>
    </section>
  );
};
