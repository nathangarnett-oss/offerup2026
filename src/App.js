import { Routes, Route } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';
import Toast from './components/common/Toast';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ListingDetailPage from './pages/ListingDetailPage';
import PostFlowPage from './pages/PostFlowPage';
import BusinessPostPage from './pages/BusinessPostPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import MessagesPage from './pages/MessagesPage';

function App() {
  const { theme } = useTheme();

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-surface-950 text-surface-900 dark:text-surface-100 flex flex-col">
        <Header />
        <main className="flex-1 pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/listing/:id" element={<ListingDetailPage />} />
            <Route path="/sell" element={<PostFlowPage />} />
            <Route path="/sell/business" element={<BusinessPostPage />} />
            <Route path="/profile/:id?" element={<ProfilePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/messages" element={<MessagesPage />} />
          </Routes>
        </main>
        <Footer />
        <MobileNav />
        <Toast />
      </div>
    </div>
  );
}

export default App;
