import React from 'react';
import AnalyticsClassComponent from '../components/AnalyticsClassComponent';
import { Layers, CheckCircle2, Cpu, Server, Database } from 'lucide-react';

export default function AnalyticsPage() {
  const conceptsList = [
    { title: 'Components', desc: 'Divided into reusable modules (MovieCard, FilterBar, HeroBanner, etc.)', status: 'Implemented' },
    { title: 'Class Component', desc: 'Demonstrated via AnalyticsClassComponent (this.state, componentDidMount, componentDidUpdate)', status: 'Implemented' },
    { title: 'Functional Components', desc: 'Used for all main UI views, forms, modals, and layouts', status: 'Implemented' },
    { title: 'Parent-Child Components', desc: 'Data and callbacks passed between HomePage, MovieGrid, MovieCard, etc.', status: 'Implemented' },
    { title: 'Props', desc: 'Passed data objects, handlers, functions, and style configuration', status: 'Implemented' },
    { title: 'useState Hook', desc: 'Filters, search, forms, tabs, modal visibility, and ratings', status: 'Implemented' },
    { title: 'useEffect Hook', desc: 'API fetch calls, debounced queries, localStorage persistence, keyboard listeners', status: 'Implemented' },
    { title: 'Event Handling', desc: 'Click, change, submit, mouse hover, and keyboard ESC events', status: 'Implemented' },
    { title: 'Form Handling', desc: 'Controlled forms with validations in ReviewForm and AddMovieForm', status: 'Implemented' },
    { title: 'Client-Side Routing', desc: 'React Router v6 (/ , /movie/:id, /watchlist, /analytics, /add-movie)', status: 'Implemented' },
    { title: 'Responsive UI', desc: 'Dark cinema aesthetics, CSS grid, glassmorphism, responsive breakpoints', status: 'Implemented' },
    { title: 'Express.js Backend', desc: 'Express REST API server on port 5000 with CORS, JSON database, and CRUD', status: 'Implemented' },
  ];

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Analytics Class Component Showcase */}
      <AnalyticsClassComponent />

      {/* Syllabus Compliance & CIE-2 Evaluation Matrix */}
      <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <Layers size={22} color="#6366f1" />
          <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>
            CineSphere Core Architecture & Engineering Highlights
          </h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          Technical breakdown of core concepts and features powering the CineSphere React & Express.js platform.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {conceptsList.map((item, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                    {index + 1}. {item.title}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                    <CheckCircle2 size={12} /> {item.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
