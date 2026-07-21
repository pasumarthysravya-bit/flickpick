import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Play, Info, ChevronLeft, ChevronRight, AlertCircle, Flame } from 'lucide-react';
import { tmdbService } from '../../services/tmdb';

interface TopTenMoviesProps {
  profile: 'parents' | 'kids';
}

export const TopTenMovies = ({ profile }: TopTenMoviesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch Trending Today
  const { data: trendingData, isLoading, isError, refetch } = useQuery({
    queryKey: ['trending', 'day', profile, 'top10'],
    queryFn: () => profile === 'kids' 
      ? tmdbService.discoverMovies({ sort_by: 'popularity.desc', with_genres: '10751', certification_country: 'US', 'certification.lte': 'PG' })
      : tmdbService.getTrending('day'),
  });

  // Fetch Genres to map genre_ids
  const { data: genresData } = useQuery({
    queryKey: ['genres'],
    queryFn: tmdbService.getGenres,
  });

  const top10 = trendingData?.results?.slice(0, 10) || [];
  
  const getGenreName = (id: number) => {
    return genresData?.genres.find(g => g.id === id)?.name || '';
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 800 : 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (isError) {
    return (
      <div className="bg-[#141414] p-8 rounded-2xl flex flex-col items-center text-center border border-white/5 mx-4 sm:mx-6 mb-12">
        <AlertCircle className="w-12 h-12 text-[#E50914] mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Failed to load Top 10 Movies</h3>
        <p className="text-gray-400 mb-6">Something went wrong while fetching trending movies.</p>
        <button 
          onClick={() => refetch()}
          className="bg-[#E50914] hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!isLoading && top10.length === 0) return null;

  return (
    <section className="bg-[#141414] py-8 mb-12 shadow-2xl relative group/section border-y border-white/5 w-screen left-1/2 right-1/2 -mx-[50vw]">
      <div className="max-w-7xl mx-auto flex items-center gap-2 mb-8 text-white px-4 sm:px-6">
        <Flame className="w-6 h-6 text-[#E50914] fill-[#E50914]" />
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Top 10 Movies Today</h2>
          <p className="text-sm text-gray-400 mt-1">Trending worldwide right now.</p>
        </div>
      </div>

      <div className="relative group">
        {/* Scroll Buttons for Desktop */}
        <button 
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-0 top-0 bottom-0 z-30 w-16 items-center justify-center bg-gradient-to-r from-[#141414] via-[#141414]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-12 h-12 text-white hover:scale-125 transition-transform drop-shadow-xl" />
        </button>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-8 md:gap-12 pb-10 pt-4 snap-x snap-mandatory scroll-smooth px-4 sm:px-12 lg:px-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {isLoading ? (
            // Loading Skeletons
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-[180px] md:w-[220px] shrink-0 snap-center aspect-[2/3] bg-dark-800 animate-pulse rounded-lg" />
            ))
          ) : (
            top10.map((movie, index) => (
              <div 
                key={movie.id} 
                className="relative w-[180px] md:w-[220px] shrink-0 snap-center aspect-[2/3] group/card cursor-pointer rounded-lg transition-all duration-300 hover:scale-[1.05] hover:z-20"
              >
                {/* Ranking Badge overlapping */}
                <div className="absolute -left-6 md:-left-10 -bottom-2 md:-bottom-4 z-20 pointer-events-none">
                  <span 
                    className="text-[120px] md:text-[180px] font-black tracking-tighter text-[#141414] leading-none select-none"
                    style={{ 
                      WebkitTextStroke: '4px #595959',
                      textShadow: '4px 0 8px rgba(0,0,0,0.8)'
                    }}
                  >
                    {index + 1}
                  </span>
                </div>

                {/* Poster Image */}
                <div className="w-full h-full rounded-lg overflow-hidden shadow-2xl relative z-10 border border-white/10 group-hover/card:border-white/30 transition-colors">
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                    alt={movie.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/80 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                    <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 mb-2 drop-shadow-md">
                      {movie.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-300 mb-2">
                      <span className="text-[#46d369] font-bold">{Math.round(movie.vote_average * 10)}% Match</span>
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 line-clamp-1">
                      {movie.genre_ids.slice(0, 2).map(id => getGenreName(id)).filter(Boolean).join(' • ')}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link 
                        to={`/movie/${movie.id}`}
                        className="flex-1 bg-white text-black py-1.5 rounded flex items-center justify-center gap-1 font-semibold text-sm hover:bg-gray-200 transition-colors"
                      >
                        <Play className="w-4 h-4 fill-black" />
                        Play
                      </Link>
                      <Link 
                        to={`/movie/${movie.id}`}
                        className="w-8 h-8 bg-gray-600/60 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-gray-400/50"
                        title="More Info"
                      >
                        <Info className="w-5 h-5 text-white" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Scroll Button */}
        <button 
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-0 top-0 bottom-0 z-30 w-16 items-center justify-center bg-gradient-to-l from-[#141414] via-[#141414]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-12 h-12 text-white hover:scale-125 transition-transform drop-shadow-xl" />
        </button>
      </div>
    </section>
  );
};
