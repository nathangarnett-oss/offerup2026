import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Home, Smartphone, Sofa, Wrench, Briefcase, ArrowRight, TrendingUp, Clock, Sparkles, MapPin, ChevronRight, Package } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import ListingCard from '../components/common/ListingCard';
import { listings } from '../data/listings';
import { collections } from '../data/collections';
import { useApp } from '../context/AppContext';

const CATEGORY_PILLS = [
  { label: 'All', icon: Package, value: null },
  { label: 'Vehicles', icon: Car, value: 'vehicles' },
  { label: 'Housing', icon: Home, value: 'housing' },
  { label: 'Electronics', icon: Smartphone, value: 'electronics' },
  { label: 'Furniture', icon: Sofa, value: 'furniture' },
  { label: 'Services', icon: Wrench, value: 'services' },
  { label: 'Jobs', icon: Briefcase, value: 'jobs' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { location } = useApp();
  const [activeCategory, setActiveCategory] = useState(null);

  const trendingListings = [...listings]
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  const recentListings = [...listings]
    .sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
    .slice(0, 8);

  const vehicleListings = listings.filter((l) => l.category === 'vehicles');
  const housingListings = listings.filter((l) => l.category === 'housing');

  const handleCategoryClick = (value) => {
    setActiveCategory(value);
    if (value) {
      navigate(`/search?category=${value}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <div className="min-h-screen">
      {/* ===== 1. Hero Section ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white dark:from-surface-950 dark:to-surface-900">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-accent-200/20 dark:bg-accent-900/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            <span className="text-gradient">Find anything nearby.</span>
          </h1>
          <p className="text-lg sm:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-8">
            The smartest way to buy, sell, and discover locally.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-6">
            <SearchBar large placeholder="Search for anything..." className="shadow-lg shadow-primary-500/10 dark:shadow-primary-400/5" />
          </div>

          {/* Location */}
          <button className="inline-flex items-center gap-1.5 text-sm text-surface-400 dark:text-surface-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-8 group">
            <MapPin className="w-3.5 h-3.5" />
            <span>
              Searching in {location.city}, {location.state} &middot; {location.radius} mi
            </span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {CATEGORY_PILLS.map(({ label, icon: Icon, value }) => (
              <button
                key={label}
                onClick={() => handleCategoryClick(value)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border
                  ${
                    activeCategory === value
                      ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/25'
                      : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-sm'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 2. Smart Collections ===== */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-accent-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-surface-100">
              Smart Collections
            </h2>
          </div>

          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                to={`/search?collection=${collection.id}`}
                className="flex-none w-56 sm:w-64 group"
              >
                <div
                  className={`relative rounded-2xl p-5 h-32 bg-gradient-to-br ${collection.gradient} overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02]`}
                >
                  {/* Decorative circles */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10" />

                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-white font-bold text-lg leading-tight">
                        {collection.title}
                      </h3>
                      <p className="text-white/70 text-sm mt-1">
                        {collection.itemCount} items
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                      Browse
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3. Trending Near You ===== */}
      <section className="py-10 sm:py-14 bg-surface-50/50 dark:bg-surface-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-surface-100">
                Trending Near You
              </h2>
            </div>
            <Link
              to="/search"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group"
            >
              See all
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {trendingListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. Category Spotlight: Popular Vehicles ===== */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-rose-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-surface-100">
                Popular Vehicles
              </h2>
              <span className="badge bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 ml-1">
                {vehicleListings.length}
              </span>
            </div>
            <Link
              to="/search?category=vehicles"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group"
            >
              See all
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
            {vehicleListings.map((listing) => (
              <div key={listing.id} className="flex-none w-60 sm:w-72">
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4b. Category Spotlight: Places to Live ===== */}
      <section className="py-10 sm:py-14 bg-surface-50/50 dark:bg-surface-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-violet-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-surface-100">
                Places to Live
              </h2>
              <span className="badge bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 ml-1">
                {housingListings.length}
              </span>
            </div>
            <Link
              to="/search?category=housing"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group"
            >
              See all
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
            {housingListings.map((listing) => (
              <div key={listing.id} className="flex-none w-60 sm:w-72">
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. Recently Listed ===== */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-surface-100">
                Recently Listed
              </h2>
            </div>
            <Link
              to="/search?sort=newest"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group"
            >
              See all
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {recentListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== 6. App Promo Banner ===== */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 px-8 py-12 sm:px-12 sm:py-16">
              {/* Text */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
                  Sell in 60 seconds
                </h2>
                <p className="text-primary-100 text-lg mb-6 max-w-md">
                  Snap a photo, set your price, and reach thousands of local buyers instantly.
                </p>
                <Link
                  to="/sell"
                  className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-colors shadow-lg shadow-black/10"
                >
                  Start Selling
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Mock phone illustration */}
              <div className="flex-none hidden sm:block">
                <div className="w-48 h-80 md:w-56 md:h-96 rounded-[2rem] bg-gradient-to-b from-white/20 to-white/5 border border-white/20 backdrop-blur-sm p-3">
                  <div className="w-full h-full rounded-[1.5rem] bg-gradient-to-b from-white/10 to-transparent flex flex-col items-center justify-center gap-4">
                    {/* Status bar mock */}
                    <div className="w-16 h-1.5 rounded-full bg-white/30" />
                    {/* Content lines mock */}
                    <div className="w-20 h-20 rounded-2xl bg-white/15 flex items-center justify-center">
                      <Package className="w-8 h-8 text-white/60" />
                    </div>
                    <div className="space-y-2 w-full px-4">
                      <div className="h-2 bg-white/20 rounded-full w-3/4 mx-auto" />
                      <div className="h-2 bg-white/15 rounded-full w-1/2 mx-auto" />
                    </div>
                    <div className="w-24 h-8 rounded-full bg-white/20 mt-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
