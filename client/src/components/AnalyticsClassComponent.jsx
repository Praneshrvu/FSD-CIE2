import React, { Component } from 'react';
import { BarChart3, Film, Star, BookmarkCheck, Heart, RefreshCw, Layers } from 'lucide-react';

/**
 * CS3301 Requirement #2: Class Component Demonstration
 * This component demonstrates:
 * 1. React.Component inheritance
 * 2. Class state management (this.state & this.setState)
 * 3. Lifecycle methods: componentDidMount, componentDidUpdate, componentWillUnmount
 * 4. Class method event handling and binding
 */
export default class AnalyticsClassComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stats: null,
      loading: true,
      error: null,
      activeTab: 'overview', // 'overview' | 'genres' | 'topRated'
      refreshCount: 0,
      lastUpdated: null,
    };

    // Binding class methods
    this.fetchStats = this.fetchStats.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  // Lifecycle Method 1: componentDidMount
  componentDidMount() {
    console.log('[AnalyticsClassComponent] Mounted. Fetching analytics from backend API...');
    this.fetchStats();
  }

  // Lifecycle Method 2: componentDidUpdate
  componentDidUpdate(prevProps, prevState) {
    if (prevState.refreshCount !== this.state.refreshCount) {
      console.log(`[AnalyticsClassComponent] Updated. Refresh count is now: ${this.state.refreshCount}`);
    }
  }

  // Lifecycle Method 3: componentWillUnmount
  componentWillUnmount() {
    console.log('[AnalyticsClassComponent] Unmounting and cleaning up resources.');
  }

  async fetchStats() {
    try {
      this.setState({ loading: true, error: null });
      const response = await fetch('/api/stats');
      if (!response.ok) throw new Error('Failed to fetch platform analytics');
      const data = await response.json();
      
      this.setState({
        stats: data.data,
        loading: false,
        lastUpdated: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      console.error('Error in AnalyticsClassComponent:', err);
      this.setState({ error: err.message, loading: false });
    }
  }

  handleRefresh() {
    this.setState(
      (prevState) => ({ refreshCount: prevState.refreshCount + 1 }),
      () => this.fetchStats()
    );
  }

  handleTabChange(tab) {
    this.setState({ activeTab: tab });
  }

  render() {
    const { stats, loading, error, activeTab, lastUpdated } = this.state;

    return (
      <div className="analytics-class-container glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        {/* Header with Title and Class Component Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <BarChart3 size={24} color="#f59e0b" />
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>CineSphere Platform Analytics</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
              <span style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, marginRight: '8px' }}>
                React Class Component
              </span>
              Demonstrating state, componentDidMount, componentDidUpdate & custom handlers.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {lastUpdated && (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Updated: {lastUpdated}
              </span>
            )}
            <button
              onClick={this.handleRefresh}
              disabled={loading}
              className="btn-secondary"
              style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}
            >
              <RefreshCw size={14} className={loading ? 'spin-icon' : ''} />
              {loading ? 'Refreshing...' : 'Refresh API'}
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
          {[
            { id: 'overview', label: 'Overview Metrics' },
            { id: 'genres', label: 'Genre Distribution' },
            { id: 'topRated', label: 'Top Rated CineVault' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => this.handleTabChange(tab.id)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: activeTab === tab.id ? 600 : 400,
                color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
                background: activeTab === tab.id ? 'rgba(229, 9, 20, 0.2)' : 'transparent',
                border: activeTab === tab.id ? '1px solid rgba(229, 9, 20, 0.4)' : '1px solid transparent',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading / Error States */}
        {loading && !stats && (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
            <p>Loading analytics data from Express backend...</p>
          </div>
        )}

        {error && (
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171' }}>
            <p>Failed to load analytics: {error}</p>
          </div>
        )}

        {/* Content based on Active Tab */}
        {stats && (
          <div>
            {activeTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Movies</span>
                    <Film size={18} color="#e50914" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: '#fff' }}>
                    {stats.totalMovies}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
                    Across multiple cinematic eras
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Average IMDb</span>
                    <Star size={18} color="#f59e0b" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: '#f59e0b' }}>
                    {stats.avgRating} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 10</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
                    Curated high-rating catalogue
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Watchlist Items</span>
                    <BookmarkCheck size={18} color="#10b981" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: '#10b981' }}>
                    {stats.watchlistStats.total}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
                    {stats.watchlistStats.watched} Watched • {stats.watchlistStats.wantToWatch} Queued
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Community Reviews</span>
                    <Heart size={18} color="#ec4899" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: '#ec4899' }}>
                    {stats.totalReviews}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
                    User feedback & star ratings
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'genres' && (
              <div>
                <h4 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Movies Count by Genre
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {Object.entries(stats.genreBreakdown).map(([genre, count]) => {
                    const percentage = Math.round((count / stats.totalMovies) * 100);
                    return (
                      <div key={genre}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                          <span style={{ fontWeight: 600 }}>{genre}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{count} movies ({percentage}%)</span>
                        </div>
                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${percentage}%`,
                              background: 'linear-gradient(90deg, #e50914, #6366f1)',
                              borderRadius: '4px',
                              transition: 'width 0.6s ease',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'topRated' && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.6rem 0.5rem' }}>Rank</th>
                      <th style={{ padding: '0.6rem 0.5rem' }}>Title</th>
                      <th style={{ padding: '0.6rem 0.5rem' }}>Year</th>
                      <th style={{ padding: '0.6rem 0.5rem' }}>Director</th>
                      <th style={{ padding: '0.6rem 0.5rem' }}>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topMovies.map((movie, idx) => (
                      <tr key={movie.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: idx === 0 ? '#f59e0b' : 'var(--text-muted)' }}>
                          #{idx + 1}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: '#fff' }}>
                          {movie.title}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>
                          {movie.year}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>
                          {movie.director}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span className="badge-gold">
                            <Star size={12} fill="#f59e0b" color="#f59e0b" />
                            {movie.rating}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
