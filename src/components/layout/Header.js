import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, MapPin, Sun, Moon, Heart, MessageCircle, Menu, X, User, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { location, favorites, session } = useApp();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass shadow-lg'
            : 'bg-white dark:bg-surface-950'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-1">
              <span className="text-xl sm:text-2xl font-extrabold text-gradient">
                NearbyFinds
              </span>
            </Link>

            {/* Center search bar - hidden on home page and mobile */}
            {!isHome && (
              <form
                onSubmit={handleSearch}
                className={`hidden md:flex items-center transition-all duration-300 ${
                  searchFocused ? 'w-96' : 'w-64'
                }`}
              >
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Search listings..."
                    className="w-full pl-9 pr-4 py-2 rounded-full bg-surface-100 dark:bg-surface-800
                               text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400
                               border border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-surface-900
                               focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-200"
                  />
                </div>
              </form>
            )}

            {/* Right side nav */}
            <div className="hidden md:flex items-center gap-1">
              {/* Location selector */}
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm
                                 text-surface-600 dark:text-surface-300 hover:bg-surface-100
                                 dark:hover:bg-surface-800 transition-colors">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span className="font-medium">{location.city}, {location.state}</span>
              </button>

              {/* Browse */}
              <Link
                to="/browse"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith('/browse')
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                    : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
              >
                Browse
              </Link>

              {/* Sell */}
              <Link
                to="/sell"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                           text-primary-600 dark:text-primary-400 hover:bg-primary-50
                           dark:hover:bg-primary-900/30 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Sell
              </Link>

              {/* Messages */}
              <Link
                to="/messages"
                className={`relative p-2 rounded-lg transition-colors ${
                  pathname.startsWith('/messages')
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                    : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
                aria-label="Messages"
              >
                <MessageCircle className="w-5 h-5" />
              </Link>

              {/* Favorites */}
              <Link
                to="/favorites"
                className={`relative p-2 rounded-lg transition-colors ${
                  pathname.startsWith('/favorites')
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                    : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
                aria-label="Favorites"
              >
                <Heart className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center
                                   text-[10px] font-bold text-white bg-red-500 rounded-full min-w-[18px] h-[18px]">
                    {favorites.length > 99 ? '99+' : favorites.length}
                  </span>
                )}
              </Link>

              {/* Dark mode toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-surface-600 dark:text-surface-300
                           hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Profile avatar */}
              <Link
                to="/profile"
                className="ml-1 flex items-center justify-center w-8 h-8 rounded-full
                           bg-gradient-to-br from-primary-500 to-accent-500 text-white
                           text-sm font-semibold hover:shadow-md transition-shadow"
              >
                {session.isLoggedIn ? session.user.name.charAt(0) : <User className="w-4 h-4" />}
              </Link>
            </div>

            {/* Mobile hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-surface-600 dark:text-surface-300"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-lg text-surface-600 dark:text-surface-300
                           hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile slide-in menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Panel */}
          <div
            className="absolute right-0 top-0 h-full w-80 max-w-[85vw]
                       bg-white dark:bg-surface-900 shadow-2xl
                       animate-[slideInFromRight_0.3s_ease-out]"
            style={{ animationFillMode: 'both' }}
          >
            <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
              <span className="text-lg font-bold text-gradient">NearbyFinds</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-surface-600 dark:text-surface-300" />
              </button>
            </div>

            {/* User info */}
            {session.isLoggedIn && (
              <div className="flex items-center gap-3 p-4 border-b border-surface-200 dark:border-surface-700">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500
                                flex items-center justify-center text-white font-semibold">
                  {session.user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-surface-900 dark:text-surface-100">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-surface-500">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {location.city}, {location.state}
                  </p>
                </div>
              </div>
            )}

            <nav className="p-4 space-y-1">
              {[
                { to: '/browse', label: 'Browse', icon: Search },
                { to: '/sell', label: 'Sell an Item', icon: Plus },
                { to: '/messages', label: 'Messages', icon: MessageCircle },
                { to: '/favorites', label: `Favorites${favorites.length ? ` (${favorites.length})` : ''}`, icon: Heart },
                { to: '/profile', label: 'Profile', icon: User },
              ].map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname.startsWith(to)
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Inline keyframes for mobile menu animation */}
      <style>{`
        @keyframes slideInFromRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
