import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  Grid3X3,
  List,
  BookmarkPlus,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  Car,
  Home as HomeIcon,
  Smartphone,
  Package,
} from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import ListingCard from '../components/common/ListingCard';
import FilterChip from '../components/common/FilterChip';
import EmptyState from '../components/common/EmptyState';
import { ListingGridSkeleton } from '../components/common/LoadingSkeleton';
import { listings } from '../data/listings';
import { useSearch } from '../hooks/useSearch';
import { useApp } from '../context/AppContext';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORIES = [
  { value: '', label: 'All Categories', icon: Package },
  { value: 'vehicles', label: 'Vehicles', icon: Car },
  { value: 'housing', label: 'Housing', icon: HomeIcon },
  { value: 'electronics', label: 'Electronics', icon: Smartphone },
  { value: 'furniture', label: 'Furniture', icon: Package },
  { value: 'services', label: 'Services', icon: Package },
  { value: 'jobs', label: 'Jobs', icon: Package },
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'distance', label: 'Distance' },
  { value: 'popular', label: 'Most Popular' },
];

const POSTED_OPTIONS = [
  { value: '', label: 'Any time' },
  { value: '1', label: '24 hours' },
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
];

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];

const VEHICLE_MAKES = [
  '', 'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes',
  'Audi', 'Nissan', 'Hyundai', 'Kia', 'Subaru', 'Jeep', 'Tesla',
];

const TRANSMISSIONS = ['', 'Automatic', 'Manual'];
const FUEL_TYPES = ['', 'Gasoline', 'Diesel', 'Electric', 'Hybrid'];
const HOUSING_TYPES = ['', 'Apartment', 'House', 'Room', 'Condo', 'Townhouse'];
const PET_POLICIES = ['', 'Pets OK', 'Cats OK', 'No Pets'];
const PARKING_OPTIONS = ['', 'Included', 'Street', 'Garage', 'None'];

// ---------------------------------------------------------------------------
// Collapsible filter section
// ---------------------------------------------------------------------------

function FilterSection({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-surface-200 dark:border-surface-700 py-4 first:pt-0 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full text-sm font-semibold text-surface-800 dark:text-surface-200"
      >
        {title}
        {open ? (
          <ChevronUp className="w-4 h-4 text-surface-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-surface-400" />
        )}
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tiny reusable inputs
// ---------------------------------------------------------------------------

function SelectInput({ value, onChange, options, className = '' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`input-field py-2 text-sm ${className}`}
    >
      {options.map((opt) =>
        typeof opt === 'string' ? (
          <option key={opt} value={opt}>
            {opt || 'Any'}
          </option>
        ) : (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        )
      )}
    </select>
  );
}

function NumberInput({ value, onChange, placeholder, className = '' }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`input-field py-2 text-sm ${className}`}
    />
  );
}

// ---------------------------------------------------------------------------
// List-view variant of ListingCard
// ---------------------------------------------------------------------------

function ListingCardList({ listing }) {
  return <ListingCard listing={listing} variant="list" />;
}

