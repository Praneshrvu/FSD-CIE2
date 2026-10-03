import React from 'react';
import { Film, Video, Code2, CheckCircle2, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      marginTop: '5rem',
      background: 'rgba(8, 10, 17, 0.95)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '3rem 0 2rem 0',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          {/* Brand info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #e50914 0%, #ff4d5a 100%)',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Film size={18} color="#fff" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                Cine<span style={{ color: '#e50914' }}>Sphere</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.6 }}>
              A modern cinematic discovery and watchlist platform built with React.js, Express.js REST API, and component-driven UI architecture.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Explore CineSphere
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link to="/" style={{ color: 'var(--text-muted)' }}>Trending & Popular Movies</Link></li>
              <li><Link to="/watchlist" style={{ color: 'var(--text-muted)' }}>Personal Watchlist & Notes</Link></li>
              <li><Link to="/analytics" style={{ color: 'var(--text-muted)' }}>Platform Analytics & Statistics</Link></li>
              <li><Link to="/add-movie" style={{ color: 'var(--text-muted)' }}>Contribute a Custom Movie</Link></li>
            </ul>
          </div>

          {/* Key Features */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Core Features
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} color="#f59e0b" /> Multi-criteria genre & rating filtering
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Video size={14} color="#e50914" /> HD Trailer popups & synopsis previews
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Heart size={14} color="#ec4899" /> Community star reviews & helpful upvotes
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Code2 size={14} color="#6366f1" /> Full-Stack Express REST API backend
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          fontSize: '0.8rem',
          color: 'var(--text-dim)',
        }}>
          <div>
            © {new Date().getFullYear()} CineSphere • Cinematic Exploration & Discovery Platform
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={14} color="#10b981" /> Full Stack Architecture
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Code2 size={14} color="#6366f1" /> React + Express.js
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
