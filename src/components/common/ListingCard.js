import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Clock, Star, Truck, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPrice, formatDistance, formatTimeAgo } from '../../utils/helpers';

export default function ListingCard({ listing, variant = 'grid' }) {
  const { toggleFavorite, isFavorite, addToast } = useApp();
  const [imageLoaded, setImageLoaded] = useState(false);

  const favorited = isFavorite(listing.id);

  const handleFavorite = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(listing.id);
      addToast(
        favorited ? 'Removed from favorites' : 'Added to favorites',
        favorited ? 'info' : 'success'
      );
    },
    [listing.id, favorited, toggleFavorite, addToast]
  );

  const primaryImage = listing.images?.[0] || listing.image;
  const isVehicle = listing.category === 'vehicles';
  const isHousing = listing.category === 'housing';

  if (variant === 'list') {
    return (
      <Link
        to={`/listing/${listing.id}`}
        className="card flex gap-4 p-3 group"
      >
        {/* Image */}
        <div className="relative flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden bg-surface-100 dark:bg-surface-800">
          {!imageLoaded && <div className="absolute inset-0 skeleton" />}
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={listing.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-surface-200 to-surface-300 dark:from-surface-700 dark:to-surface-800 flex items-center justify-center">
              <span className="text-surface-400 text-sm">Photo</span>
            </div>
          )}
          {listing.promoted && (
            <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5
                             bg-amber-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
              <TrendingUp className="w-3 h-3" />
              Promoted
            </span>
          )}
          <button
            onClick={handleFavorite}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-surface-900/80
                       backdrop-blur-sm hover:scale-110 active:scale-95 transition-transform"
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                favorited ? 'fill-red-500 text-red-500' : 'text-surface-600 dark:text-surface-300'
              }`}
            />
          </button>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          <div>
            <h3 className="font-semibold text-surface-900 dark:text-surface-100 line-clamp-2 text-sm sm:text-base group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {listing.title}
            </h3>
            <p className="mt-1 text-lg font-bold text-primary-600 dark:text-primary-400">
              {formatPrice(listing.price, listing.priceType)}
            </p>
            {isVehicle && listing.year && (
              <p className="mt-0.5 text-xs text-surface-500">
                <Truck className="w-3 h-3 inline mr-1" />
                {listing.year} {listing.make} {listing.model}
                {listing.mileage && ` \u00B7 ${(listing.mileage / 1000).toFixed(0)}k mi`}
              </p>
            )}
            {isHousing && (listing.beds != null || listing.baths != null) && (
              <p className="mt-0.5 text-xs text-surface-500">
                {listing.beds != null && `${listing.beds} bed`}
                {listing.beds != null && listing.baths != null && ' \u00B7 '}
                {listing.baths != null && `${listing.baths} bath`}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-surface-400">
            {(listing.distance != null || listing.location) && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {listing.distance != null ? formatDistance(listing.distance) : listing.location}
              </span>
            )}
            {listing.postedAt && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(listing.postedAt)}
              </span>
            )}
            {listing.rating && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {listing.rating}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Grid variant (default)
  return (
    <Link
      to={`/listing/${listing.id}`}
      className="card group overflow-hidden flex flex-col"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-100 dark:bg-surface-800">
        {!imageLoaded && primaryImage && <div className="absolute inset-0 skeleton" />}
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={listing.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-200 to-surface-300 dark:from-surface-700 dark:to-surface-800 flex items-center justify-center">
            <span className="text-surface-400 text-sm">Photo</span>
          </div>
        )}

        {/* Promoted badge */}
        {listing.promoted && (
          <span className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5
                           bg-amber-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wide shadow-sm">
            <TrendingUp className="w-3 h-3" />
            Promoted
          </span>
        )}

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          className="absolute top-2.5 right-2.5 p-2 rounded-full
                     bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm
                     opacity-0 group-hover:opacity-100 focus:opacity-100
                     hover:scale-110 active:scale-95 transition-all duration-200
                     shadow-sm"
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              favorited ? 'fill-red-500 text-red-500' : 'text-surface-600 dark:text-surface-300'
            }`}
          />
        </button>

        {/* Vehicle mileage badge */}
        {isVehicle && listing.mileage && (
          <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full
                           bg-black/60 text-white text-[10px] font-medium backdrop-blur-sm">
            {(listing.mileage / 1000).toFixed(0)}k miles
          </span>
        )}

        {/* Housing beds/baths badge */}
        {isHousing && (listing.beds != null || listing.baths != null) && (
          <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full
                           bg-black/60 text-white text-[10px] font-medium backdrop-blur-sm">
            {listing.beds != null && `${listing.beds}bd`}
            {listing.beds != null && listing.baths != null && '/'}
            {listing.baths != null && `${listing.baths}ba`}
          </span>
        )}

        {/* Condition badge */}
        {listing.condition && !isVehicle && !isHousing && (
          <span className="absolute bottom-2.5 left-2.5 badge bg-white/90 dark:bg-surface-900/90 text-surface-700 dark:text-surface-300 text-[10px] backdrop-blur-sm">
            {listing.condition}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3.5">
        {/* Price */}
        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
          {formatPrice(listing.price, listing.priceType)}
        </p>

        {/* Title */}
        <h3 className="mt-1 text-sm font-medium text-surface-900 dark:text-surface-100 line-clamp-2 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {isVehicle && listing.year
            ? `${listing.year} ${listing.make || ''} ${listing.model || listing.title}`
            : listing.title}
        </h3>

        {/* Meta */}
        <div className="mt-auto pt-2 flex items-center gap-3 text-xs text-surface-400">
          {(listing.distance != null || listing.location) && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {listing.distance != null ? formatDistance(listing.distance) : listing.location}
            </span>
          )}
          {listing.postedAt && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(listing.postedAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
