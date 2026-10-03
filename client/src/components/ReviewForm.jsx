import React, { useState } from 'react';
import { Star, Send, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * CS3301 Requirement #8 & #9: Event Handling & Form Handling
 * Features:
 * - Controlled inputs via useState
 * - Form validation (author name, star rating 1-5, review text min length)
 * - Submission handling and feedback states
 */
export default function ReviewForm({ movieId, movieTitle, onReviewAdded }) {
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!author.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter your name.' });
      return;
    }
    if (!reviewText.trim() || reviewText.trim().length < 8) {
      setStatusMessage({ type: 'error', text: 'Review must be at least 8 characters long.' });
      return;
    }
    if (rating < 1 || rating > 5) {
      setStatusMessage({ type: 'error', text: 'Please choose a rating between 1 and 5 stars.' });
      return;
    }

    try {
      setSubmitting(true);
      setStatusMessage(null);

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId,
          movieTitle,
          author: author.trim(),
          rating,
          reviewText: reviewText.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatusMessage({ type: 'success', text: 'Thank you! Your review has been submitted.' });
        setAuthor('');
        setRating(5);
        setReviewText('');
        if (onReviewAdded) {
          onReviewAdded(data.data);
        }
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Failed to submit review.' });
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setStatusMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', color: '#fff' }}>Write a Review</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        Share your thoughts on <strong style={{ color: '#fff' }}>{movieTitle}</strong> with other movie enthusiasts.
      </p>

      {statusMessage && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          marginBottom: '1.2rem',
          fontSize: '0.88rem',
          background: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          border: `1px solid ${statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          color: statusMessage.type === 'success' ? '#34d399' : '#f87171',
        }}>
          {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        {/* Star Rating Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Your Rating ({rating} of 5 Stars)
          </label>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{
                  padding: '4px',
                  transition: 'transform 0.15s ease',
                  transform: (hoverRating || rating) >= star ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                <Star
                  size={24}
                  fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'}
                  color={(hoverRating || rating) >= star ? '#f59e0b' : 'var(--text-dim)'}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Author Input */}
        <div>
          <label htmlFor="author-input" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Your Name or Pseudonym *
          </label>
          <input
            id="author-input"
            type="text"
            required
            placeholder="e.g., Sarah Connor"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
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

        {/* Review Text */}
        <div>
          <label htmlFor="review-text" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Your Review Thoughts *
          </label>
          <textarea
            id="review-text"
            rows="3"
            required
            placeholder="What did you love or dislike about the direction, acting, or story?"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
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

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Send size={16} />
            {submitting ? 'Submitting Review...' : 'Post Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
