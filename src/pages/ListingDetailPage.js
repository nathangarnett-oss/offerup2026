import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Clock, Eye, Heart, Share2, Shield, Star, MessageCircle,
  ChevronRight, Truck, Car, Home as HomeIcon, Calendar, CheckCircle,
  AlertTriangle, DollarSign, Fuel, Gauge, Settings, Palette,
} from 'lucide-react';
import ImageGallery from '../components/common/ImageGallery';
import ListingCard from '../components/common/ListingCard';
import { listings } from '../data/listings';
import { users } from '../data/users';
import { useApp } from '../context/AppContext';
import {
  formatPrice,
  formatTimeAgo,
  getConditionColor,
  getConditionLabel,
} from '../utils/helpers';

/* ------------------------------------------------------------------ */
/*  Mock enrichment data per category (since the flat listings data   */
/*  doesn't carry these fields, we synthesize them for display)       */
/* ------------------------------------------------------------------ */

const VEHICLE_DATA = {
  l1: {
    year: 2019, make: 'Toyota', model: 'Camry SE', mileage: 42350,
    fuelType: 'Gasoline', transmission: 'Automatic', drivetrain: 'FWD',
    exteriorColor: 'Midnight Black', vin: '4T1B11HK5KU******',
  },
  l5: {
    year: 2021, make: 'Honda', model: 'Civic Sport', mileage: 28100,
    fuelType: 'Gasoline', transmission: 'CVT', drivetrain: 'FWD',
    exteriorColor: 'Rallye Red', vin: '2HGFE2F59MH******',
  },
  l13: {
    year: 2020, make: 'Ford', model: 'F-150 XLT', mileage: 51200,
    fuelType: 'Gasoline', transmission: 'Automatic', drivetrain: '4WD',
    exteriorColor: 'Oxford White', vin: '1FTEW1EP4LF******',
  },
};

const HOUSING_DATA = {
  l4: {
    beds: 0, baths: 1, sqft: 475, availableDate: '2026-04-15',
    amenities: ['In-unit Laundry', 'Rooftop Deck', 'Gym', 'Bike Storage', 'Package Lockers'],
    petPolicy: 'Cats & small dogs (under 25 lbs)', parking: 'Street parking',
    laundry: 'In-unit washer/dryer',
  },
  l9: {
    beds: 2, baths: 1.5, sqft: 1050, availableDate: '2026-05-01',
    amenities: ['In-unit W/D', 'Dishwasher', 'Patio', 'Central Heat', 'A/C', 'Hardwood Floors'],
    petPolicy: 'Dogs & cats welcome', parking: '1 assigned spot',
    laundry: 'In-unit washer/dryer',
  },
  l15: {
    beds: 1, baths: 1, sqft: 680, availableDate: '2026-04-01',
    amenities: ['Rooftop Deck', 'Gym', 'Concierge', 'EV Charging', 'Dog Wash Station'],
    petPolicy: 'Dogs up to 50 lbs, $50/mo pet rent', parking: 'Garage ($150/mo)',
    laundry: 'In-unit washer/dryer',
  },
};

const SERVICE_DATA = {
  l7: {
    serviceType: 'Lawn Maintenance', availability: 'Mon-Sat, 7am-6pm',
    serviceArea: 'Greater Seattle (20 mi radius)', experience: '8 years',
  },
  l14: {
    serviceType: 'Deep House Cleaning', availability: 'Mon-Fri, 8am-5pm',
    serviceArea: 'Seattle & Eastside', experience: '5 years',
  },
};

const SHIPPING_ELIGIBLE = ['l2', 'l6', 'l10'];

/* Category labels for breadcrumbs */
const CATEGORY_LABELS = {
  vehicles: 'Vehicles',
  electronics: 'Electronics',
  furniture: 'Furniture',
  housing: 'Housing',
  services: 'Services',
  jobs: 'Jobs',
};

