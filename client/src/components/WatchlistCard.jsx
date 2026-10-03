import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Trash2, Edit3, Save, Star } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

export default function WatchlistCard({ item }) {
  const { movie } = item;
  const { updateWatchlistItem, removeFromWatchlist } = useWatchlist();

  const [isEditingNote, setIsEditingNote] = useState(false);
  const [notes, setNotes] = useState(item.personalNotes || '');
  const [userRating, setUserRating] = useState(item.userRating || 0);

  if (!movie) return null;

  const handleStatusToggle = async () => {
    const nextStatus = item.status === 'watched' ? 'want_to_watch' : 'watched';
    await updateWatchlistItem(movie.id, { status: nextStatus });
  };

  const handleSaveNotes = async () => {
    await updateWatchlistItem(movie.id, { personalNotes: notes });
    setIsEditingNote(false);
  };

  const handleRatingChange = async (rating) => {
    setUserRating(rating);
    await updateWatchlistItem(movie.id, { userRating: rating });
  };

  const handleRemove = async () => {
    await removeFromWatchlist(movie.id);
  };

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
        background: 'var(--bg-card)',
        transition: 'var(--transition)',
      }}
    >
      <div style={{ display: 'flex', gap: '1rem', padding: '1.25rem' }}>
        {/* Poster Thumbnail */}
        <Link to={`/movie/${movie.id}`} style={{ flexShrink: 0 }}>
          <img
            src={movie.poster}
            alt={movie.title}
            style={{
              width: '90px',
              height: '130px',
              objectFit: 'cover',
              borderRadius: '10px',
              boxShadow: 'var(--shadow-sm)',
            }}
          />
        </Link>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
              <div>
                <Link to={`/movie/${movie.id}`}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>
                    {movie.title}
                  </h3>
                </Link>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {movie.year} • {movie.director} • <span style={{ color: '#f59e0b' }}>★ {movie.rating}</span>
                </div>
              </div>

              {/* Remove button */}
              <button
                onClick={handleRemove}
                title="Remove from watchlist"
                style={{
                  color: 'var(--text-dim)',
                  padding: '4px',
                  borderRadius: '6px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Watch Status Badge / Toggle */}
            <div style={{ marginTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleStatusToggle}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.3rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  transition: 'var(--transition)',
                  background: item.status === 'watched' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                  border: `1px solid ${item.status === 'watched' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`,
                  color: item.status === 'watched' ? '#34d399' : '#818cf8',
                }}
              >
                {item.status === 'watched' ? (
                  <>
                    <CheckCircle2 size={14} />
                    <span>Watched</span>
                  </>
                ) : (
                  <>
                    <Clock size={14} />
                    <span>Want to Watch</span>
                  </>
                )}
              </button>

              {/* Personal Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginRight: '4px' }}>My Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    style={{ padding: '2px' }}
                    title={`Rate ${star} star`}
                  >
                    <Star
                      size={14}
                      fill={star <= userRating ? '#f59e0b' : 'none'}
                      color={star <= userRating ? '#f59e0b' : 'var(--text-dim)'}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Personal Notes Section */}
          <div style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {isEditingNote ? (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add custom notes, streaming service, who to watch with..."
                  style={{
                    flex: 1,
                    padding: '0.4rem 0.7rem',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.82rem',
                    outline: 'none',
                  }}
                  autoFocus
                />
                <button
                  onClick={handleSaveNotes}
                  className="btn-primary"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                >
                  <Save size={13} /> Save
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.82rem', color: notes ? 'var(--text-muted)' : 'var(--text-dim)', fontStyle: notes ? 'normal' : 'italic' }}>
                  {notes || 'No personal notes attached.'}
                </p>
                <button
                  onClick={() => setIsEditingNote(true)}
                  style={{
                    color: 'var(--text-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '0.75rem',
                    padding: '2px 6px',
                  }}
                >
                  <Edit3 size={12} /> Edit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
