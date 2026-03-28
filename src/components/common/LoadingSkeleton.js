export function ListingCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      {/* Image placeholder */}
      <div className="aspect-[4/3] skeleton" />

      {/* Content */}
      <div className="p-3.5 space-y-3">
        {/* Price */}
        <div className="h-6 w-24 skeleton rounded-md" />
        {/* Title line 1 */}
        <div className="h-4 w-full skeleton rounded-md" />
        {/* Title line 2 */}
        <div className="h-4 w-3/4 skeleton rounded-md" />
        {/* Meta */}
        <div className="flex items-center gap-3 pt-1">
          <div className="h-3 w-16 skeleton rounded-md" />
          <div className="h-3 w-20 skeleton rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function ListingGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-16 skeleton rounded-md" />
        <div className="h-4 w-4 skeleton rounded-md" />
        <div className="h-4 w-24 skeleton rounded-md" />
        <div className="h-4 w-4 skeleton rounded-md" />
        <div className="h-4 w-32 skeleton rounded-md" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Image gallery */}
        <div className="lg:col-span-3 space-y-3">
          {/* Main image */}
          <div className="aspect-[4/3] skeleton rounded-2xl" />
          {/* Thumbnails */}
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-16 h-16 skeleton rounded-lg flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price */}
          <div className="h-10 w-40 skeleton rounded-lg" />
          {/* Title */}
          <div className="space-y-2">
            <div className="h-7 w-full skeleton rounded-lg" />
            <div className="h-7 w-2/3 skeleton rounded-lg" />
          </div>
          {/* Location & time */}
          <div className="flex items-center gap-4">
            <div className="h-4 w-28 skeleton rounded-md" />
            <div className="h-4 w-20 skeleton rounded-md" />
          </div>
          {/* Condition badge */}
          <div className="h-7 w-20 skeleton rounded-full" />
          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full skeleton rounded-md" />
            <div className="h-4 w-full skeleton rounded-md" />
            <div className="h-4 w-5/6 skeleton rounded-md" />
            <div className="h-4 w-3/4 skeleton rounded-md" />
          </div>
          {/* Buttons */}
          <div className="space-y-3 pt-4">
            <div className="h-12 w-full skeleton rounded-xl" />
            <div className="h-12 w-full skeleton rounded-xl" />
          </div>
          {/* Seller card */}
          <div className="p-4 rounded-2xl border border-surface-200 dark:border-surface-700 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 skeleton rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-32 skeleton rounded-md" />
                <div className="h-3 w-24 skeleton rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
