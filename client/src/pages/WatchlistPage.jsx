import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, CheckCircle2, Clock, Film, PlusCircle } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import WatchlistCard from '../components/WatchlistCard';

export default function WatchlistPage() {
  const { watchlist, loading } = useWatchlist();
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'want_to_watch' | 'watched'

  const filteredItems = watchlist.filter((item) => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  const watchedCount = watchlist.filter((w) => w.status === 'watched').length;
  const wantToWatchCount = watchlist.filter((w) => w.status === 'want_to_watch').length;

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <Bookmark size={26} color="#10b981" />
          <h1 style={{ fontSize: '2rem', color: '#fff' }}>My CineVault Watchlist</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Track films you want to experience, record personal ratings, and write your own private viewing notes.
        </p>
      </div>

      {/* Filter Tabs & Stats Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setFilterStatus('all')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.84rem',
              fontWeight: 600,
              background: filterStatus === 'all' ? 'rgba(255,255,255,0.15)' : 'transparent',
              color: filterStatus === 'all' ? '#fff' : 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            All Movies ({watchlist.length})
          </button>

          <button
            onClick={() => setFilterStatus('want_to_watch')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.84rem',
              fontWeight: 600,
              background: filterStatus === 'want_to_watch' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: filterStatus === 'want_to_watch' ? '#818cf8' : 'var(--text-muted)',
              border: filterStatus === 'want_to_watch' ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <Clock size={14} />
            <span>Want to Watch ({wantToWatchCount})</span>
          </button>

          <button
            onClick={() => setFilterStatus('watched')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.84rem',
              fontWeight: 600,
              background: filterStatus === 'watched' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: filterStatus === 'watched' ? '#34d399' : 'var(--text-muted)',
              border: filterStatus === 'watched' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <CheckCircle2 size={14} />
            <span>Watched ({watchedCount})</span>
          </button>
        </div>

        <Link to="/" className="btn-secondary" style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}>
          <PlusCircle size={15} /> Discover More Movies
        </Link>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading your watchlist...
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredItems.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '16px',
          border: '1px dashed var(--border-subtle)',
        }}>
          <Film size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>Your Watchlist is Empty</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
            {filterStatus !== 'all'
              ? `You don't have any movies tagged as '${filterStatus.replace('_', ' ')}' right now.`
              : 'Explore the catalogue and bookmark movies to curate your personal collection.'}
          </p>
          <Link to="/" className="btn-primary">
            Explore Movies
          </Link>
        </div>
      )}

      {/* Watchlist Items Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {filteredItems.map((item) => (
          <WatchlistCard
            key={item.movieId || item.movie?.id}
            item={item}
          />
        ))}
      </div>
    </div>
  );
}
