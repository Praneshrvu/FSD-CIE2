import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import { WatchlistProvider } from './context/WatchlistContext';

import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import WatchlistPage from './pages/WatchlistPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AddMoviePage from './pages/AddMoviePage';
import { Film } from 'lucide-react';

function NotFoundPage() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
      <Film size={60} color="#e50914" style={{ marginBottom: '1rem' }} />
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>404 - Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        The cinematic sequence you are looking for does not exist in this universe.
      </p>
      <Link to="/" className="btn-primary">
        Return to Home Page
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <WatchlistProvider>
        <Router>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1, paddingTop: '1.5rem' }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/movie/:id" element={<MovieDetailsPage />} />
                <Route path="/watchlist" element={<WatchlistPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/add-movie" element={<AddMoviePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </WatchlistProvider>
    </ErrorBoundary>
  );
}
