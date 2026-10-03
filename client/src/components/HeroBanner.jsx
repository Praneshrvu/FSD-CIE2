import React from 'react';
import { Play, Bookmark, Star, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';

export default function HeroBanner({ movie, onOpenTrailer }) {
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  if (!movie) return null;

  const isSaved = isInWatchlist(movie.id);

  return (
    <div style={{
      position: 'relative',
      borderRadius: '24px',
      overflow: 'hidden',
      marginBottom: '3rem',
      minHeight: '440px',
      display: 'flex',
      alignItems: 'flex-end',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--border-subtle)',
    }}>
      {/* Background Image with Gradient Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${movie.backdrop || movie.poster})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        filter: 'brightness(0.65)',
        zIndex: 1,
      }} />

      {/* Cinematic Gradient Vignette */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(180deg, rgba(8, 10, 17, 0.2) 0%, rgba(8, 10, 17, 0.95) 90%, #080a11 100%), linear-gradient(90deg, rgba(8, 10, 17, 0.9) 0%, rgba(8, 10, 17, 0.3) 60%, transparent 100%)',
        zIndex: 2,
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        padding: '2.5rem',
        maxWidth: '720px',
      }}>
        {/* Spotlight Tag */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(229, 9, 20, 0.25)', color: '#ff4d5a', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.8rem', border: '1px solid rgba(229, 9, 20, 0.4)' }}>
          ★ Featured Spotlight
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: '0.8rem',
          textShadow: '0 2px 10px rgba(0,0,0,0.7)',
        }}>
          {movie.title}
        </h1>

        {/* Metadata Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', fontSize: '0.88rem' }}>
          <span className="badge-gold">
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            {movie.rating} Rating
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}>
            <Calendar size={14} />
            {movie.year}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}>
            <Clock size={14} />
            {movie.duration}
          </span>
          <span style={{ color: 'var(--text-dim)' }}>•</span>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {movie.genres?.map((g) => (
              <span key={g} className="badge-genre">{g}</span>
            ))}
          </div>
        </div>

        <p style={{
          color: 'rgba(248, 250, 252, 0.85)',
          fontSize: '0.96rem',
          lineHeight: 1.6,
          marginBottom: '1.8rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
        }}>
          {movie.synopsis}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => onOpenTrailer(movie.trailerUrl)}
            className="btn-primary"
            style={{ padding: '0.75rem 1.6rem', fontSize: '0.95rem' }}
          >
            <Play size={18} fill="#fff" />
            Watch Trailer
          </button>

          <button
            onClick={() => toggleWatchlist(movie)}
            className="btn-secondary"
            style={{
              padding: '0.75rem 1.4rem',
              borderColor: isSaved ? '#10b981' : 'var(--border-subtle)',
              color: isSaved ? '#10b981' : '#fff',
            }}
          >
            <Bookmark size={18} fill={isSaved ? '#10b981' : 'none'} color={isSaved ? '#10b981' : 'currentColor'} />
            {isSaved ? 'In Watchlist' : 'Add to Watchlist'}
          </button>

          <button
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="btn-outline"
            style={{ padding: '0.75rem 1.3rem' }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
