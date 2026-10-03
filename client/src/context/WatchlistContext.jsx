import React, { createContext, useContext, useState, useEffect } from 'react';

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch watchlist from Express API on mount
  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/watchlist');
      const data = await res.json();
      if (data.success) {
        setWatchlist(data.data);
      } else {
        // Fallback to localStorage if server isn't reachable
        const local = localStorage.getItem('cinesphere_watchlist');
        if (local) setWatchlist(JSON.parse(local));
      }
    } catch (err) {
      console.warn('API fetch failed, reading localStorage fallback:', err);
      const local = localStorage.getItem('cinesphere_watchlist');
      if (local) setWatchlist(JSON.parse(local));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  // Sync to localStorage as backup
  useEffect(() => {
    localStorage.setItem('cinesphere_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Check if movie is in watchlist
  const isInWatchlist = (movieId) => {
    return watchlist.some((item) => item.movieId === movieId || item.movie?.id === movieId);
  };

  // Toggle watchlist quickly
  const toggleWatchlist = async (movie) => {
    const exists = isInWatchlist(movie.id);
    if (exists) {
      await removeFromWatchlist(movie.id);
    } else {
      await addToWatchlist(movie.id, 'want_to_watch', '', 0);
    }
  };

  // Add or update
  const addToWatchlist = async (movieId, status = 'want_to_watch', personalNotes = '', userRating = 0) => {
    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, status, personalNotes, userRating }),
      });
      if (res.ok) {
        await fetchWatchlist();
        return { success: true };
      }
    } catch (err) {
      console.error('Failed to add to watchlist:', err);
    }
    return { success: false };
  };

  // Update item (status, notes, rating)
  const updateWatchlistItem = async (movieId, updates) => {
    try {
      const res = await fetch(`/api/watchlist/${movieId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        await fetchWatchlist();
        return { success: true };
      }
    } catch (err) {
      console.error('Failed to update watchlist item:', err);
    }
    return { success: false };
  };

  // Remove item
  const removeFromWatchlist = async (movieId) => {
    try {
      const res = await fetch(`/api/watchlist/${movieId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setWatchlist((prev) => prev.filter((item) => item.movieId !== movieId && item.movie?.id !== movieId));
        return { success: true };
      }
    } catch (err) {
      console.error('Failed to remove from watchlist:', err);
    }
    return { success: false };
  };

  const value = {
    watchlist,
    loading,
    error,
    isInWatchlist,
    toggleWatchlist,
    addToWatchlist,
    updateWatchlistItem,
    removeFromWatchlist,
    refreshWatchlist: fetchWatchlist,
    watchlistCount: watchlist.length,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
