import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import FilterBar from '../components/FilterBar';
import MovieGrid from '../components/MovieGrid';
import TrailerModal from '../components/TrailerModal';
import { Flame, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get('search') || '';

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and Sort states (useState)
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [sortOption, setSortOption] = useState('default');
  const [trailerUrl, setTrailerUrl] = useState(null);

  // Sync search param from URL
  useEffect(() => {
    // Fetch genres
    const fetchGenres = async () => {
      try {
        const res = await fetch('/api/genres');
        const data = await res.json();
        if (data.success) {
          setGenres(data.data.map((g) => g.name));
        }
      } catch (err) {
        console.warn('Could not fetch genres:', err);
      }
    };
    fetchGenres();
  }, []);

  // Fetch movies from Express API whenever filters change (useEffect)
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (searchParam) params.append('search', searchParam);
        if (selectedGenre && selectedGenre !== 'All') params.append('genre', selectedGenre);
        if (minRating > 0) params.append('minRating', minRating);
        if (sortOption !== 'default') params.append('sort', sortOption);

        const res = await fetch(`/api/movies?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch movies from Express server');

        const data = await res.json();
        setMovies(data.data || []);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchParam, selectedGenre, minRating, sortOption]);

  const handleResetFilters = () => {
    setSelectedGenre('All');
    setMinRating(0);
    setSortOption('default');
    if (searchParam) {
      setSearchParams({});
    }
  };

  const featuredMovie = movies.find((m) => m.featured) || movies[0];

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      {/* Featured Spotlight Hero (only show when not searching) */}
      {!searchParam && featuredMovie && (
        <HeroBanner
          movie={featuredMovie}
          onOpenTrailer={(url) => setTrailerUrl(url)}
        />
      )}

      {/* Search Header notification if searching */}
      {searchParam && (
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(229, 9, 20, 0.1)', border: '1px solid rgba(229, 9, 20, 0.3)', padding: '0.8rem 1.2rem', borderRadius: '12px' }}>
          <div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Searching for: </span>
            <strong style={{ color: '#fff', fontSize: '1rem' }}>"{searchParam}"</strong>
          </div>
          <button
            onClick={() => setSearchParams({})}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.8rem' }}
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Filter and Sort Toolbar */}
      <FilterBar
        genres={genres}
        selectedGenre={selectedGenre}
        onGenreSelect={(genre) => setSelectedGenre(genre)}
        minRating={minRating}
        onRatingChange={(rating) => setMinRating(rating)}
        sortOption={sortOption}
        onSortChange={(sort) => setSortOption(sort)}
        onResetFilters={handleResetFilters}
        totalResults={movies.length}
      />

      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Flame size={22} color="#e50914" />
          <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>
            {selectedGenre !== 'All' ? `${selectedGenre} Movies` : searchParam ? 'Search Results' : 'Trending & Popular Movies'}
          </h2>
        </div>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
          Powered by Express.js API
        </span>
      </div>

      {/* Movie Grid */}
      <MovieGrid
        movies={movies}
        loading={loading}
        onOpenTrailer={(url) => setTrailerUrl(url)}
        emptyMessage={
          searchParam
            ? `No movies matched your search for "${searchParam}". Try checking spelling or resetting filters.`
            : 'No movies match the selected filters.'
        }
      />

      {/* Trailer Modal */}
      {trailerUrl && (
        <TrailerModal
          trailerUrl={trailerUrl}
          onClose={() => setTrailerUrl(null)}
        />
      )}
    </div>
  );
}
