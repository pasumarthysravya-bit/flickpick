import { Link, useNavigate } from 'react-router-dom';
import { Heart, Search, Sun, Moon, Star, Loader2, Film, User, Clock, X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useFavorites } from '../../hooks/useFavorites';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import { useState, useEffect, useRef, useCallback } from 'react';
import { tmdbService } from '../../services/tmdb';
import type { MultiSearchResult, Person, Movie } from '../../types';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w92';

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const { favorites } = useFavorites();
  const { history, addSearch, clearHistory, removeSearch } = useSearchHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<MultiSearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search for suggestions
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoadingSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const data = await tmdbService.searchMulti(query);
      setSuggestions(data.results.slice(0, 6));
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoadingSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, fetchSuggestions]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addSearch(searchQuery);
      navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      setIsFocused(false);
      (document.activeElement as HTMLElement)?.blur();
    }
  };

  const handleSelectSuggestion = (result: MultiSearchResult) => {
    const isPerson = 'media_type' in result && result.media_type === 'person';
    const title = isPerson ? (result as Person).name : (result as Movie).title;
    addSearch(title);
    if (isPerson) {
      navigate(`/person/${result.id}`);
    } else {
      navigate(`/movie/${result.id}`);
    }
    setSearchQuery('');
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  const getYear = (dateStr: string) => {
    if (!dateStr) return '';
    return dateStr.split('-')[0];
  };

  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-50 glass-panel px-6 py-4 border-b ${isDark ? 'border-white/10' : 'border-black/10'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
            {/* Antennas */}
            <line x1="8" y1="1" x2="12" y2="7" />
            <line x1="16" y1="1" x2="12" y2="7" />
            {/* TV Body */}
            <rect x="2" y="7" width="20" height="14" rx="2" />
            {/* Screen */}
            <rect x="5" y="10" width="10" height="8" rx="1" />
            {/* Knobs */}
            <circle cx="18" cy="12" r="1" fill="currentColor" />
            <circle cx="18" cy="16" r="1" fill="currentColor" />
          </svg>
          <h1 className="text-xl font-bold leading-tight text-orange-500">Flick Pick</h1>
        </Link>

        <div ref={searchRef} className="flex-1 max-w-xl hidden md:block relative">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search movies, actors or directors..."
              className={`w-full rounded-full py-2 pl-4 pr-10 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm ${isDark ? 'bg-dark-900 border border-dark-600 text-white placeholder-gray-400' : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              onClick={() => {
                setIsFocused(true);
              }}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
            <button type="submit" className={`absolute right-3 top-[50%] -translate-y-1/2 transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`} style={{ top: '20px' }}>
              {isLoadingSuggestions ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
          </form>

          {/* Search Dropdown */}
          {((showSuggestions && suggestions.length > 0) || (isFocused && searchQuery.trim().length < 2)) && (
            <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border backdrop-blur-xl shadow-2xl overflow-hidden z-[100] ${isDark ? 'border-white/10 bg-dark-800/95' : 'border-gray-200 bg-white/95'}`}>
              
              {showSuggestions && suggestions.length > 0 && searchQuery.trim().length >= 2 ? (
                <>
                  <div className={`px-4 py-2 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Suggestions</span>
                  </div>
                  <ul>
                    {suggestions.map((result, index) => {
                      const isPerson = 'media_type' in result && result.media_type === 'person';
                      const title = isPerson ? (result as Person).name : (result as Movie).title;
                      const poster = isPerson ? (result as Person).profile_path : (result as Movie).poster_path;
                      
                      return (
                      <li key={`${result.id}-${index}`}>
                        <button
                          type="button"
                          onClick={() => handleSelectSuggestion(result)}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                            index === highlightedIndex
                              ? 'bg-orange-500/10'
                              : isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'
                          }`}
                        >
                          {/* Poster thumbnail */}
                          <div className="w-10 h-14 rounded-md overflow-hidden flex-shrink-0 bg-dark-700">
                            {poster ? (
                              <img
                                src={`${IMAGE_BASE}${poster}`}
                                alt={title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                {isPerson ? <User className="w-4 h-4 text-gray-600" /> : <Film className="w-4 h-4 text-gray-600" />}
                              </div>
                            )}
                          </div>

                          {/* Result info */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${
                              index === highlightedIndex ? 'text-orange-400' : isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                              {title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {isPerson ? (
                                <span className="text-xs text-gray-400 capitalize">
                                  {(result as Person).known_for_department || 'Person'}
                                </span>
                              ) : (
                                <>
                                  {(result as Movie).release_date && (
                                    <span className="text-xs text-gray-400">
                                      {getYear((result as Movie).release_date)}
                                    </span>
                                  )}
                                  {(result as Movie).vote_average > 0 && (
                                    <span className="flex items-center gap-0.5 text-xs text-gray-400">
                                      <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                                      {(result as Movie).vote_average.toFixed(1)}
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </button>
                      </li>
                    )})}
                  </ul>
                  <button
                    type="button"
                    onClick={() => {
                      if (searchQuery.trim()) {
                        addSearch(searchQuery);
                        navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
                        setSearchQuery('');
                        setShowSuggestions(false);
                        setIsFocused(false);
                      }
                    }}
                    className={`w-full px-4 py-2.5 text-center text-xs font-medium text-orange-500 border-t transition-colors ${isDark ? 'hover:bg-white/5 border-white/5' : 'hover:bg-gray-100 border-gray-100'}`}
                  >
                    View all results for "{searchQuery}"
                  </button>
                </>
              ) : (
                <>
                  <div className={`px-4 py-2 border-b flex justify-between items-center ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Recent Searches</span>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        clearHistory();
                      }}
                      className="text-[11px] font-medium text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                  {history.length > 0 ? (
                    <ul>
                      {history.map((query, index) => (
                        <li key={index} className="relative group">
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery(query);
                              navigate(`/search/${encodeURIComponent(query)}`);
                              setShowSuggestions(false);
                              setIsFocused(false);
                              addSearch(query);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${isDark ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                          >
                            <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <span className="flex-1 truncate text-sm">{query}</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSearch(query);
                            }}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all ${isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-black/5 text-gray-500 hover:text-black'}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No recent searches
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button 
            className="btn-icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-gray-400" /> : <Moon className="w-5 h-5 text-gray-400" />}
          </button>
          
          <Link to="/favorites" className="btn-secondary flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="hidden sm:inline">Favorites</span>
            {favorites.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {favorites.length}
              </span>
            )}
          </Link>

        </div>
      </div>
    </header>
  );
};
