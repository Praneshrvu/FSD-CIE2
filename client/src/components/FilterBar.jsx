import React from 'react';
import { SlidersHorizontal, RotateCcw, ArrowUpDown, Star } from 'lucide-react';

export default function FilterBar({
  genres,
  selectedGenre,
  onGenreSelect,
  minRating,
  onRatingChange,
  sortOption,
  onSortChange,
  onResetFilters,
  totalResults,
}) {
  const isFiltered = selectedGenre !== 'All' || minRating > 0 || sortOption !== 'default';

  return (
    <div className="filter-bar glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
      {/* Top row: Genre Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap', marginRight: '0.5rem' }}>
          Genres:
        </span>
        {['All', ...genres].map((genre) => {
          const isActive = selectedGenre === genre;
          return (
            <button
              key={genre}
              onClick={() => onGenreSelect(genre)}
              style={{
                padding: '0.35rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: isActive ? 600 : 400,
                whiteSpace: 'nowrap',
                transition: 'var(--transition)',
                background: isActive ? 'linear-gradient(135deg, #e50914, #ff3366)' : 'rgba(255, 255, 255, 0.05)',
                color: isActive ? '#fff' : 'var(--text-muted)',
                border: isActive ? '1px solid #ff3366' : '1px solid var(--border-subtle)',
                boxShadow: isActive ? '0 2px 10px rgba(229, 9, 20, 0.3)' : 'none',
              }}
            >
              {genre}
            </button>
          );
        })}
      </div>

      {/* Bottom row: Rating Filter + Sort + Reset */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Rating Slider & Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Star size={15} color="#f59e0b" fill="#f59e0b" />
            <span>Min Rating:</span>
            <strong style={{ color: '#fff', minWidth: '28px' }}>{minRating > 0 ? `${minRating}+` : 'Any'}</strong>
          </div>
          <input
            type="range"
            min="0"
            max="9"
            step="0.5"
            value={minRating}
            onChange={(e) => onRatingChange(parseFloat(e.target.value))}
            style={{
              accentColor: '#e50914',
              cursor: 'pointer',
              width: '120px',
            }}
          />
        </div>

        {/* Sort and Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={15} color="var(--text-muted)" />
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.84rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="default" style={{ background: '#0f1422' }}>Sort: Default</option>
              <option value="rating-desc" style={{ background: '#0f1422' }}>Highest Rated (★ 9 - 1)</option>
              <option value="rating-asc" style={{ background: '#0f1422' }}>Lowest Rated</option>
              <option value="year-desc" style={{ background: '#0f1422' }}>Newest Releases</option>
              <option value="year-asc" style={{ background: '#0f1422' }}>Classic Releases</option>
              <option value="title-asc" style={{ background: '#0f1422' }}>Alphabetical (A - Z)</option>
            </select>
          </div>

          <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
            Showing <strong>{totalResults}</strong> movies
          </span>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="btn-secondary"
              style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}
            >
              <RotateCcw size={12} />
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
