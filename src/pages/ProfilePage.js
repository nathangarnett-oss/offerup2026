import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, Shield, CheckCircle, Edit, Package, Award, Search, Trash2, Calendar } from 'lucide-react';
import ListingCard from '../components/common/ListingCard';
import { listings } from '../data/listings';
import { users } from '../data/users';
import { useApp } from '../context/AppContext';
import { formatTimeAgo } from '../utils/helpers';

const MOCK_SOLD = ['l3', 'l12'];

const MOCK_REVIEWS = [
  { id: 'r1', userId: 'u3', name: 'Sarah K.', rating: 5, date: '2026-03-20T10:00:00Z', text: 'Amazing seller! Item was exactly as described and the transaction was super smooth. Would buy from again.' },
  { id: 'r2', userId: 'u6', name: 'David L.', rating: 5, date: '2026-03-15T14:00:00Z', text: 'Quick response and very fair price. Great communication throughout.' },
  { id: 'r3', userId: 'u7', name: 'Emily W.', rating: 4, date: '2026-02-28T09:00:00Z', text: 'Good experience overall. Item had a tiny scratch not mentioned in the listing, but seller gave a small discount. Fair deal.' },
  { id: 'r4', userId: 'u14', name: 'Tom H.', rating: 5, date: '2026-02-10T16:00:00Z', text: 'Reliable and honest. Met at a convenient location on time. Highly recommended!' },
  { id: 'r5', userId: 'u11', name: 'Nate B.', rating: 5, date: '2026-01-25T11:00:00Z', text: 'One of the best sellers I have dealt with on this platform. Professional and friendly.' },
  { id: 'r6', userId: 'u4', name: 'Jordan T.', rating: 4, date: '2025-12-18T08:00:00Z', text: 'Smooth transaction, item in great shape. Would recommend.' },
  { id: 'r7', userId: 'u13', name: 'Lisa M.', rating: 5, date: '2025-11-05T13:00:00Z', text: 'Fantastic! Fast shipping, well packaged, exactly as listed. Five stars all day.' },
  { id: 'r8', userId: 'u9', name: 'Chris P.', rating: 3, date: '2025-10-12T17:00:00Z', text: 'Item was fine but took a while to arrange pickup. Communication could be better.' },
];

