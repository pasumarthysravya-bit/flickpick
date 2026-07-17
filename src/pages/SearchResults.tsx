import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, AlertCircle, User } from 'lucide-react';
import { tmdbService } from '../services/tmdb';
import { MovieGrid } from '../components/movie/MovieGrid';
import type { Movie, Person } from '../types';

export const SearchResults = () => {
  const { query } = useParams<{ query: string }>();

  const { data: searchResults, isLoading, isError } = useQuery({
    queryKey: ['search', query],
    queryFn: () => tmdbService.searchMulti(query || ''),
    enabled: !!query,
  });

  const movies = (searchResults?.results.filter(r => !('media_type' in r) || r.media_type === 'movie') || []) as Movie[];
  const people = (searchResults?.results.filter(r => 'media_type' in r && r.media_type === 'person') || []) as Person[];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-3 pb-6 border-b border-white/10">
        <Search className="w-8 h-8 text-orange-500" />
        <div>
          <h1 className="text-3xl font-bold text-white">Search Results</h1>
          <p className="text-gray-400">Showing results for "{query}"</p>
        </div>
      </div>

      {isError ? (
        <div className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Failed to search</h3>
          <p className="text-gray-400">Please check your connection and try again.</p>
        </div>
      ) : isLoading ? (
        <div className="h-[400px] rounded-2xl bg-dark-800/50 animate-pulse border border-white/5" />
      ) : (movies.length > 0 || people.length > 0) ? (
        <div className="space-y-12">
          {people.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">People</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {people.map(person => (
                  <Link key={person.id} to={`/person/${person.id}`} className="glass-panel p-3 rounded-xl text-center hover:-translate-y-1 transition-transform border border-transparent hover:border-orange-500/30">
                    {person.profile_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w200${person.profile_path}`} 
                        alt={person.name}
                        className="w-24 h-24 mx-auto rounded-full object-cover mb-3 shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 mx-auto rounded-full bg-dark-800 flex items-center justify-center mb-3">
                        <User className="w-10 h-10 text-gray-600" />
                      </div>
                    )}
                    <h4 className="font-semibold text-white text-sm line-clamp-1">{person.name}</h4>
                    <p className="text-xs text-orange-400 line-clamp-1 capitalize">{person.known_for_department}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {movies.length > 0 && (
            <section>
              <MovieGrid movies={movies} title={people.length > 0 ? "Movies & TV Shows" : undefined} />
            </section>
          )}
        </div>
      ) : (
        <div className="glass-panel p-16 rounded-3xl flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-dark-800 flex items-center justify-center mb-2">
            <Search className="w-10 h-10 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">No results found</h2>
          <p className="text-gray-400 max-w-md">
            We couldn't find anything matching "{query}". Try checking for typos or using different keywords.
          </p>
        </div>
      )}
    </div>
  );
};
