import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, CheckCircle2, AlertCircle, ArrowLeft, Plus } from 'lucide-react';

export default function AddMoviePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    director: '',
    rating: 8.0,
    duration: '2h 15m',
    genres: 'Sci-Fi, Adventure',
    cast: 'Actor One, Actor Two',
    synopsis: '',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
  });

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.director.trim() || !formData.year) {
      setFeedback({ type: 'error', text: 'Please fill in Title, Director, and Release Year.' });
      return;
    }

    try {
      setSubmitting(true);
      setFeedback(null);

      const res = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        setFeedback({ type: 'success', text: 'Movie successfully added to CineSphere catalogue!' });
        setTimeout(() => {
          navigate(`/movie/${result.data.id}`);
        }, 1200);
      } else {
        setFeedback({ type: 'error', text: result.message || 'Failed to add movie.' });
      }
    } catch (err) {
      console.error('Error adding movie:', err);
      setFeedback({ type: 'error', text: 'Network communication failure. Please verify Express server.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', paddingBottom: '4rem' }}>
      <button
        onClick={() => navigate(-1)}
        className="btn-secondary"
        style={{ marginBottom: '1.5rem', padding: '0.45rem 1rem', fontSize: '0.84rem' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.5rem' }}>
          <Film size={26} color="#e50914" />
          <h1 style={{ fontSize: '1.8rem', color: '#fff' }}>Add Custom Movie to CineSphere</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '2rem' }}>
          Demonstrates advanced Form Handling with controlled inputs, field validation, and Express REST API integration.
        </p>

        {feedback && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.85rem 1.2rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${feedback.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            color: feedback.type === 'success' ? '#34d399' : '#f87171',
          }}>
            {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{feedback.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Row 1: Title and Year */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label htmlFor="title" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Movie Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="e.g., Blade Runner 2049"
                value={formData.title}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label htmlFor="year" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Release Year *
              </label>
              <input
                id="year"
                name="year"
                type="number"
                min="1900"
                max="2035"
                required
                value={formData.year}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Row 2: Director and Rating */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label htmlFor="director" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Director *
              </label>
              <input
                id="director"
                name="director"
                type="text"
                required
                placeholder="e.g., Christopher Nolan"
                value={formData.director}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label htmlFor="rating" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                IMDb Rating (0.0 - 10.0)
              </label>
              <input
                id="rating"
                name="rating"
                type="number"
                step="0.1"
                min="1"
                max="10"
                value={formData.rating}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Row 3: Genres and Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label htmlFor="genres" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Genres (comma separated)
              </label>
              <input
                id="genres"
                name="genres"
                type="text"
                placeholder="Sci-Fi, Action, Thriller"
                value={formData.genres}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label htmlFor="duration" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Duration
              </label>
              <input
                id="duration"
                name="duration"
                type="text"
                placeholder="2h 28m"
                value={formData.duration}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Cast */}
          <div>
            <label htmlFor="cast" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Cast Members (comma separated)
            </label>
            <input
              id="cast"
              name="cast"
              type="text"
              placeholder="Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page"
              value={formData.cast}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                outline: 'none',
              }}
            />
          </div>

          {/* Synopsis */}
          <div>
            <label htmlFor="synopsis" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Movie Synopsis
            </label>
            <textarea
              id="synopsis"
              name="synopsis"
              rows="3"
              placeholder="A brief overview of the plot, themes, or setting..."
              value={formData.synopsis}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Media Links */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label htmlFor="poster" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Poster Image URL
              </label>
              <input
                id="poster"
                name="poster"
                type="url"
                value={formData.poster}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label htmlFor="trailerUrl" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Trailer Embed URL (YouTube)
              </label>
              <input
                id="trailerUrl"
                name="trailerUrl"
                type="url"
                value={formData.trailerUrl}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Submit */}
          <div style={{ marginTop: '1rem' }}>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
            >
              <Plus size={18} />
              {submitting ? 'Adding Movie to Database...' : 'Save & Publish Movie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