function StarRating({ rating, size = 'sm' }) {
  const sizeClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${sizeClass} ${
            i <= Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'text-surface-300 dark:text-surface-600'
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const initials = review.name.split(' ').map((w) => w[0]).join('').slice(0, 2);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-800">
      <div className="flex items-start gap-3">
        <div className="flex-none w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-sm font-bold">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-surface-900 dark:text-surface-100 text-sm">
              {review.name}
            </span>
            <span className="text-xs text-surface-400 flex-none">
              {formatTimeAgo(review.date)}
            </span>
          </div>
          <div className="mt-0.5">
            <StarRating rating={review.rating} />
          </div>
          <p className="mt-2 text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
            {review.text}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { id } = useParams();
  const { session, savedSearches, removeSavedSearch } = useApp();
  const [activeTab, setActiveTab] = useState('listings');
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState('');

  const isOwnProfile = !id || id === session.user.id;
  const profileUserId = isOwnProfile ? session.user.id : id;

  const user = useMemo(() => {
    const found = users.find((u) => u.id === profileUserId);
    return found || users[0];
  }, [profileUserId]);

  // Initialize bio from user data
  useState(() => {
    setBio(user.bio || '');
  });

  const sellerListings = useMemo(
    () => listings.filter((l) => l.seller.id === user.id),
    [user.id]
  );

  const activeListings = useMemo(
    () => sellerListings.filter((l) => !MOCK_SOLD.includes(l.id)),
    [sellerListings]
  );

  const soldListings = useMemo(
    () => sellerListings.filter((l) => MOCK_SOLD.includes(l.id)),
    [sellerListings]
  );

  const memberDate = new Date(user.memberSince).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const initials = user.name.split(' ').map((w) => w[0]).join('').slice(0, 2);

  const tabs = [
    { id: 'listings', label: 'Active Listings', count: activeListings.length },
    { id: 'sold', label: 'Sold Items', count: soldListings.length },
    { id: 'reviews', label: 'Reviews', count: user.reviewCount },
  ];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Profile Header */}
      <div className="bg-gradient-to-b from-primary-50 to-white dark:from-surface-900 dark:to-surface-950">
        <div className="max-w-4xl mx-auto px-4 pt-10 pb-8 sm:pt-14 sm:pb-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative flex-none">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg shadow-primary-500/20">
                {initials}
              </div>
              {user.verified && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white dark:bg-surface-900 flex items-center justify-center shadow-sm">
                  <CheckCircle className="w-6 h-6 text-primary-600 fill-primary-600" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-100">
                  {user.name}
                </h1>
                {user.verified && (
                  <span className="badge bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs gap-1">
                    <Shield className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 mt-2 text-sm text-surface-500 dark:text-surface-400">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {user.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Member since {memberDate}
                </span>
              </div>

              {isOwnProfile && (
                <Link
                  to="#"
                  className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl border border-surface-200 dark:border-surface-700 text-sm font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Link>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-3 sm:gap-6 mt-8 p-4 sm:p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-800 shadow-sm">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-lg sm:text-xl font-bold text-surface-900 dark:text-surface-100">
                  {user.rating}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl font-bold text-surface-900 dark:text-surface-100 mb-1">
                {user.reviewCount}
              </p>
              <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400">Reviews</p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl font-bold text-surface-900 dark:text-surface-100 mb-1">
                {sellerListings.length}
              </p>
              <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400">Listings</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span className="text-xs sm:text-sm font-bold text-surface-900 dark:text-surface-100 leading-tight">
                  {user.responseTime.replace('Within ', '')}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400">Response</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        {user.bio && (
          <div className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-surface-900 dark:text-surface-100 text-sm">About</h3>
              {isOwnProfile && !editingBio && (
                <button
                  onClick={() => setEditingBio(true)}
                  className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
            {editingBio ? (
              <div className="space-y-3">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="input-field text-sm resize-none"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setEditingBio(false)}
                    className="px-4 py-1.5 rounded-lg text-sm font-medium text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setEditingBio(false)}
                    className="px-4 py-1.5 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
                {bio || user.bio}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Saved Searches (own profile only) */}
      {isOwnProfile && savedSearches.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-800">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-4 h-4 text-primary-500" />
              <h3 className="font-semibold text-surface-900 dark:text-surface-100 text-sm">
                My Saved Searches
              </h3>
            </div>
            <div className="space-y-2">
              {savedSearches.map((search) => (
                <div
                  key={search.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 group"
                >
                  <Link
                    to={`/search?q=${encodeURIComponent(search.query)}`}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {search.query}
                    </p>
                    <p className="text-xs text-surface-400 mt-0.5">
                      Saved {formatTimeAgo(search.createdAt)}
                    </p>
                  </Link>
                  <button
                    onClick={() => removeSavedSearch(search.id)}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-error hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="flex gap-1 p-1 rounded-xl bg-surface-100 dark:bg-surface-800/60 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 shadow-sm'
                  : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
              }`}
            >
              {tab.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
                    : 'bg-surface-200 dark:bg-surface-700 text-surface-500 dark:text-surface-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Active Listings Tab */}
        {activeTab === 'listings' && (
          <div>
            {activeListings.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
                {activeListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
                <p className="text-surface-500 dark:text-surface-400 font-medium">No active listings</p>
              </div>
            )}
          </div>
        )}

        {/* Sold Items Tab */}
        {activeTab === 'sold' && (
          <div>
            {soldListings.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
                {soldListings.map((listing) => (
                  <div key={listing.id} className="relative">
                    <ListingCard listing={listing} />
                    <div className="absolute inset-0 bg-surface-900/40 dark:bg-surface-950/50 rounded-2xl flex items-center justify-center pointer-events-none">
                      <span className="bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 font-bold text-sm px-4 py-1.5 rounded-full shadow-lg tracking-wide">
                        SOLD
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Award className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
                <p className="text-surface-500 dark:text-surface-400 font-medium">No sold items yet</p>
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-4 pb-8">
            {MOCK_REVIEWS.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom padding */}
      <div className="h-12" />
    </div>
  );
}
