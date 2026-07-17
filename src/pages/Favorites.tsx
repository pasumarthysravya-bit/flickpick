import { useFavorites } from '../hooks/useFavorites';
import { MovieGrid } from '../components/movie/MovieGrid';
import { Heart, Film } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Favorites = () => {
  const { favorites } = useFavorites();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 pb-6 border-b border-white/10">
        <Heart className="w-8 h-8 text-red-500 fill-current" />
        <div>
          <h1 className="text-3xl font-bold text-white">Your Favorites</h1>
          <p className="text-gray-400">Movies you've saved for later</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-dark-800 flex items-center justify-center mb-2">
            <Film className="w-10 h-10 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">No favorites yet</h2>
          <p className="text-gray-400 max-w-md">
            You haven't added any movies to your favorites. Explore the latest releases and click the heart icon to save them here.
          </p>
          <Link to="/" className="btn-primary inline-block mt-4">
            Discover Movies
          </Link>
        </div>
      ) : (
        <MovieGrid movies={favorites} />
      )}
    </div>
  );
};