// ---------------------------------------------------------------------------
// Main SearchPage component
// ---------------------------------------------------------------------------

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { location, addSavedSearch, addToast } = useApp();

  // View mode
  const [viewMode, setViewMode] = useState('grid');

  // Mobile filter sheet
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Search hook
  const {
    results,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    totalResults,
    isLoading,
    suggestedCategory,
  } = useSearch(listings);

  // ---------------------------------------------------------------------------
  // Sync URL params -> hook state (on mount / URL change)
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const condition = searchParams.get('condition') || '';
    const dist = searchParams.get('distance') || '';
    const posted = searchParams.get('posted') || '';
    const sort = searchParams.get('sort') || 'relevance';
    const view = searchParams.get('view') || 'grid';

    setSearchQuery(q);
    setSortBy(sort);
    setViewMode(view);

    setFilters({
      category,
      priceRange: [
        minPrice ? Number(minPrice) : 0,
        maxPrice ? Number(maxPrice) : Infinity,
      ],
      condition,
      distance: dist ? Number(dist) : null,
      postedWithin: posted ? Number(posted) : null,
    });
    // Only run on URL param changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ---------------------------------------------------------------------------
  // Helpers to update both state and URL at once
  // ---------------------------------------------------------------------------

  function updateParam(key, value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value || value === '' || value === '0' || value === 'Infinity') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      return next;
    });
  }

  function clearAllFilters() {
    setSearchParams((prev) => {
      const next = new URLSearchParams();
      const q = prev.get('q');
      if (q) next.set('q', q);
      return next;
    });
  }

  // ---------------------------------------------------------------------------
  // Adaptive filter category (detected from query or selected)
  // ---------------------------------------------------------------------------

  const activeCategory = filters.category || suggestedCategory;

  // ---------------------------------------------------------------------------
  // Active filter chips
  // ---------------------------------------------------------------------------

  const activeChips = useMemo(() => {
    const chips = [];
    if (filters.category) {
      const cat = CATEGORIES.find((c) => c.value === filters.category);
      chips.push({ key: 'category', label: cat?.label || filters.category, param: 'category' });
    }
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < Infinity) {
      const min = filters.priceRange[0];
      const max = filters.priceRange[1];
      const label =
        max === Infinity || !max ? `$${min}+` : `$${min} - $${max}`;
      chips.push({ key: 'price', label, param: ['minPrice', 'maxPrice'] });
    }
    if (filters.condition) {
      chips.push({ key: 'condition', label: filters.condition, param: 'condition' });
    }
    if (filters.distance != null) {
      chips.push({ key: 'distance', label: `Within ${filters.distance} mi`, param: 'distance' });
    }
    if (filters.postedWithin != null) {
      const opt = POSTED_OPTIONS.find(
        (o) => o.value === String(filters.postedWithin)
      );
      chips.push({
        key: 'posted',
        label: `Posted: ${opt?.label || filters.postedWithin + 'd'}`,
        param: 'posted',
      });
    }
    // Extra URL params for adaptive filters
    const extra = ['make', 'yearMin', 'yearMax', 'mileage', 'transmission', 'fuel',
                   'beds', 'baths', 'housingType', 'pets', 'parking', 'shipping'];
    extra.forEach((key) => {
      const val = searchParams.get(key);
      if (val) {
        chips.push({ key, label: `${key}: ${val}`, param: key });
      }
    });
    return chips;
  }, [filters, searchParams]);

  function removeChip(chip) {
    if (Array.isArray(chip.param)) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        chip.param.forEach((p) => next.delete(p));
        return next;
      });
    } else {
      updateParam(chip.param, '');
    }
  }

  // ---------------------------------------------------------------------------
  // Save search
  // ---------------------------------------------------------------------------

  function handleSaveSearch() {
    const q = searchParams.get('q') || '';
    addSavedSearch(q, Object.fromEntries(searchParams.entries()));
    addToast('Search saved! You can find it in your profile.', 'success');
  }

  // ---------------------------------------------------------------------------
  // Distance slider state (local for smooth dragging, syncs on release)
  // ---------------------------------------------------------------------------

  const [localDistance, setLocalDistance] = useState(
    filters.distance ?? 25
  );

  useEffect(() => {
    setLocalDistance(filters.distance ?? 25);
  }, [filters.distance]);

  // ---------------------------------------------------------------------------
  // Filter sidebar content (shared between desktop sidebar and mobile sheet)
  // ---------------------------------------------------------------------------

  function renderFilters() {
    return (
      <div className="space-y-0">
        {/* Category */}
        <FilterSection title="Category" defaultOpen={true}>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <label
                  key={cat.value}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors text-sm
                    ${
                      filters.category === cat.value
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium'
                        : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800'
                    }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={filters.category === cat.value}
                    onChange={() => updateParam('category', cat.value)}
                    className="sr-only"
                  />
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </label>
              );
            })}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range" defaultOpen={true}>
          <div className="flex items-center gap-2">
            <NumberInput
              value={filters.priceRange[0] > 0 ? filters.priceRange[0] : ''}
              onChange={(v) => updateParam('minPrice', v)}
              placeholder="Min"
            />
            <span className="text-surface-400 text-sm">to</span>
            <NumberInput
              value={
                filters.priceRange[1] < Infinity ? filters.priceRange[1] : ''
              }
              onChange={(v) => updateParam('maxPrice', v)}
              placeholder="Max"
            />
          </div>
        </FilterSection>

        {/* Distance */}
        <FilterSection title="Distance" defaultOpen={true}>
          <div>
            <input
              type="range"
              min="1"
              max="50"
              value={localDistance}
              onChange={(e) => setLocalDistance(Number(e.target.value))}
              onMouseUp={() => updateParam('distance', String(localDistance))}
              onTouchEnd={() => updateParam('distance', String(localDistance))}
              className="w-full accent-primary-600"
            />
            <div className="flex justify-between text-xs text-surface-400 mt-1">
              <span>1 mi</span>
              <span className="font-medium text-surface-700 dark:text-surface-300">
                {localDistance} mi
              </span>
              <span>50 mi</span>
            </div>
          </div>
        </FilterSection>

        {/* Sort By */}
        <FilterSection title="Sort By" defaultOpen={true}>
          <SelectInput
            value={sortBy}
            onChange={(v) => updateParam('sort', v)}
            options={SORT_OPTIONS}
          />
        </FilterSection>

        {/* Posted Within */}
        <FilterSection title="Posted Within" defaultOpen={false}>
          <div className="space-y-1">
            {POSTED_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer text-sm transition-colors
                  ${
                    String(filters.postedWithin ?? '') === opt.value
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium'
                      : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800'
                  }`}
              >
                <input
                  type="radio"
                  name="posted"
                  value={opt.value}
                  checked={String(filters.postedWithin ?? '') === opt.value}
                  onChange={() => updateParam('posted', opt.value)}
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </FilterSection>

        {/* ---- Adaptive Filters ---- */}

        {/* Vehicles */}
        {activeCategory === 'vehicles' && (
          <>
            <FilterSection title="Make" defaultOpen={false}>
              <SelectInput
                value={searchParams.get('make') || ''}
                onChange={(v) => updateParam('make', v)}
                options={VEHICLE_MAKES.map((m) => ({ value: m, label: m || 'Any Make' }))}
              />
            </FilterSection>

            <FilterSection title="Year Range" defaultOpen={false}>
              <div className="flex items-center gap-2">
                <NumberInput
                  value={searchParams.get('yearMin') || ''}
                  onChange={(v) => updateParam('yearMin', v)}
                  placeholder="Min year"
                />
                <span className="text-surface-400 text-sm">to</span>
                <NumberInput
                  value={searchParams.get('yearMax') || ''}
                  onChange={(v) => updateParam('yearMax', v)}
                  placeholder="Max year"
                />
              </div>
            </FilterSection>

            <FilterSection title="Max Mileage" defaultOpen={false}>
              <NumberInput
                value={searchParams.get('mileage') || ''}
                onChange={(v) => updateParam('mileage', v)}
                placeholder="e.g. 100000"
              />
            </FilterSection>

            <FilterSection title="Transmission" defaultOpen={false}>
              <SelectInput
                value={searchParams.get('transmission') || ''}
                onChange={(v) => updateParam('transmission', v)}
                options={TRANSMISSIONS.map((t) => ({ value: t, label: t || 'Any' }))}
              />
            </FilterSection>

            <FilterSection title="Fuel Type" defaultOpen={false}>
              <SelectInput
                value={searchParams.get('fuel') || ''}
                onChange={(v) => updateParam('fuel', v)}
                options={FUEL_TYPES.map((f) => ({ value: f, label: f || 'Any' }))}
              />
            </FilterSection>
          </>
        )}

        {/* Housing */}
        {activeCategory === 'housing' && (
          <>
            <FilterSection title="Bedrooms" defaultOpen={false}>
              <NumberInput
                value={searchParams.get('beds') || ''}
                onChange={(v) => updateParam('beds', v)}
                placeholder="Min beds"
              />
            </FilterSection>

            <FilterSection title="Bathrooms" defaultOpen={false}>
              <NumberInput
                value={searchParams.get('baths') || ''}
                onChange={(v) => updateParam('baths', v)}
                placeholder="Min baths"
              />
            </FilterSection>

            <FilterSection title="Housing Type" defaultOpen={false}>
              <SelectInput
                value={searchParams.get('housingType') || ''}
                onChange={(v) => updateParam('housingType', v)}
                options={HOUSING_TYPES.map((t) => ({ value: t, label: t || 'Any Type' }))}
              />
            </FilterSection>

            <FilterSection title="Pet Policy" defaultOpen={false}>
              <SelectInput
                value={searchParams.get('pets') || ''}
                onChange={(v) => updateParam('pets', v)}
                options={PET_POLICIES.map((p) => ({ value: p, label: p || 'Any' }))}
              />
            </FilterSection>

            <FilterSection title="Parking" defaultOpen={false}>
              <SelectInput
                value={searchParams.get('parking') || ''}
                onChange={(v) => updateParam('parking', v)}
                options={PARKING_OPTIONS.map((p) => ({ value: p, label: p || 'Any' }))}
              />
            </FilterSection>
          </>
        )}

        {/* General goods (electronics, furniture, etc.) */}
        {activeCategory &&
          activeCategory !== 'vehicles' &&
          activeCategory !== 'housing' && (
            <>
              <FilterSection title="Condition" defaultOpen={false}>
                <div className="space-y-1">
                  {['', ...CONDITIONS].map((c) => (
                    <label
                      key={c}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer text-sm transition-colors
                        ${
                          filters.condition === c
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium'
                            : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800'
                        }`}
                    >
                      <input
                        type="radio"
                        name="condition"
                        value={c}
                        checked={filters.condition === c}
                        onChange={() => updateParam('condition', c)}
                        className="sr-only"
                      />
                      {c || 'Any Condition'}
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Shipping" defaultOpen={false}>
                <label className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={searchParams.get('shipping') === 'true'}
                    onChange={(e) =>
                      updateParam('shipping', e.target.checked ? 'true' : '')
                    }
                    className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                  />
                  Shipping available
                </label>
              </FilterSection>
            </>
          )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const locationLabel = `${location.city}, ${location.state}`;

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* ---- Search Header ---- */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <SearchBar
            variant="compact"
            initialValue={searchQuery}
            onSearch={(q) => updateParam('q', q)}
          />
        </div>

        {/* Active filter chips + result count */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Result count */}
            <p className="text-sm text-surface-600 dark:text-surface-400">
              <span className="font-semibold text-surface-900 dark:text-surface-100">
                {totalResults}
              </span>{' '}
              result{totalResults !== 1 ? 's' : ''}
              {searchQuery && (
                <>
                  {' '}
                  for{' '}
                  <span className="font-medium text-surface-900 dark:text-surface-100">
                    &lsquo;{searchQuery}&rsquo;
                  </span>
                </>
              )}
              <span className="inline-flex items-center gap-1 ml-1">
                <MapPin className="w-3 h-3" /> in {locationLabel}
              </span>
            </p>

            {/* View toggle + save search (desktop) */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={handleSaveSearch}
                className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
              >
                <BookmarkPlus className="w-4 h-4" />
                Save search
              </button>
              <div className="w-px h-5 bg-surface-200 dark:bg-surface-700 mx-1" />
              <button
                onClick={() => {
                  setViewMode('grid');
                  updateParam('view', 'grid');
                }}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300'
                }`}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setViewMode('list');
                  updateParam('view', 'list');
                }}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300'
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter chips */}
          {activeChips.length > 0 && (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {activeChips.map((chip) => (
                <FilterChip
                  key={chip.key}
                  label={chip.label}
                  active
                  onRemove={() => removeChip(chip)}
                />
              ))}
              <button
                onClick={clearAllFilters}
                className="text-xs text-surface-400 hover:text-error transition-colors ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ---- Main Content ---- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-[280px] flex-shrink-0">
            <div className="sticky top-[140px] max-h-[calc(100vh-160px)] overflow-y-auto pr-2 scrollbar-hide">
              {renderFilters()}
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1 min-w-0">
            {/* Mobile controls row */}
            <div className="flex items-center gap-2 mb-4 lg:hidden">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm font-medium text-surface-700 dark:text-surface-300 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeChips.length > 0 && (
                  <span className="bg-primary-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {activeChips.length}
                  </span>
                )}
              </button>

              <SelectInput
                value={sortBy}
                onChange={(v) => updateParam('sort', v)}
                options={SORT_OPTIONS}
                className="flex-1"
              />

              <div className="flex items-center">
                <button
                  onClick={() => {
                    setViewMode('grid');
                    updateParam('view', 'grid');
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                      : 'text-surface-400'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setViewMode('list');
                    updateParam('view', 'list');
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                      : 'text-surface-400'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Loading skeleton */}
            {isLoading && <ListingGridSkeleton count={6} />}

            {/* Empty state */}
            {!isLoading && results.length === 0 && (
              <EmptyState
                title="No results found"
                description={
                  searchQuery
                    ? `We couldn't find any listings matching "${searchQuery}". Try broadening your filters or search terms.`
                    : 'Try adjusting your filters to find what you are looking for.'
                }
                action={clearAllFilters}
                actionLabel="Clear all filters"
              />
            )}

            {/* Grid view */}
            {!isLoading && results.length > 0 && viewMode === 'grid' && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {results.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}

            {/* List view */}
            {!isLoading && results.length > 0 && viewMode === 'list' && (
              <div className="space-y-3">
                {results.map((listing) => (
                  <ListingCardList key={listing.id} listing={listing} />
                ))}
              </div>
            )}

            {/* Mobile save search */}
            <div className="mt-6 lg:hidden">
              <button
                onClick={handleSaveSearch}
                className="w-full btn-secondary inline-flex items-center justify-center gap-2"
              >
                <BookmarkPlus className="w-4 h-4" />
                Save this search
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* ---- Mobile Filter Bottom Sheet ---- */}
      {showMobileFilters && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          />

          {/* Sheet */}
          <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden bg-white dark:bg-surface-900 rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col animate-slide-up">
            {/* Handle */}
            <div className="flex items-center justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-surface-300 dark:bg-surface-600" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-surface-200 dark:border-surface-700">
              <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100">
                Filters
              </h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 -mr-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <X className="w-5 h-5 text-surface-500" />
              </button>
            </div>

            {/* Scrollable filter body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {renderFilters()}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-surface-200 dark:border-surface-700 flex gap-3">
              <button
                onClick={clearAllFilters}
                className="btn-secondary flex-1"
              >
                Clear all
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="btn-primary flex-1"
              >
                Show {totalResults} result{totalResults !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Slide-up animation for the sheet */}
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
