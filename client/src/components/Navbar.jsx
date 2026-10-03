import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Film, Bookmark, BarChart3, PlusCircle, Search, Menu, X } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

export default function Navbar({ onSearch }) {
  const { watchlistCount } = useWatchlist();
  const [navSearch, setNavSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(navSearch);
    }
    navigate(`/?search=${encodeURIComponent(navSearch)}`);
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(8, 10, 17, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #e50914 0%, #ff4d5a 100%)',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(229, 9, 20, 0.5)'
          }}>
            <Film size={22} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>
              Cine<span style={{ color: '#e50914' }}>Sphere</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '-4px' }}>
              Cinema Platform
            </span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ flex: '1', maxWidth: '360px', margin: '0 2rem', display: 'flex', alignItems: 'center', position: 'relative' }}>
          <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px' }} />
          <input
            type="text"
            placeholder="Search movies, directors, cast..."
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 1rem 0.55rem 2.4rem',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              color: '#fff',
              fontSize: '0.85rem',
              outline: 'none',
              transition: 'var(--transition)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(229, 9, 20, 0.5)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
          />
        </form>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }} className="desktop-links">
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive ? '#fff' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'var(--transition)',
            })}
          >
            Home
          </NavLink>

          <NavLink
            to="/watchlist"
            style={({ isActive }) => ({
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive ? '#fff' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              position: 'relative',
              transition: 'var(--transition)',
            })}
          >
            <Bookmark size={16} />
            <span>Watchlist</span>
            {watchlistCount > 0 && (
              <span style={{
                background: '#e50914',
                color: '#fff',
                fontSize: '0.68rem',
                fontWeight: 700,
                borderRadius: '999px',
                padding: '1px 6px',
                lineHeight: '1.2',
              }}>
                {watchlistCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/analytics"
            style={({ isActive }) => ({
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive ? '#fff' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'var(--transition)',
            })}
          >
            <BarChart3 size={16} />
            <span>Analytics</span>
          </NavLink>

          <Link
            to="/add-movie"
            className="btn-primary"
            style={{ padding: '0.5rem 1.1rem', fontSize: '0.84rem' }}
          >
            <PlusCircle size={15} />
            <span>Add Movie</span>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-toggle"
          style={{ display: 'none', color: '#fff', padding: '0.5rem' }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          padding: '1rem 1.5rem',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff' }}>Home</Link>
          <Link to="/watchlist" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff' }}>
            Watchlist ({watchlistCount})
          </Link>
          <Link to="/analytics" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff' }}>
            Platform Analytics (Class Component)
          </Link>
          <Link to="/add-movie" onClick={() => setMobileMenuOpen(false)} style={{ color: '#e50914', fontWeight: 600 }}>
            + Add Custom Movie
          </Link>
        </div>
      )}
    </nav>
  );
}
