import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Upload, X, Sparkles, ChevronLeft, ChevronRight, Check, Image, Tag, MapPin, DollarSign, Package, Truck, Eye, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';

const STEPS = ['Photos', 'Details', 'Enrichment', 'Preview'];

const CATEGORIES = [
  'Electronics', 'Furniture', 'Vehicles', 'Clothing', 'Home & Garden',
  'Sports & Outdoors', 'Toys & Games', 'Books', 'Music', 'Collectibles', 'Other',
];

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];

const AI_SUGGESTIONS = {
  title: 'Vintage Mid-Century Modern Desk Lamp',
  category: 'Home & Garden',
  condition: 'Like New',
  priceMin: 45,
  priceMax: 75,
  description:
    'Beautiful vintage desk lamp in excellent condition. Features an adjustable brass arm with a classic dome shade. Perfect for a home office or reading nook. Works perfectly with standard E26 bulbs. Minor patina on the base adds character.',
  tags: ['vintage', 'lamp', 'mid-century', 'desk lamp', 'brass'],
};

function ProgressBar({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-md mx-auto mb-8">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center flex-1 last:flex-initial">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                i < currentStep
                  ? 'bg-primary-600 text-white'
                  : i === currentStep
                  ? 'bg-primary-600 text-white ring-4 ring-primary-100 dark:ring-primary-900'
                  : 'bg-surface-200 dark:bg-surface-700 text-surface-500'
              }`}
            >
              {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span
              className={`text-[11px] mt-1.5 font-medium whitespace-nowrap ${
                i <= currentStep ? 'text-primary-600 dark:text-primary-400' : 'text-surface-400'
              }`}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 mt-[-18px] rounded transition-colors duration-300 ${
                i < currentStep ? 'bg-primary-600' : 'bg-surface-200 dark:bg-surface-700'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function PhotoStep({ photos, setPhotos }) {
  const [dragOver, setDragOver] = useState(false);

  const addPhotos = useCallback(
    (count = 1) => {
      if (photos.length >= 10) return;
      const newPhotos = [];
      for (let i = 0; i < count && photos.length + newPhotos.length < 10; i++) {
        const id = Date.now() + i;
        newPhotos.push({
          id,
          url: `https://picsum.photos/seed/${id}/600/400`,
          thumb: `https://picsum.photos/seed/${id}/200/150`,
        });
      }
      setPhotos((prev) => [...prev, ...newPhotos]);
    },
    [photos.length, setPhotos]
  );

  const removePhoto = useCallback(
    (id) => {
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    },
    [setPhotos]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      addPhotos(3);
    },
    [addPhotos]
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
          Add Photos
        </h2>
        <p className="text-surface-500 mt-1 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-accent-500" />
          AI will help create your listing
        </p>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer ${
          dragOver
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
            : 'border-surface-300 dark:border-surface-600 hover:border-primary-400 hover:bg-surface-50 dark:hover:bg-surface-800/50'
        }`}
        onClick={() => addPhotos(1)}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
            <Camera className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="font-semibold text-surface-800 dark:text-surface-200">
              Drag photos here or click to upload
            </p>
            <p className="text-sm text-surface-400 mt-1">
              Up to 10 photos - {10 - photos.length} remaining
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button onClick={() => addPhotos(1)} className="btn-primary flex-1 flex items-center justify-center gap-2">
          <Camera className="w-5 h-5" />
          Take Photo
        </button>
        <button onClick={() => addPhotos(3)} className="btn-secondary flex-1 flex items-center justify-center gap-2">
          <Upload className="w-5 h-5" />
          Upload from Gallery
        </button>
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div>
          <p className="text-xs text-surface-400 mb-3">
            Drag to reorder. First photo is the cover.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {photos.map((photo, idx) => (
              <div
                key={photo.id}
                className="relative group aspect-square rounded-xl overflow-hidden border-2 border-surface-200 dark:border-surface-700 hover:border-primary-400 transition-all"
              >
                <img
                  src={photo.thumb}
                  alt={`Upload ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {idx === 0 && (
                  <span className="absolute top-1.5 left-1.5 badge bg-primary-600 text-white text-[10px]">
                    Cover
                  </span>
                )}
                <button
                  onClick={() => removePhoto(photo.id)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailsStep({ form, setForm }) {
  const [analyzing, setAnalyzing] = useState(true);

  useState(() => {
    const timer = setTimeout(() => setAnalyzing(false), 1500);
    return () => clearTimeout(timer);
  });

  if (analyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-16 h-16 rounded-full bg-accent-100 dark:bg-accent-900/40 flex items-center justify-center animate-pulse">
          <Sparkles className="w-8 h-8 text-accent-500" />
        </div>
        <div className="flex items-center gap-2 text-surface-600 dark:text-surface-300">
          <Loader className="w-5 h-5 animate-spin" />
          <span className="font-medium">Analyzing your photos...</span>
        </div>
        <p className="text-sm text-surface-400">Our AI is identifying your item</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
          Listing Details
        </h2>
        <p className="text-surface-500 mt-1 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-accent-500" />
          AI-suggested details - edit as needed
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
          Title
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder={AI_SUGGESTIONS.title}
          className="input-field"
        />
        {!form.title && (
          <button
            onClick={() => setForm((f) => ({ ...f, title: AI_SUGGESTIONS.title }))}
            className="text-xs text-primary-600 dark:text-primary-400 mt-1 flex items-center gap-1 hover:underline"
          >
            <Sparkles className="w-3 h-3" /> Use AI suggestion
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
          Category
        </label>
        <select
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className="input-field appearance-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {form.category !== AI_SUGGESTIONS.category && (
          <button
            onClick={() => setForm((f) => ({ ...f, category: AI_SUGGESTIONS.category }))}
            className="text-xs text-primary-600 dark:text-primary-400 mt-1 flex items-center gap-1 hover:underline"
          >
            <Sparkles className="w-3 h-3" /> AI suggested: {AI_SUGGESTIONS.category}
          </button>
        )}
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
          Price
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            placeholder="0"
            className="input-field pl-10"
          />
        </div>
        <p className="text-xs text-surface-400 mt-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-accent-500" />
          AI suggests ${AI_SUGGESTIONS.priceMin} - ${AI_SUGGESTIONS.priceMax}
        </p>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
          Condition
        </label>
        <div className="grid grid-cols-4 gap-2">
          {CONDITIONS.map((c) => (
            <button
              key={c}
              onClick={() => setForm((f) => ({ ...f, condition: c }))}
              className={`py-2.5 px-3 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                form.condition === c
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300'
                  : 'border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-surface-300 dark:hover:border-surface-600'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        {form.condition !== AI_SUGGESTIONS.condition && (
          <button
            onClick={() => setForm((f) => ({ ...f, condition: AI_SUGGESTIONS.condition }))}
            className="text-xs text-primary-600 dark:text-primary-400 mt-1 flex items-center gap-1 hover:underline"
          >
            <Sparkles className="w-3 h-3" /> AI suggested: {AI_SUGGESTIONS.condition}
          </button>
        )}
      </div>
    </div>
  );
}

function EnrichmentStep({ form, setForm }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
          Add More Details
        </h2>
        <p className="text-surface-500 mt-1">Optional but helps sell faster</p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
          Description
        </label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder={AI_SUGGESTIONS.description}
          className="input-field resize-none"
        />
        {!form.description && (
          <button
            onClick={() => setForm((f) => ({ ...f, description: AI_SUGGESTIONS.description }))}
            className="text-xs text-primary-600 dark:text-primary-400 mt-1 flex items-center gap-1 hover:underline"
          >
            <Sparkles className="w-3 h-3" /> Use AI-generated description
          </button>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
          <Tag className="w-4 h-4 inline mr-1" />
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {form.tags.map((tag) => (
            <span
              key={tag}
              className="badge bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 flex items-center gap-1"
            >
              #{tag}
              <button
                onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add a tag and press Enter"
          className="input-field"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              e.preventDefault();
              const newTag = e.target.value.trim().toLowerCase();
              if (!form.tags.includes(newTag)) {
                setForm((f) => ({ ...f, tags: [...f.tags, newTag] }));
              }
              e.target.value = '';
            }
          }}
        />
        {form.tags.length === 0 && (
          <button
            onClick={() => setForm((f) => ({ ...f, tags: AI_SUGGESTIONS.tags }))}
            className="text-xs text-primary-600 dark:text-primary-400 mt-1 flex items-center gap-1 hover:underline"
          >
            <Sparkles className="w-3 h-3" /> Use AI-suggested tags
          </button>
        )}
      </div>

      {/* Shipping */}
      <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-surface-50 dark:bg-surface-800/50">
        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 text-surface-500" />
          <div>
            <p className="text-sm font-medium text-surface-800 dark:text-surface-200">
              Willing to ship?
            </p>
            <p className="text-xs text-surface-400">Reach more buyers</p>
          </div>
        </div>
        <button
          onClick={() => setForm((f) => ({ ...f, shipping: !f.shipping }))}
          className={`w-12 h-7 rounded-full transition-colors duration-200 relative ${
            form.shipping ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-600'
          }`}
        >
          <span
            className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${
              form.shipping ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
          <MapPin className="w-4 h-4 inline mr-1" />
          Location
        </label>
        <input
          type="text"
          value={form.location}
          onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
          className="input-field"
        />
        <p className="text-xs text-surface-400 mt-1">Auto-detected from your profile</p>
      </div>

      {/* Skip */}
      <p className="text-center text-sm text-surface-400">
        You can always add these later.{' '}
        <span className="text-primary-600 dark:text-primary-400 cursor-pointer hover:underline">
          Skip for now
        </span>
      </p>
    </div>
  );
}

function PreviewStep({ form, photos }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
          Preview Your Listing
        </h2>
        <p className="text-surface-500 mt-1">Here's how buyers will see it</p>
      </div>

      {/* Mini Listing Preview Card */}
      <div className="card overflow-hidden max-w-sm mx-auto">
        <div className="relative aspect-[4/3] bg-surface-100 dark:bg-surface-800 overflow-hidden">
          {photos.length > 0 ? (
            <img
              src={photos[0].url}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image className="w-12 h-12 text-surface-300" />
            </div>
          )}
          {form.condition && (
            <span className="absolute bottom-2 left-2 badge bg-white/90 dark:bg-surface-900/90 text-surface-700 dark:text-surface-300 text-[10px] backdrop-blur-sm">
              {form.condition}
            </span>
          )}
          {photos.length > 1 && (
            <span className="absolute bottom-2 right-2 badge bg-black/60 text-white text-[10px]">
              +{photos.length - 1} photos
            </span>
          )}
        </div>
        <div className="p-3">
          <p className="font-bold text-surface-900 dark:text-surface-100 text-lg">
            {form.price ? `$${form.price}` : 'Free'}
          </p>
          <h3 className="text-sm text-surface-700 dark:text-surface-300 line-clamp-2 mt-0.5">
            {form.title || AI_SUGGESTIONS.title}
          </h3>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-surface-400">
            <MapPin className="w-3 h-3" />
            <span>{form.location}</span>
          </div>
        </div>
      </div>

      {/* Full Details Preview */}
      <div className="space-y-3 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50">
        <div className="flex justify-between text-sm">
          <span className="text-surface-500">Category</span>
          <span className="font-medium text-surface-800 dark:text-surface-200">{form.category}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-surface-500">Condition</span>
          <span className="font-medium text-surface-800 dark:text-surface-200">{form.condition}</span>
        </div>
        {form.shipping && (
          <div className="flex justify-between text-sm">
            <span className="text-surface-500">Shipping</span>
            <span className="font-medium text-success">Available</span>
          </div>
        )}
        {form.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {form.tags.map((tag) => (
              <span key={tag} className="text-xs text-primary-600 dark:text-primary-400">
                #{tag}
              </span>
            ))}
          </div>
        )}
        {(form.description || AI_SUGGESTIONS.description) && (
          <p className="text-sm text-surface-600 dark:text-surface-400 pt-2 border-t border-surface-200 dark:border-surface-700">
            {form.description || AI_SUGGESTIONS.description}
          </p>
        )}
      </div>
    </div>
  );
}

export default function PostFlowPage() {
  const navigate = useNavigate();
  const { addToast } = useApp();
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [posted, setPosted] = useState(false);

  const [form, setForm] = useState({
    title: '',
    category: AI_SUGGESTIONS.category,
    condition: AI_SUGGESTIONS.condition,
    price: '',
    description: '',
    tags: [],
    shipping: false,
    location: 'Seattle, WA',
  });

  const canAdvance =
    step === 0
      ? photos.length > 0
      : step === 1
      ? (form.title || AI_SUGGESTIONS.title) && form.category && form.condition
      : true;

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const handlePost = () => {
    setPosted(true);
    addToast('Listing posted successfully!', 'success');
  };

  const handleDraft = () => {
    addToast('Draft saved!', 'info');
    navigate('/');
  };

  if (posted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6 animate-bounce">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-2">
          Listed!
        </h2>
        <p className="text-surface-500 mb-8">
          Your listing is now live and visible to buyers nearby.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              setPosted(false);
              setStep(0);
              setPhotos([]);
              setForm({
                title: '',
                category: AI_SUGGESTIONS.category,
                condition: AI_SUGGESTIONS.condition,
                price: '',
                description: '',
                tags: [],
                shipping: false,
                location: 'Seattle, WA',
              });
            }}
            className="btn-primary"
          >
            Post Another
          </button>
          <button onClick={() => navigate('/')} className="btn-secondary">
            <Eye className="w-4 h-4 inline mr-2" />
            View Listing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress */}
      <ProgressBar currentStep={step} />

      {/* Step Content */}
      <div className="min-h-[400px]">
        {step === 0 && <PhotoStep photos={photos} setPhotos={setPhotos} />}
        {step === 1 && <DetailsStep form={form} setForm={setForm} />}
        {step === 2 && <EnrichmentStep form={form} setForm={setForm} />}
        {step === 3 && <PreviewStep form={form} photos={photos} />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-surface-200 dark:border-surface-700">
        <button
          onClick={back}
          disabled={step === 0}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
            step === 0
              ? 'text-surface-300 dark:text-surface-600 cursor-not-allowed'
              : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={next}
            disabled={!canAdvance}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${
              canAdvance
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md'
                : 'bg-surface-200 dark:bg-surface-700 text-surface-400 cursor-not-allowed'
            }`}
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={handleDraft} className="btn-secondary text-sm">
              Save as Draft
            </button>
            <button onClick={handlePost} className="btn-primary flex items-center gap-2 text-sm">
              <Package className="w-4 h-4" />
              Post Listing
            </button>
          </div>
        )}
      </div>

      {/* Business link */}
      <div className="text-center mt-8">
        <Link
          to="/sell/business"
          className="text-sm text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          Selling as a business? Use our Business Tools &rarr;
        </Link>
      </div>
    </div>
  );
}
