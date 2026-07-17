import type { Movie } from '../../types';
import { MovieCard } from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  title?: string;
  horizontal?: boolean;
}

export const MovieGrid = ({ movies, title, horizontal = false }: MovieGridProps) => {
  if (movies.length === 0) return null;

  return (
    <div className="my-8">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {title}
          </h2>
          <button className="text-sm text-orange-500 hover:text-orange-400 font-medium transition-colors">
            View All
          </button>
        </div>
      )}

      {horizontal ? (
        <div className="flex overflow-x-auto gap-4 pb-4 custom-scrollbar snap-x snap-mandatory">
          {movies.map((movie) => (
            <div key={movie.id} className="w-[160px] sm:w-[200px] shrink-0 snap-start">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};
