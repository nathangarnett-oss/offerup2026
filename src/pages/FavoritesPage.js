import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowUpDown } from 'lucide-react';
import ListingCard from '../components/common/ListingCard';
import EmptyState from '../components/common/EmptyState';
import { listings } from '../data/listings';
import { useApp } from '../context/AppContext';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Recently Added' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
];

export default function FavoritesPage() {
  const { favorites } = useApp();
  const [sortBy, setSortBy] = useState('newest');

  const favoriteListings = useMemo(() => {
    const items = listings.filter((l) => favorites.includes(l.id));

    switch (sortBy) {
      case 'price-low':
        return [...items].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...items].sort((a, b) => b.price - a.price);
      case 'name':
        return [...items].sort((a, b) => a.title.localeCompare(b.title));
      case 'newest':
      default:
        // Order by position in favorites array (most recently added first)
        return items.reverse();
    }
  }, [favorites, sortBy]);

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
        <div className="max-w-4xl mx-auto px-4 pt-10">
          <div className="flex items-center gap-2 mb-8">
            <Heart className="w-6 h-6 text-red-500" />
            <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-100">
              Your Favorites
            </h1>
          </div>
          <EmptyState
            icon={Heart}
            title="No favorites yet"
            description="Items you love will appear here. Start browsing and tap the heart icon to save listings."
            action={() => (window.location.href = '/search')}
            actionLabel="Browse Listings"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-100">
                Your Favorites
              </h1>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
                {favoriteListings.length} saved item{favoriteListings.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-surface-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-sm text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {favoriteListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {/* Browse more CTA */}
        <div className="text-center mt-12">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-surface-200 dark:border-surface-700 text-sm font-semibold text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse More Listings
          </Link>
        </div>
      </div>
    </div>
  );
}