/* ------------------------------------------------------------------ */
/*  Financing calculator helper                                       */
/* ------------------------------------------------------------------ */
function calcMonthlyPayment(principal, annualRate, termMonths) {
  if (!principal || !termMonths) return 0;
  if (!annualRate) return principal / termMonths;
  const r = annualRate / 100 / 12;
  return (principal * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite, addToast } = useApp();

  const listing = listings.find((l) => l.id === id);
  const seller = listing ? users.find((u) => u.id === listing.seller?.id) : null;
  const favorited = listing ? isFavorite(listing.id) : false;

  /* Category-specific enriched data */
  const vehicle = listing ? VEHICLE_DATA[listing.id] : null;
  const housing = listing ? HOUSING_DATA[listing.id] : null;
  const service = listing ? SERVICE_DATA[listing.id] : null;
  const canShip = listing ? SHIPPING_ELIGIBLE.includes(listing.id) : false;

  /* Financing calculator state (vehicles) */
  const [financePrice, setFinancePrice] = useState('');
  const [financeRate, setFinanceRate] = useState('6.5');
  const [financeTerm, setFinanceTerm] = useState('60');

  /* Safety tips accordion */
  const [safetyOpen, setSafetyOpen] = useState(false);

  /* Saves count (mock) */
  const savesCount = listing ? Math.floor(listing.views * 0.12) : 0;

  /* Scroll to top on mount */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  /* Set default finance price when listing loads */
  useEffect(() => {
    if (listing && vehicle) {
      setFinancePrice(String(listing.price));
    }
  }, [listing, vehicle]);

  /* Similar items */
  const similarListings = listing
    ? listings.filter((l) => l.category === listing.category && l.id !== listing.id).slice(0, 8)
    : [];

  /* ---------------------------------------------------------------- */
  /*  404 state                                                       */
  /* ---------------------------------------------------------------- */
  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <AlertTriangle className="w-16 h-16 text-warning" />
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
          Listing not found
        </h1>
        <p className="text-surface-500">
          This item may have been sold or removed.
        </p>
        <button onClick={() => navigate('/')} className="btn-primary mt-2">
          Back to Home
        </button>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Helpers                                                         */
  /* ---------------------------------------------------------------- */
  const isVehicle = listing.category === 'vehicles';
  const isHousing = listing.category === 'housing';
  const isService = listing.category === 'services';
  const isGoods = !isVehicle && !isHousing && !isService && listing.category !== 'jobs';

  const memberYear = seller?.memberSince
    ? new Date(seller.memberSince).getFullYear()
    : null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: listing.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Link copied to clipboard', 'info');
    }
  };

  const monthlyPayment = calcMonthlyPayment(
    Number(financePrice) || 0,
    Number(financeRate) || 0,
    Number(financeTerm) || 60
  );

  /* ---------------------------------------------------------------- */
  /*  Render                                                          */
  /* ---------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 pb-24 lg:pb-12">
      {/* ---- Breadcrumb ---- */}
      <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-surface-400 flex items-center gap-1 overflow-x-auto scrollbar-hide">
        <Link to="/" className="hover:text-primary-600 transition-colors whitespace-nowrap">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <Link
          to={`/?category=${listing.category}`}
          className="hover:text-primary-600 transition-colors whitespace-nowrap"
        >
          {CATEGORY_LABELS[listing.category] || listing.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-surface-600 dark:text-surface-300 truncate">
          {listing.title}
        </span>
      </nav>

      {/* ---- Image Gallery ---- */}
      <div className="lg:max-w-7xl lg:mx-auto lg:px-4">
        <ImageGallery images={listing.images} />
      </div>

      {/* ---- Two-column layout ---- */}
      <div className="max-w-7xl mx-auto px-4 mt-6 lg:mt-8 lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">
        {/* ============ LEFT COLUMN ============ */}
        <div className="space-y-8">
          {/* -- Header -- */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-50 leading-tight">
              {listing.title}
            </h1>

            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-primary-600">
              {formatPrice(listing.price, listing.priceLabel === '/mo' ? 'monthly' : undefined)}
              {listing.priceLabel && listing.priceLabel !== '/mo' && (
                <span className="text-lg font-medium text-surface-400 ml-1">
                  {listing.priceLabel}
                </span>
              )}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-surface-500 dark:text-surface-400">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {listing.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTimeAgo(listing.postedAt)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {listing.views.toLocaleString()} views
              </span>
              <span className="inline-flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {savesCount} saves
              </span>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap gap-2 mt-3">
              {listing.condition && (
                <span className={`badge ${getConditionColor(listing.condition)}`}>
                  {getConditionLabel(listing.condition)}
                </span>
              )}
              {listing.views > 500 && (
                <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  Popular
                </span>
              )}
              {canShip && (
                <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 inline-flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  Shipping available
                </span>
              )}
            </div>
          </div>

          {/* ============ VEHICLE SECTION ============ */}
          {isVehicle && vehicle && (
            <div className="space-y-6">
              {/* Specs grid */}
              <div>
                <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-3">
                  Vehicle Details
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-surface-200 dark:bg-surface-700 rounded-xl overflow-hidden">
                  {[
                    { icon: Calendar, label: 'Year', value: vehicle.year },
                    { icon: Car, label: 'Make', value: vehicle.make },
                    { icon: Car, label: 'Model', value: vehicle.model },
                    { icon: Gauge, label: 'Mileage', value: `${vehicle.mileage.toLocaleString()} mi` },
                    { icon: Fuel, label: 'Fuel Type', value: vehicle.fuelType },
                    { icon: Settings, label: 'Transmission', value: vehicle.transmission },
                    { icon: Car, label: 'Drivetrain', value: vehicle.drivetrain },
                    { icon: Palette, label: 'Exterior Color', value: vehicle.exteriorColor },
                    { icon: Shield, label: 'VIN', value: vehicle.vin },
                  ].map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="bg-white dark:bg-surface-900 p-3 sm:p-4 flex items-start gap-3"
                    >
                      <Icon className="w-4 h-4 mt-0.5 text-surface-400" />
                      <div>
                        <p className="text-xs text-surface-400">{label}</p>
                        <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vehicle history CTA */}
              <button className="btn-outline w-full flex items-center justify-center gap-2">
                <Shield className="w-5 h-5" />
                Get Vehicle History Report
              </button>

              {/* Financing calculator */}
              <div className="card p-5">
                <h3 className="font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-primary-600" />
                  Calculate Payment
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-surface-500 mb-1">Vehicle Price ($)</label>
                    <input
                      type="number"
                      className="input-field"
                      value={financePrice}
                      onChange={(e) => setFinancePrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-surface-500 mb-1">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-field"
                      value={financeRate}
                      onChange={(e) => setFinanceRate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-surface-500 mb-1">Term (months)</label>
                    <select
                      className="input-field"
                      value={financeTerm}
                      onChange={(e) => setFinanceTerm(e.target.value)}
                    >
                      {[24, 36, 48, 60, 72, 84].map((m) => (
                        <option key={m} value={m}>{m} months</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-center">
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    Estimated Monthly Payment
                  </p>
                  <p className="text-2xl font-extrabold text-primary-600 mt-1">
                    {formatPrice(Math.round(monthlyPayment))}/mo
                  </p>
                  <p className="text-[11px] text-surface-400 mt-1">
                    For illustrative purposes only. Does not include taxes or fees.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============ HOUSING SECTION ============ */}
          {isHousing && housing && (
            <div className="space-y-6">
              {/* Key stats */}
              <div className="flex items-center gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                    {housing.beds === 0 ? 'Studio' : housing.beds}
                  </p>
                  <p className="text-xs text-surface-400">{housing.beds === 0 ? '' : 'Beds'}</p>
                </div>
                <div className="w-px h-10 bg-surface-200 dark:bg-surface-700" />
                <div>
                  <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                    {housing.baths}
                  </p>
                  <p className="text-xs text-surface-400">Baths</p>
                </div>
                <div className="w-px h-10 bg-surface-200 dark:bg-surface-700" />
                <div>
                  <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                    {housing.sqft.toLocaleString()}
                  </p>
                  <p className="text-xs text-surface-400">Sq Ft</p>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-3">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {housing.amenities.map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center gap-2 text-sm text-surface-700 dark:text-surface-300
                                 bg-surface-50 dark:bg-surface-800 rounded-lg px-3 py-2"
                    >
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Details grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: HomeIcon, label: 'Pet Policy', value: housing.petPolicy },
                  { icon: Car, label: 'Parking', value: housing.parking },
                  { icon: Settings, label: 'Laundry', value: housing.laundry },
                  { icon: Calendar, label: 'Available', value: new Date(housing.availableDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50"
                  >
                    <Icon className="w-5 h-5 text-surface-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-surface-400">{label}</p>
                      <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Schedule Tour
                </button>
                <button className="btn-outline flex-1 flex items-center justify-center gap-2">
                  Apply Now
                </button>
              </div>
            </div>
          )}

          {/* ============ GENERAL GOODS SECTION ============ */}
          {isGoods && (
            <div className="space-y-4">
              {listing.condition && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                  <Shield className="w-5 h-5 text-surface-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-surface-400">Condition</p>
                    <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                      {getConditionLabel(listing.condition)}
                    </p>
                  </div>
                </div>
              )}

              {canShip && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                  <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Shipping Available
                    </p>
                    <p className="text-xs text-blue-500 dark:text-blue-400">
                      Seller offers nationwide shipping
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Make Offer
                </button>
                <button className="btn-outline flex-1 flex items-center justify-center gap-2">
                  Buy Now
                </button>
              </div>
            </div>
          )}

          {/* ============ SERVICES SECTION ============ */}
          {isService && service && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-3">
                  Service Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: Settings, label: 'Service Type', value: service.serviceType },
                    { icon: Clock, label: 'Availability', value: service.availability },
                    { icon: MapPin, label: 'Service Area', value: service.serviceArea },
                    { icon: Star, label: 'Experience', value: service.experience },
                  ].map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50"
                    >
                      <Icon className="w-5 h-5 text-surface-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-surface-400">{label}</p>
                        <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Request Quote
                </button>
                <button className="btn-outline flex-1 flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Book Now
                </button>
              </div>
            </div>
          )}

          {/* ============ DESCRIPTION ============ */}
          <div>
            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">
              Description
            </h2>
            <p className="text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {[listing.category, listing.condition, listing.location?.split(',')[0]]
                .filter(Boolean)
                .map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium
                               bg-surface-100 text-surface-600
                               dark:bg-surface-800 dark:text-surface-400"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>

          {/* ============ SIMILAR ITEMS ============ */}
          {similarListings.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4">
                Similar Items
              </h2>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
                {similarListings.map((sl) => (
                  <div key={sl.id} className="min-w-[200px] max-w-[220px] flex-shrink-0">
                    <ListingCard listing={sl} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============ RIGHT COLUMN (Seller info) ============ */}
        <div className="mt-8 lg:mt-0">
          <div className="lg:sticky lg:top-4 space-y-4">
            {/* Seller card */}
            <div className="card p-5 space-y-4">
              {/* Avatar + name */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600
                                flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {(seller?.name || listing.seller?.name || '?').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-surface-900 dark:text-surface-100 truncate">
                      {seller?.name || listing.seller?.name}
                    </p>
                    {seller?.verified && (
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                    )}
                  </div>
                  {seller && (
                    <div className="flex items-center gap-1 text-sm text-surface-500">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-medium text-surface-700 dark:text-surface-300">
                        {seller.rating}
                      </span>
                      <span>({seller.reviewCount} reviews)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Seller details */}
              {seller && (
                <div className="space-y-2 text-sm">
                  {memberYear && (
                    <p className="text-surface-500 dark:text-surface-400">
                      Member since {memberYear}
                    </p>
                  )}
                  <p className="text-surface-500 dark:text-surface-400">
                    Typically responds: <span className="font-medium text-surface-700 dark:text-surface-300">{seller.responseTime}</span>
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="space-y-2 pt-1">
                <button className="btn-primary w-full flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Message Seller
                </button>

                {isVehicle && (
                  <button className="btn-outline w-full flex items-center justify-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Make Offer
                  </button>
                )}
                {isHousing && (
                  <button className="btn-outline w-full flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Schedule Tour
                  </button>
                )}
                {isGoods && (
                  <button className="btn-outline w-full flex items-center justify-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Make Offer
                  </button>
                )}
                {isService && (
                  <button className="btn-outline w-full flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Book Now
                  </button>
                )}
              </div>

              {/* Favorite + Share */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => toggleFavorite(listing.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                              font-medium text-sm transition-all duration-200
                              ${favorited
                                ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                : 'bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700'
                              }`}
                >
                  <Heart className={`w-4 h-4 ${favorited ? 'fill-red-500' : ''}`} />
                  {favorited ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                             font-medium text-sm bg-surface-100 text-surface-600
                             hover:bg-surface-200 transition-all duration-200
                             dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Safety tips */}
            <div className="card overflow-hidden">
              <button
                onClick={() => setSafetyOpen(!safetyOpen)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="flex items-center gap-2 font-semibold text-sm text-surface-900 dark:text-surface-100">
                  <Shield className="w-5 h-5 text-primary-600" />
                  Safety Tips
                </span>
                <ChevronRight
                  className={`w-4 h-4 text-surface-400 transition-transform duration-200 ${
                    safetyOpen ? 'rotate-90' : ''
                  }`}
                />
              </button>
              {safetyOpen && (
                <div className="px-4 pb-4 space-y-2 text-sm text-surface-600 dark:text-surface-400">
                  <p className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                    Meet in a public, well-lit place
                  </p>
                  <p className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                    Never send payment before meeting
                  </p>
                  <p className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                    Inspect the item before purchasing
                  </p>
                  <p className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                    Trust your instincts -- if it seems too good to be true, it probably is
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
