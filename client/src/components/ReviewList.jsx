import React from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';

export default function ReviewList({ reviews, onLikeReview }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border-subtle)' }}>
        No reviews yet. Be the first to share your thoughts on this movie!
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {reviews.map((rev) => (
        <div
          key={rev.id}
          className="glass-panel"
          style={{
            padding: '1.25rem',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            background: 'rgba(255, 255, 255, 0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}>
                {rev.author ? rev.author.charAt(0).toUpperCase() : <User size={14} />}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#fff' }}>{rev.author}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                  {rev.date ? new Date(rev.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '2px' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={14}
                  fill={s <= rev.rating ? '#f59e0b' : 'none'}
                  color={s <= rev.rating ? '#f59e0b' : 'var(--text-dim)'}
                />
              ))}
            </div>
          </div>

          <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '0.8rem' }}>
            {rev.reviewText}
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => onLikeReview && onLikeReview(rev.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                padding: '0.25rem 0.6rem',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              <ThumbsUp size={13} />
              <span>Helpful ({rev.likes || 0})</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
