import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(undefined);

let toastIdCounter = 0;

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

const DEFAULT_LOCATION = {
  city: 'Seattle',
  state: 'WA',
  zip: '98101',
  radius: 25,
};

const MOCK_SESSION = {
  isLoggedIn: true,
  user: { id: 'u1', name: 'Alex Johnson' },
};

export function AppProvider({ children }) {
  // Favorites
  const [favorites, setFavorites] = useState(() =>
    loadFromStorage('favorites', [])
  );

  // Saved searches
  const [savedSearches, setSavedSearches] = useState(() =>
    loadFromStorage('savedSearches', [])
  );

  // Location
  const [location, setLocationState] = useState(() =>
    loadFromStorage('location', DEFAULT_LOCATION)
  );

  // Session (mock)
  const [session] = useState(MOCK_SESSION);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Persist saved searches
  useEffect(() => {
    localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
  }, [savedSearches]);

  // Persist location
  useEffect(() => {
    localStorage.setItem('location', JSON.stringify(location));
  }, [location]);

  // Favorites
  const toggleFavorite = useCallback((listingId) => {
    setFavorites((prev) =>
      prev.includes(listingId)
        ? prev.filter((id) => id !== listingId)
        : [...prev, listingId]
    );
  }, []);

  const isFavorite = useCallback(
    (listingId) => favorites.includes(listingId),
    [favorites]
  );

  // Saved searches
  const addSavedSearch = useCallback((query, filters = {}) => {
    const newSearch = {
      id: `search_${Date.now()}`,
      query,
      filters,
      createdAt: new Date().toISOString(),
    };
    setSavedSearches((prev) => [newSearch, ...prev]);
  }, []);

  const removeSavedSearch = useCallback((searchId) => {
    setSavedSearches((prev) => prev.filter((s) => s.id !== searchId));
  }, []);

  // Location
  const setLocation = useCallback((newLocation) => {
    setLocationState((prev) => ({ ...prev, ...newLocation }));
  }, []);

  // Toasts
  const addToast = useCallback((message, type = 'info') => {
    const id = ++toastIdCounter;
    const toast = { id, message, type };
    setToasts((prev) => [...prev, toast]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = {
    // Favorites
    favorites,
    toggleFavorite,
    isFavorite,

    // Saved searches
    savedSearches,
    addSavedSearch,
    removeSavedSearch,

    // Location
    location,
    setLocation,

    // Session
    session,

    // Toasts
    toasts,
    addToast,
    removeToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
