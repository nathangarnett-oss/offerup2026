import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Car, Home as HomeIcon, Wrench, ShoppingBag, Upload, Plus,
  BarChart3, Eye, MessageCircle, TrendingUp, Edit, Trash2, Star,
  FileSpreadsheet, Link as LinkIcon, Calendar, CheckCircle, Package,
  Image,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const BUSINESS_TYPES = [
  { id: 'dealer', label: 'Auto Dealer', icon: Car, desc: 'Sell vehicles with VIN decode and dealer branding' },
  { id: 'property', label: 'Property Manager', icon: HomeIcon, desc: 'Multi-unit management and application links' },
  { id: 'service', label: 'Service Provider', icon: Wrench, desc: 'Booking, scheduling, and portfolio gallery' },
  { id: 'retailer', label: 'Retailer / Reseller', icon: ShoppingBag, desc: 'Bulk inventory tools and store branding' },
];

const MOCK_BUSINESS_LISTINGS = [
  { id: 'bl1', title: '2022 Toyota RAV4 XLE', category: 'Vehicles', price: 28500, status: 'Active', views: 342, image: 'https://picsum.photos/seed/brav4/100/100' },
  { id: 'bl2', title: '2021 Honda CR-V Sport', category: 'Vehicles', price: 26900, status: 'Active', views: 287, image: 'https://picsum.photos/seed/bcrv/100/100' },
  { id: 'bl3', title: '2020 Ford Explorer XLT', category: 'Vehicles', price: 31200, status: 'Active', views: 198, image: 'https://picsum.photos/seed/bexplorer/100/100' },
  { id: 'bl4', title: '2019 Chevrolet Silverado 1500', category: 'Vehicles', price: 29800, status: 'Sold', views: 456, image: 'https://picsum.photos/seed/bsilver/100/100' },
  { id: 'bl5', title: '2023 Mazda CX-5 Premium', category: 'Vehicles', price: 30500, status: 'Draft', views: 0, image: 'https://picsum.photos/seed/bcx5/100/100' },
  { id: 'bl6', title: '2022 Hyundai Tucson SEL', category: 'Vehicles', price: 25400, status: 'Active', views: 165, image: 'https://picsum.photos/seed/btucson/100/100' },
];

const MOCK_ANALYTICS = [
  { day: 'Mon', views: 45 },
  { day: 'Tue', views: 62 },
  { day: 'Wed', views: 38 },
  { day: 'Thu', views: 71 },
  { day: 'Fri', views: 89 },
  { day: 'Sat', views: 94 },
  { day: 'Sun', views: 56 },
];

