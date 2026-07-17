import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, Clock, Calendar, Globe, Heart, Play, ArrowLeft, X } from 'lucide-react';
import { tmdbService } from '../services/tmdb';
import { useFavorites } from '../hooks/useFavorites';
import { MovieGrid } from '../components/movie/MovieGrid';
import { cn } from '../utils/cn';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

export const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [showTrailer, setShowTrailer] = useState(false);

  const { data: movie, isLoading, isError } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => tmdbService.getMovieDetails(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <div className="animate-pulse h-[600px] rounded-2xl bg-dark-800/50" />;
  if (isError || !movie) return <div>Failed to load movie details.</div>;

  const isFav = isFavorite(movie.id);
  const trailer = movie.videos?.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const director = movie.credits?.crew.find(c => c.job === 'Director');
  const cast = movie.credits?.cast.slice(0, 6) || [];

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-500">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Discover
      </Link>

      <div className="relative rounded-3xl overflow-hidden glass-panel border-white/10">
        <div className="absolute inset-0">
          <img 
            src={`${IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path}`} 
            alt={movie.title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-dark-900 via-dark-900/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12">
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title}
            className="w-full md:w-80 rounded-2xl shadow-2xl shrink-0 border border-white/10"
          />

          <div className="flex-1 flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {movie.genres.map(g => (
                <span key={g.id} className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium text-gray-200">
                  {g.name}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {movie.title}
            </h1>
            
            <p className="text-xl text-gray-300 italic mb-6">{movie.tagline}</p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 mb-8">
              <span className="flex items-center gap-2"><Star className="w-5 h-5 text-orange-500 fill-current" /> <span className="font-bold text-white text-lg">{movie.vote_average.toFixed(1)}</span></span>
              <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-orange-500" /> {movie.runtime} min</span>
              <span className="flex items-center gap-2"><Calendar className="w-5 h-5 text-orange-500" /> {movie.release_date}</span>
              <span className="flex items-center gap-2"><Globe className="w-5 h-5 text-orange-500" /> {movie.original_language.toUpperCase()}</span>
            </div>

            <div className="space-y-4 mb-8 max-w-3xl">
              <h3 className="text-xl font-semibold text-white">Overview</h3>
              <p className="text-gray-300 leading-relaxed text-lg">{movie.overview}</p>
            </div>

            {director && (
              <div className="mb-8">
                <span className="text-gray-400">Director: </span>
                <span className="text-white font-medium">{director.name}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-auto">
              {trailer && (
                <button 
                  onClick={() => setShowTrailer(true)}
                  className="btn-primary flex items-center gap-2 py-3 px-6 text-lg"
                >
                  <Play className="w-5 h-5 fill-current" /> Watch Trailer
                </button>
              )}
              <button 
                onClick={() => isFav ? removeFavorite(movie.id) : addFavorite(movie)}
                className={cn(
                  "btn-secondary flex items-center gap-2 py-3 px-6 text-lg",
                  isFav && "text-red-500 border-red-500/50 bg-red-500/10"
                )}
              >
                <Heart className={cn("w-5 h-5", isFav && "fill-current")} />
                {isFav ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Top Cast</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {cast.map(actor => (
            <Link to={`/person/${actor.id}`} key={actor.id} className="block glass-panel p-3 rounded-xl text-center hover:-translate-y-1 hover:border-orange-500/30 transition-all cursor-pointer">
              <img 
                src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/200x300?text=No+Photo'} 
                alt={actor.name}
                className="w-24 h-24 mx-auto rounded-full object-cover mb-3 shadow-lg"
              />
              <h4 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-orange-400 transition-colors">{actor.name}</h4>
              <p className="text-xs text-gray-400 line-clamp-1">{actor.character}</p>
            </Link>
          ))}
        </div>
      </section>

      {movie.similar?.results && movie.similar.results.length > 0 && (
        <section>
          <MovieGrid movies={movie.similar.results.slice(0, 10)} title="Similar Movies" horizontal />
        </section>
      )}

      {showTrailer && trailer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl aspect-video bg-dark-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <button 
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 md:top-4 md:right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};
