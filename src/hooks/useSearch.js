import { useState, useEffect, useMemo, useCallback } from 'react';
import { detectSearchCategory } from '../utils/helpers';

const DEFAULT_FILTERS = {
  category: '',
  priceRange: [0, Infinity],
  condition: '',
  distance: null,
  postedWithin: null, // days
};

function matchesCategory(listing, category) {
  if (!category) return true;
  return listing.category?.toLowerCase() === category.toLowerCase();
}

function matchesPriceRange(listing, [min, max]) {
  const price = listing.price ?? 0;
  return price >= min && price <= max;
}

function matchesCondition(listing, condition) {
  if (!condition) return true;
  return listing.condition?.toLowerCase() === condition.toLowerCase();
}

function matchesDistance(listing, maxDistance) {
  if (maxDistance == null) return true;
  const dist = listing.distance ?? 0;
  return dist <= maxDistance;
}

function matchesPostedWithin(listing, days) {
  if (days == null) return true;
  const posted = new Date(listing.postedAt || listing.createdAt);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return posted >= cutoff;
}

function matchesQuery(listing, query) {
  if (!query || !query.trim()) return true;
  const q = query.toLowerCase();
  const searchable = [
    listing.title,
    listing.description,
    listing.category,
    listing.location,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return q.split(/\s+/).every((term) => searchable.includes(term));
}

function sortListings(listings, sortBy, query) {
  const sorted = [...listings];

  switch (sortBy) {
    case 'price_asc':
      return sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    case 'price_desc':
      return sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    case 'distance':
      return sorted.sort(
        (a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity)
      );
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.postedAt || b.createdAt) -
          new Date(a.postedAt || a.createdAt)
      );
    case 'popular':
      return sorted.sort(
        (a, b) => (b.views ?? 0) + (b.favorites ?? 0) - ((a.views ?? 0) + (a.favorites ?? 0))
      );
    case 'relevance':
    default:
      // For relevance, prefer title matches over description matches
      if (query && query.trim()) {
        const q = query.toLowerCase();
        return sorted.sort((a, b) => {
          const aTitle = (a.title || '').toLowerCase().includes(q) ? 1 : 0;
          const bTitle = (b.title || '').toLowerCase().includes(q) ? 1 : 0;
          return bTitle - aTitle;
        });
      }
      return sorted;
  }
}

export function useSearch(listings = []) {
  const [filters, setFiltersState] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState('relevance');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [debouncedFilters, setDebouncedFilters] = useState(DEFAULT_FILTERS);

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Loading simulation when filters or query change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters, sortBy]);

  // Smart filter suggestions based on query
  const suggestedCategory = useMemo(
    () => detectSearchCategory(debouncedQuery),
    [debouncedQuery]
  );

  const setFilters = useCallback((newFilters) => {
    setFiltersState((prev) =>
      typeof newFilters === 'function' ? newFilters(prev) : { ...prev, ...newFilters }
    );
  }, []);

  const results = useMemo(() => {
    const filtered = listings.filter((listing) => {
      if (!matchesQuery(listing, debouncedQuery)) return false;
      if (!matchesCategory(listing, debouncedFilters.category)) return false;
      if (!matchesPriceRange(listing, debouncedFilters.priceRange)) return false;
      if (!matchesCondition(listing, debouncedFilters.condition)) return false;
      if (!matchesDistance(listing, debouncedFilters.distance)) return false;
      if (!matchesPostedWithin(listing, debouncedFilters.postedWithin)) return false;
      return true;
    });

    return sortListings(filtered, sortBy, debouncedQuery);
  }, [listings, debouncedQuery, debouncedFilters, sortBy]);

  return {
    results,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    totalResults: results.length,
    isLoading,
    suggestedCategory,
  };
}
