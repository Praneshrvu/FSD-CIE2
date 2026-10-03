import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Play, Bookmark, Clock } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

/**
 * CS3301 Requirement #1, #3, #4, #5:
 * Functional component receiving props from parent, demonstrating parent-child communication.
 */
export default function MovieCard({ movie, onOpenTrailer }) {
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const [imgLoaded, setImgLoaded] = useState(false);

  const isSaved = isInWatchlist(movie.id);

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    toggleWatchlist(movie);
  };

  const handleTrailerClick = (e) => {
    e.stopPropagation();
    if (onOpenTrailer) {
      onOpenTrailer(movie.trailerUrl);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="movie-card glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease',
        background: 'var(--bg-card)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 16px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      {/* Poster Image Container */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '145%', overflow: 'hidden', background: '#111625' }}>
        <img
          src={movie.poster}
          alt={movie.title}
          onLoad={() => setImgLoaded(true)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease, opacity 0.3s ease',
            opacity: imgLoaded ? 1 : 0.4,
          }}
          className="movie-poster-img"
        />

        {/* Gradient scrim */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(to top, rgba(8, 10, 17, 0.95) 0%, transparent 100%)',
        }} />

        {/* Top Badges */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
          <span className="badge-gold">
            <Star size={11} fill="#f59e0b" color="#f59e0b" />
            {movie.rating}
          </span>

          {/* Quick Watchlist Bookmark Button */}
          <button
            onClick={handleWatchlistClick}
            title={isSaved ? "Remove from watchlist" : "Add to watchlist"}
            style={{
              background: isSaved ? 'rgba(16, 185, 129, 0.85)' : 'rgba(8, 10, 17, 0.75)',
              backdropFilter: 'blur(8px)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              border: isSaved ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.15)',
              transition: 'var(--transition)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Bookmark size={15} fill={isSaved ? '#fff' : 'none'} color="#fff" />
          </button>
        </div>

        {/* Hover Trailer Overlay Button */}
        {movie.trailerUrl && (
          <button
            onClick={handleTrailerClick}
            title="Watch Trailer"
            style={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(229, 9, 20, 0.88)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(229, 9, 20, 0.6)',
              opacity: 0.9,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.15)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)')}
          >
            <Play size={20} fill="#fff" style={{ marginLeft: '2px' }} />
          </button>
        )}
      </div>

      {/* Info Section */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            <span>{movie.year}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Clock size={11} /> {movie.duration}
            </span>
          </div>

          <h3 style={{
            fontSize: '1rem',
            fontWeight: 700,
            lineHeight: 1.3,
            marginBottom: '0.5rem',
            color: '#fff',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {movie.title}
          </h3>
        </div>

        {/* Genres */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.5rem' }}>
          {movie.genres?.slice(0, 2).map((genre) => (
            <span key={genre} className="badge-genre">
              {genre}
            </span>
          ))}
          {movie.genres?.length > 2 && (
            <span className="badge-genre">+{movie.genres.length - 2}</span>
          )}
        </div>
      </div>
    </div>
  );
}
