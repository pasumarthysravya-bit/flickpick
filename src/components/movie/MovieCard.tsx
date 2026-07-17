import { Link } from 'react-router-dom';
import { Star, Heart, Calendar, Info } from 'lucide-react';
import type { Movie } from '../../types';
import { useFavorites } from '../../hooks/useFavorites';
import { cn } from '../../utils/cn';

interface MovieCardProps {
  movie: Movie;
  featured?: boolean;
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const MovieCard = ({ movie, featured = false }: MovieCardProps) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isFav = isFavorite(movie.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  const formattedDate = new Date(movie.release_date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  if (featured) {
    return (
      <Link to={`/movie/${movie.id}`} className="block group relative rounded-2xl overflow-hidden glass-panel border-white/10 hover:border-orange-500/50 transition-all duration-300">
        <div className="flex flex-col md:flex-row min-h-[300px]">
          <div className="w-full md:w-1/3 shrink-0 relative">
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-dark-900 via-dark-900/60 to-transparent z-10" />
            <img 
              src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'} 
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          
          <div className="flex-1 p-6 z-20 flex flex-col justify-center -mt-20 md:mt-0 bg-gradient-to-t md:bg-gradient-to-r from-dark-900 md:from-transparent">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-orange-500 text-dark-900 text-xs font-bold rounded">#1 Top Match</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold rounded">New Release</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{movie.title}</h2>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-4">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-orange-500" /> {formattedDate}</span>
              <span className="flex items-center gap-1.5 uppercase"><span className="text-orange-500">Language:</span> {movie.original_language}</span>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1 text-orange-500">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-bold text-lg">{movie.vote_average.toFixed(1)}</span>
              </div>
              <span className="text-gray-400 text-sm">({(movie.vote_count / 1000).toFixed(1)}K votes)</span>
            </div>

            <p className="text-gray-300 line-clamp-3 mb-6 max-w-2xl">{movie.overview}</p>
            
            <div className="flex items-center gap-3 mt-auto">
              <button 
                onClick={handleFavoriteClick}
                className={cn(
                  "btn-secondary flex items-center gap-2",
                  isFav && "text-red-500 border-red-500/50 bg-red-500/10"
                )}
              >
                <Heart className={cn("w-4 h-4", isFav && "fill-current")} />
                {isFav ? 'Saved to Favorites' : 'Add to Favorites'}
              </button>
              <span className="btn-secondary flex items-center gap-2">
                <Info className="w-4 h-4" /> Details
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/movie/${movie.id}`} className="group relative rounded-xl overflow-hidden glass-panel border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-[2/3] relative overflow-hidden">
        <img 
          src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'} 
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent opacity-80" />
        
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-dark-900/50 backdrop-blur border border-white/10 hover:bg-white/10 transition-colors z-10"
        >
          <Heart className={cn("w-4 h-4", isFav ? "fill-red-500 text-red-500" : "text-white")} />
        </button>

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-bold text-white text-lg leading-tight mb-1 truncate">{movie.title}</h3>
          <div className="flex items-center justify-between text-xs text-gray-300">
            <span>{formattedDate}</span>
            <div className="flex items-center gap-1 text-orange-500 font-medium">
              <Star className="w-3 h-3 fill-current" />
              {movie.vote_average.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
