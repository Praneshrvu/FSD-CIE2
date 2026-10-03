import React from 'react';
import MovieCard from './MovieCard';
import { Film } from 'lucide-react';

export default function MovieGrid({ movies, loading, onOpenTrailer, emptyMessage }) {
  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
        gap: '1.5rem',
      }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div
            key={n}
            className="glass-panel"
            style={{
              height: '380px',
              borderRadius: '16px',
              animation: 'pulseSlow 1.5s infinite ease-in-out',
              background: 'rgba(255, 255, 255, 0.03)',
            }}
          />
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '16px',
        border: '1px dashed var(--border-subtle)',
      }}>
        <Film size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>No Movies Found</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
          {emptyMessage || 'Try adjusting your search query, genre filter, or minimum rating threshold.'}
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
      gap: '1.5rem',
    }}>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onOpenTrailer={onOpenTrailer}
        />
      ))}
    </div>
  );
}
