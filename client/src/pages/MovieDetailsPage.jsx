import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Play, Bookmark, Clock, Calendar, Film, User, CheckCircle2 } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import TrailerModal from '../components/TrailerModal';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerOpen, setTrailerOpen] = useState(false);

  // Fetch movie details on id change (useEffect)
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/movies/${id}`);
        if (!res.ok) throw new Error('Movie not found');
        const data = await res.json();
        setMovie(data.data);
        setReviews(data.data.reviews || []);
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const handleReviewAdded = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const handleLikeReview = async (reviewId) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, likes: data.likes } : r))
        );
      }
    } catch (err) {
      console.error('Error liking review:', err);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Loading movie presentation details...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Movie Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error || 'Unable to load movie data.'}</p>
        <Link to="/" className="btn-primary">
          <ArrowLeft size={16} /> Return to Catalogue
        </Link>
      </div>
    );
  }

  const isSaved = isInWatchlist(movie.id);

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Backdrop Header */}
      <div style={{
        position: 'relative',
        minHeight: '480px',
        display: 'flex',
        alignItems: 'flex-end',
        backgroundImage: `url(${movie.backdrop || movie.poster})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        {/* Scrim Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(8, 10, 17, 0.4) 0%, rgba(8, 10, 17, 0.95) 90%, #080a11 100%), linear-gradient(90deg, rgba(8, 10, 17, 0.9) 0%, rgba(8, 10, 17, 0.4) 70%, transparent 100%)',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '2.5rem 1.5rem' }}>
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary"
            style={{ marginBottom: '1.5rem', padding: '0.45rem 1rem', fontSize: '0.84rem' }}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {/* Poster thumbnail */}
            <img
              src={movie.poster}
              alt={movie.title}
              style={{
                width: '180px',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-lg)',
                border: '2px solid rgba(255,255,255,0.1)',
                display: 'block',
              }}
            />

            <div style={{ flex: 1, maxWidth: '750px' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                {movie.genres?.map((g) => (
                  <span key={g} className="badge-genre">{g}</span>
                ))}
              </div>

              <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '0.8rem' }}>
                {movie.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap', marginBottom: '1.2rem', fontSize: '0.9rem' }}>
                <span className="badge-gold">
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  {movie.rating} / 10 IMDb
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                  <Calendar size={15} /> {movie.year}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                  <Clock size={15} /> {movie.duration}
                </span>
                <span style={{ color: 'var(--text-dim)' }}>•</span>
                <span style={{ color: 'var(--text-muted)' }}>Directed by <strong style={{ color: '#fff' }}>{movie.director}</strong></span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {movie.trailerUrl && (
                  <button
                    onClick={() => setTrailerOpen(true)}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.6rem' }}
                  >
                    <Play size={18} fill="#fff" />
                    Watch Official Trailer
                  </button>
                )}

                <button
                  onClick={() => toggleWatchlist(movie)}
                  className="btn-secondary"
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderColor: isSaved ? '#10b981' : 'var(--border-subtle)',
                    color: isSaved ? '#10b981' : '#fff',
                  }}
                >
                  <Bookmark size={18} fill={isSaved ? '#10b981' : 'none'} color={isSaved ? '#10b981' : 'currentColor'} />
                  {isSaved ? 'In Watchlist' : 'Add to Watchlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Synopsis, Cast, Reviews */}
      <div className="container" style={{ marginTop: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {/* Left Column: Synopsis & Cast */}
          <div>
            <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.8rem', color: '#fff' }}>Synopsis</h3>
              <p style={{ color: 'var(--text-main)', fontSize: '0.96rem', lineHeight: 1.7 }}>
                {movie.synopsis}
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#fff' }}>Starring Cast</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {movie.cast?.map((actor, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-muted)',
                    }}>
                      <User size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>{actor}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Cast Member</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: User Reviews & Submission */}
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <ReviewForm
                movieId={movie.id}
                movieTitle={movie.title}
                onReviewAdded={handleReviewAdded}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>
                  Audience Reviews ({reviews.length})
                </h3>
              </div>

              <ReviewList
                reviews={reviews}
                onLikeReview={handleLikeReview}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {trailerOpen && (
        <TrailerModal
          trailerUrl={movie.trailerUrl}
          onClose={() => setTrailerOpen(false)}
        />
      )}
    </div>
  );
}