function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    businessName: '',
    businessType: '',
    description: '',
    email: '',
    phone: '',
    website: '',
    serviceArea: '',
  });

  const handleTypeSelect = (typeId) => {
    setForm((f) => ({ ...f, businessType: typeId }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
              ${step >= s
                ? 'bg-primary-600 text-white'
                : 'bg-surface-200 dark:bg-surface-700 text-surface-500'
              }`}>
              {step > s ? <CheckCircle className="w-4 h-4" /> : s}
            </div>
            {s < 3 && (
              <div className={`w-12 h-0.5 ${step > s ? 'bg-primary-500' : 'bg-surface-200 dark:bg-surface-700'}`} />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 text-center">
            Set up your business
          </h2>
          <p className="text-surface-500 text-center mt-2 mb-8">
            Tell us about your business to unlock professional selling tools.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Business Name</label>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
                placeholder="e.g. Seattle Auto Group"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">Business Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BUSINESS_TYPES.map((type) => {
                  const Icon = type.icon;
                  const active = form.businessType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleTypeSelect(type.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all
                        ${active
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                        }`}
                    >
                      <Icon className={`w-6 h-6 mb-2 ${active ? 'text-primary-600' : 'text-surface-400'}`} />
                      <p className="font-semibold text-sm text-surface-900 dark:text-surface-100">{type.label}</p>
                      <p className="text-xs text-surface-500 mt-0.5">{type.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!form.businessName || !form.businessType}
            className="btn-primary w-full mt-8 disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 text-center">
            Business Details
          </h2>
          <p className="text-surface-500 text-center mt-2 mb-8">
            Add your logo and contact information.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-surface-100 dark:bg-surface-800 border-2 border-dashed border-surface-300 dark:border-surface-600 flex items-center justify-center cursor-pointer hover:border-primary-400 transition-colors">
                <Image className="w-6 h-6 text-surface-400" />
              </div>
              <div>
                <p className="font-medium text-sm text-surface-900 dark:text-surface-100">Upload Logo</p>
                <p className="text-xs text-surface-500">PNG or JPG, max 2MB</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                placeholder="Tell customers about your business..."
                className="input-field resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="business@email.com"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="(206) 555-0100"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Service Area</label>
              <input
                type="text"
                value={form.serviceArea}
                onChange={(e) => setForm((f) => ({ ...f, serviceArea: e.target.value }))}
                placeholder="e.g. Greater Seattle Area, 30 mile radius"
                className="input-field"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
            <button onClick={() => setStep(3)} className="btn-primary flex-1">Continue</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
            You're all set!
          </h2>
          <p className="text-surface-500 mt-2 mb-2">
            <span className="font-semibold text-surface-900 dark:text-surface-100">{form.businessName || 'Your business'}</span> is ready to start selling.
          </p>
          <p className="text-sm text-surface-400 mb-8">
            Access bulk upload tools, analytics, and promoted listings from your dashboard.
          </p>
          <button onClick={onComplete} className="btn-primary px-12">
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState('listings');
  const [vinInput, setVinInput] = useState('');
  const [vinResult, setVinResult] = useState(null);
  const [csvUploaded, setCsvUploaded] = useState(false);

  const stats = [
    { label: 'Active Listings', value: '24', icon: Package, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    { label: 'Total Views', value: '2,847', icon: Eye, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Messages', value: '18', icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Conversion', value: '4.2%', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  const maxViews = Math.max(...MOCK_ANALYTICS.map((d) => d.views));

  const handleVinDecode = () => {
    if (!vinInput.trim()) return;
    setVinResult({ year: 2022, make: 'Toyota', model: 'RAV4 XLE', trim: 'XLE Premium', engine: '2.5L 4-Cylinder', transmission: '8-Speed Automatic', drivetrain: 'AWD' });
    addToast('VIN decoded successfully', 'success');
  };

  const tabs = [
    { id: 'listings', label: 'Listings', icon: Package },
    { id: 'bulk', label: 'Bulk Upload', icon: Upload },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'tools', label: 'Dealer Tools', icon: Car },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Business Dashboard</h1>
          <p className="text-surface-500 text-sm">Seattle Auto Group</p>
        </div>
        <div className="flex gap-3">
          <Link to="/sell" className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Listing
          </Link>
          <button className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Promote
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">{stat.value}</p>
                  <p className="text-xs text-surface-500">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-100 dark:bg-surface-800 rounded-xl p-1 mb-6 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                ${activeTab === tab.id
                  ? 'bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 shadow-sm'
                  : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'listings' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700">
                  <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider p-4">Listing</th>
                  <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider p-4 hidden sm:table-cell">Category</th>
                  <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider p-4">Price</th>
                  <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider p-4 hidden md:table-cell">Status</th>
                  <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider p-4 hidden md:table-cell">Views</th>
                  <th className="text-right text-xs font-semibold text-surface-500 uppercase tracking-wider p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_BUSINESS_LISTINGS.map((item) => (
                  <tr key={item.id} className="border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-medium text-sm text-surface-900 dark:text-surface-100 truncate max-w-[200px]">{item.title}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="text-sm text-surface-500">{item.category}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-sm text-surface-900 dark:text-surface-100">${item.price.toLocaleString()}</span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={`badge ${
                        item.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        item.status === 'Sold' ? 'bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-400' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-sm text-surface-500">{item.views.toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-surface-500" />
                        </button>
                        <button className="p-1.5 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors">
                          <Star className="w-4 h-4 text-surface-500" />
                        </button>
                        <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-surface-400 hover:text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'bulk' && (
        <div className="space-y-6">
          {/* CSV Upload */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-primary-500" />
              CSV Import
            </h3>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                ${csvUploaded
                  ? 'border-green-400 bg-green-50 dark:bg-green-900/10'
                  : 'border-surface-300 dark:border-surface-600 hover:border-primary-400 dark:hover:border-primary-500'
                }`}
              onClick={() => setCsvUploaded(true)}
            >
              {csvUploaded ? (
                <>
                  <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
                  <p className="font-semibold text-surface-900 dark:text-surface-100">inventory_march.csv uploaded</p>
                  <p className="text-sm text-surface-500 mt-1">12 listings found · 10 new, 2 updates</p>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-surface-400 mx-auto mb-3" />
                  <p className="font-semibold text-surface-900 dark:text-surface-100">Drop your CSV file here</p>
                  <p className="text-sm text-surface-500 mt-1">or click to browse</p>
                </>
              )}
            </div>
            {csvUploaded && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Preview</h4>
                <div className="bg-surface-50 dark:bg-surface-800 rounded-lg overflow-hidden text-sm">
                  <div className="grid grid-cols-4 gap-2 p-3 border-b border-surface-200 dark:border-surface-700 font-medium text-surface-500">
                    <span>Title</span><span>Price</span><span>Year</span><span>Status</span>
                  </div>
                  {[
                    ['2023 Kia Sportage X-Line', '$27,500', '2023', 'New'],
                    ['2022 Subaru Outback Premium', '$28,900', '2022', 'New'],
                    ['2021 Toyota Highlander XLE', '$34,200', '2021', 'Update'],
                  ].map(([title, price, year, status], i) => (
                    <div key={i} className="grid grid-cols-4 gap-2 p-3 border-b border-surface-100 dark:border-surface-800 text-surface-700 dark:text-surface-300">
                      <span className="truncate">{title}</span><span>{price}</span><span>{year}</span>
                      <span className={status === 'New' ? 'text-green-500' : 'text-amber-500'}>{status}</span>
                    </div>
                  ))}
                </div>
                <button className="btn-primary mt-4 text-sm py-2">Import All 12 Listings</button>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700">
              <h4 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" /> Inventory Feed URL
              </h4>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://your-inventory-system.com/feed.xml"
                  className="input-field text-sm flex-1"
                />
                <button className="btn-secondary text-sm py-2 px-4 whitespace-nowrap">Connect Feed</button>
              </div>
              <p className="text-xs text-surface-400 mt-1">Supports XML, JSON, and CSV feed formats</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Views Chart */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-6">Views This Week</h3>
            <div className="flex items-end gap-3 h-48">
              {MOCK_ANALYTICS.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-medium text-surface-900 dark:text-surface-100">{d.views}</span>
                  <div
                    className="w-full bg-primary-500 rounded-t-lg transition-all hover:bg-primary-600"
                    style={{ height: `${(d.views / maxViews) * 100}%`, minHeight: '8px' }}
                  />
                  <span className="text-xs text-surface-500">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">Top Performing Listings</h3>
            <div className="space-y-3">
              {MOCK_BUSINESS_LISTINGS
                .filter((l) => l.status === 'Active')
                .sort((a, b) => b.views - a.views)
                .slice(0, 3)
                .map((item, i) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
                    <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">{item.title}</p>
                      <p className="text-xs text-surface-500">${item.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{item.views}</p>
                      <p className="text-xs text-surface-500">views</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tools' && (
        <div className="space-y-6">
          {/* VIN Decoder */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
              <Car className="w-5 h-5 text-primary-500" />
              VIN Decoder
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={vinInput}
                onChange={(e) => setVinInput(e.target.value)}
                placeholder="Enter 17-character VIN..."
                className="input-field text-sm flex-1 font-mono"
                maxLength={17}
              />
              <button onClick={handleVinDecode} className="btn-primary text-sm py-2 px-6">Decode</button>
            </div>
            {vinResult && (
              <div className="mt-4 bg-surface-50 dark:bg-surface-800 rounded-xl p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(vinResult).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-xs text-surface-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{value}</p>
                    </div>
                  ))}
                </div>
                <button className="btn-primary text-sm py-2 mt-4">Create Listing from VIN</button>
              </div>
            )}
          </div>

          {/* Dealership Branding */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary-500" />
              Dealership Branding
            </h3>
            <div className="flex items-center gap-4 p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
              <div className="w-16 h-16 rounded-xl bg-primary-600 flex items-center justify-center text-white text-xl font-bold">
                SA
              </div>
              <div>
                <p className="font-semibold text-surface-900 dark:text-surface-100">Seattle Auto Group</p>
                <p className="text-sm text-surface-500">Verified Dealer · 24 active listings</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-medium text-surface-700 dark:text-surface-300">4.8</span>
                  <span className="text-xs text-surface-400">(142 reviews)</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-surface-500 mt-3">
              Your business branding appears on all your listings. Update your logo and info in Settings.
            </p>
          </div>

          {/* Availability Calendar */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-500" />
              Test Drive Availability
            </h3>
            <div className="grid grid-cols-7 gap-1 text-center">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="text-xs font-medium text-surface-500 py-2">{d}</div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 5;
                const isToday = day === 28;
                const available = [1, 2, 3, 5, 6, 8, 9, 10, 12, 13, 15, 16, 17, 19, 20, 22, 23, 24, 26, 27, 29, 30].includes(day);
                return (
                  <div
                    key={i}
                    className={`py-2 rounded-lg text-xs transition-colors
                      ${day < 1 || day > 31
                        ? 'text-transparent'
                        : isToday
                        ? 'bg-primary-600 text-white font-bold'
                        : available
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 cursor-pointer hover:bg-green-200'
                        : 'bg-surface-100 dark:bg-surface-800 text-surface-400'
                      }`}
                  >
                    {day > 0 && day <= 31 ? day : ''}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-surface-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 dark:bg-green-900/30" /> Available</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-surface-100 dark:bg-surface-800" /> Unavailable</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BusinessPostPage() {
  const [setupComplete, setSetupComplete] = useState(false);

  return setupComplete ? (
    <Dashboard />
  ) : (
    <OnboardingFlow onComplete={() => setSetupComplete(true)} />
  );
}
