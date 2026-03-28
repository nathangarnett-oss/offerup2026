import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useDebounce } from '../../hooks/useDebounce';
import { generateSearchSuggestions } from '../../utils/helpers';

const PLACEHOLDER_CYCLE = [
  'Search for anything...',
  'Toyota Camry under $15k',
  '2-bedroom apartment downtown',
  'iPhone 15 Pro',
  'Plumber near me',
  'Vintage furniture',
];

export default function SearchBar({ variant = 'hero', onSearch, initialValue = '' }) {
  const { location, savedSearches } = useApp();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [query, setQuery] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const debouncedQuery = useDebounce(query, 250);
  const suggestions = generateSearchSuggestions(debouncedQuery);

  // Cycle placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDER_CYCLE.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query.trim());
      setFocused(false);
    }
  };

  const handleSuggestionClick = (text) => {
    setQuery(text);
    onSearch?.(text);
    setFocused(false);
  };

  const recentSearches = savedSearches.slice(0, 5);
  const showDropdown = focused && (suggestions.length > 0 || recentSearches.length > 0 || query.length === 0);

  const isHero = variant === 'hero';

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div
          className={`relative flex items-center gap-2 rounded-2xl transition-all duration-300 ${
            isHero
              ? `bg-white dark:bg-surface-800 shadow-xl shadow-primary-500/10
                 border-2 ${
                   focused
                     ? 'border-primary-500 ring-4 ring-primary-500/10'
                     : 'border-surface-200 dark:border-surface-700'
                 } px-5 py-4`
              : `bg-surface-100 dark:bg-surface-800 border ${
                  focused
                    ? 'border-primary-500 ring-2 ring-primary-500/20'
                    : 'border-transparent'
                } px-4 py-2.5`
          }`}
        >
          <Search
            className={`flex-shrink-0 ${
              isHero ? 'w-5 h-5' : 'w-4 h-4'
            } text-surface-400`}
          />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder={PLACEHOLDER_CYCLE[placeholderIndex]}
            className={`flex-1 bg-transparent outline-none placeholder-surface-400
                       text-surface-900 dark:text-surface-100 ${
                         isHero ? 'text-lg' : 'text-sm'
                       }`}
          />

          {/* Location pill */}
          <button
            type="button"
            className={`flex-shrink-0 flex items-center gap-1.5 rounded-full
                       bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600
                       text-surface-600 dark:text-surface-300 transition-colors ${
                         isHero ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'
                       }`}
          >
            <MapPin className={isHero ? 'w-3.5 h-3.5 text-primary-500' : 'w-3 h-3 text-primary-500'} />
            <span className="font-medium whitespace-nowrap">{location.city}</span>
          </button>

          {/* Submit button (hero only) */}
          {isHero && (
            <button
              type="submit"
              className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl
                         bg-gradient-to-r from-primary-600 to-primary-500 text-white
                         hover:from-primary-700 hover:to-primary-600
                         active:scale-95 transition-all shadow-md shadow-primary-500/25"
              aria-label="Search"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 z-50
                     bg-white dark:bg-surface-800 rounded-2xl shadow-2xl shadow-surface-900/10
                     dark:shadow-black/30 border border-surface-200 dark:border-surface-700
                     overflow-hidden"
        >
          {/* Recent searches */}
          {query.length === 0 && recentSearches.length > 0 && (
            <div className="p-3">
              <p className="px-2 mb-2 text-xs font-semibold text-surface-400 uppercase tracking-wider">
                Recent Searches
              </p>
              {recentSearches.map((search) => (
                <button
                  key={search.id}
                  onClick={() => handleSuggestionClick(search.query)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                             text-sm text-surface-700 dark:text-surface-300
                             hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors text-left"
                >
                  <Clock className="w-4 h-4 text-surface-400 flex-shrink-0" />
                  <span className="truncate">{search.query}</span>
                </button>
              ))}
            </div>
          )}

          {/* Trending (when query is empty and no recent searches) */}
          {query.length === 0 && recentSearches.length === 0 && (
            <div className="p-3">
              <p className="px-2 mb-2 text-xs font-semibold text-surface-400 uppercase tracking-wider">
                Trending Now
              </p>
              {['iPhone 15 Pro', 'Used cars under $10k', 'Apartment for rent', 'Standing desk'].map(
                (text) => (
                  <button
                    key={text}
                    onClick={() => handleSuggestionClick(text)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                               text-sm text-surface-700 dark:text-surface-300
                               hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors text-left"
                  >
                    <TrendingUp className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    <span>{text}</span>
                  </button>
                )
              )}
            </div>
          )}

          {/* Search suggestions */}
          {suggestions.length > 0 && (
            <div className="p-3">
              {query.length > 0 && (
                <p className="px-2 mb-2 text-xs font-semibold text-surface-400 uppercase tracking-wider">
                  Suggestions
                </p>
              )}
              {suggestions.map((text) => (
                <button
                  key={text}
                  onClick={() => handleSuggestionClick(text)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                             text-sm text-surface-700 dark:text-surface-300
                             hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors text-left"
                >
                  <Search className="w-4 h-4 text-surface-400 flex-shrink-0" />
                  <span
                    dangerouslySetInnerHTML={{
                      __html: text.replace(
                        new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
                        '<strong class="text-primary-600 dark:text-primary-400 font-semibold">$1</strong>'
                      ),
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
