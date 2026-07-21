import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { tmdbService } from '../services/tmdb';
import { LanguageSelector } from '../components/filters/LanguageSelector';
import { DropdownFilter } from '../components/filters/DropdownFilter';
import { MovieCard } from '../components/movie/MovieCard';
import { MovieGrid } from '../components/movie/MovieGrid';
import { FeaturedMovies } from '../components/movie/FeaturedMovies';
import { TopTenMovies } from '../components/movie/TopTenMovies';

const YEARS = Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => ({
  value: new Date().getFullYear() - i,
  label: (new Date().getFullYear() - i).toString()
}));

export const Home = () => {
  const [profile, setProfile] = useState<'parents' | 'kids'>('parents');
  const [language, setLanguage] = useState('en'); // Default English
  const [year, setYear] = useState<string | number>(new Date().getFullYear());
  const [genre, setGenre] = useState<string | number>('');

  // Fetch Genres
  const { data: genresData } = useQuery({
    queryKey: ['genres'],
    queryFn: tmdbService.getGenres,
  });

  const genreOptions = useMemo(() => {
    if (!genresData) return [{ value: '', label: 'All Genres' }];
    
    let filteredGenres = genresData.genres;
    if (profile === 'kids') {
      const allowedKidsGenres = ['Comedy', 'Animation', 'Family', 'Music', 'TV Movie', 'Documentary'];
      filteredGenres = genresData.genres.filter(g => allowedKidsGenres.includes(g.name));
    }
    
    return [
      { value: '', label: 'All Genres' },
      ...filteredGenres.map(g => ({ value: g.id, label: g.name }))
    ];
  }, [genresData, profile]);

  // Fetch Top Match & More Matches based on filters
  const { data: searchResults, isLoading: isSearchLoading, isError: isSearchError } = useQuery({
    queryKey: ['discover', language, year, genre, profile],
    queryFn: () => tmdbService.discoverMovies({
      with_original_language: language,
      primary_release_year: year ? Number(year) : undefined,
      with_genres: profile === 'kids' 
        ? (genre ? `${genre},10751` : '10751') 
        : (genre ? String(genre) : undefined),
      sort_by: 'vote_average.desc',
      'vote_average.gte': 0, // Just to ensure valid results
      'vote_count.gte': 100, // Ensure it has a meaningful number of ratings
      ...(profile === 'kids' ? { certification_country: 'US', 'certification.lte': 'PG' } : {})
    }),
  });

  // Fetch Trending Today
  const { data: trendingToday } = useQuery({
    queryKey: ['trending', 'day', profile],
    queryFn: () => profile === 'kids' 
      ? tmdbService.discoverMovies({ sort_by: 'popularity.desc', with_genres: '10751', certification_country: 'US', 'certification.lte': 'PG' })
      : tmdbService.getTrending('day'),
  });

  // Fetch Latest Global Releases
  const { data: latestGlobal } = useQuery({
    queryKey: ['discover', 'latest_global', profile],
    queryFn: () => tmdbService.discoverMovies({
      sort_by: 'primary_release_date.desc',
      'vote_average.gte': 5,
      ...(profile === 'kids' ? { with_genres: '10751', certification_country: 'US', 'certification.lte': 'PG' } : {})
    }),
  });

  const topMatch = searchResults?.results[0];
  const topMatches = searchResults?.results.slice(1, 6) || [];
  const moreMatches = searchResults?.results.slice(6, 16) || [];

  // Fetch fallback movie if no results found
  const { data: fallbackData, isLoading: isFallbackLoading } = useQuery({
    queryKey: ['fallback', language, profile],
    queryFn: () => tmdbService.discoverMovies({
      with_original_language: language,
      sort_by: 'vote_average.desc',
      'vote_count.gte': 100, // Ensure it has a meaningful number of ratings to be considered "best"
      ...(profile === 'kids' ? { with_genres: '10751', certification_country: 'US', 'certification.lte': 'PG' } : {})
    }),
    enabled: !!(searchResults?.results && searchResults.results.length === 0 && language),
  });
  
  const fallbackMovie = fallbackData?.results?.[0];
  const fallbackMovies = fallbackData?.results?.slice(1, 6) || [];

  return (
    <div className="space-y-12 pb-12">
      <FeaturedMovies />
      <TopTenMovies profile={profile} />

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white mb-6">Find Movies</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <LanguageSelector selectedLanguage={language} onSelectLanguage={setLanguage} />
          </div>
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DropdownFilter
                label="Release Year"
                options={[{ value: '', label: 'Select Year' }, ...YEARS]}
                value={year}
                onChange={setYear}
                placeholder="Select Year"
              />
              <DropdownFilter
                label="Genre"
                options={genreOptions}
                value={genre}
                onChange={setGenre}
                placeholder="All Genres"
              />
            </div>
            
            {/* Profile Toggle */}
            <div className="flex justify-center pt-24">
              <div className="glass-panel inline-flex rounded-full p-1 border-white/10">
                <button
                  onClick={() => setProfile('parents')}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                    profile === 'parents' 
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Parents
                </button>
                <button
                  onClick={() => setProfile('kids')}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                    profile === 'kids' 
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Kids
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isSearchError ? (
        <div className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Failed to load movies</h3>
          <p className="text-gray-400">Please check your API key and connection, then try again.</p>
        </div>
      ) : isSearchLoading ? (
        <div className="h-[300px] rounded-2xl bg-dark-800/50 animate-pulse border border-white/5" />
      ) : topMatch ? (
        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <h2 className="text-2xl font-bold text-white">Top Result</h2>
            </div>
            <MovieCard movie={topMatch} featured />
          </section>
          
          {topMatches.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-white mb-4">More Top Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {topMatches.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {fallbackMovie && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  <h2 className="text-2xl font-bold text-white">
                    Highest Rated Movie in Selected Language
                  </h2>
                </div>
                <MovieCard movie={fallbackMovie} featured />
              </section>
              
              {fallbackMovies.length > 0 && (
                <section>
                  <h3 className="text-xl font-bold text-white mb-4">More High Rated Movies</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {fallbackMovies.map(movie => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
          
          {isFallbackLoading && (
            <div className="h-[300px] rounded-2xl bg-dark-800/50 animate-pulse border border-white/5" />
          )}
        </div>
      )}

      {moreMatches.length > 0 && (
        <section>
          <MovieGrid movies={moreMatches} title="More Matching Movies" horizontal />
        </section>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-12">
          {latestGlobal?.results && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-orange-500" />
                <h2 className="text-2xl font-bold text-white">Latest Global Releases</h2>
              </div>
              <MovieGrid movies={latestGlobal.results.slice(0, 10)} horizontal />
            </section>
          )}
        </div>
        
        <div className="xl:col-span-1 space-y-12">
          {trendingToday?.results && (
            <section className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <h2 className="text-xl font-bold text-white">Trending Today</h2>
                </div>
                {profile !== 'kids' && (
                  <Link to="/trending" className="text-sm text-orange-500 hover:text-orange-400">View All</Link>
                )}
              </div>
              
              <div className="space-y-4">
                {trendingToday.results.slice(0, 5).map((movie, index) => (
                  <Link key={movie.id} to={`/movie/${movie.id}`} className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                    <span className="text-2xl font-bold text-dark-600 group-hover:text-orange-500/50 transition-colors w-6 text-center">
                      {index + 1}
                    </span>
                    <img 
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded-md shadow-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-white line-clamp-1 group-hover:text-orange-400 transition-colors">{movie.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <span className="text-orange-500">★</span> {movie.vote_average.toFixed(1)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
