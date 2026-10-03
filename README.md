# 🎬 CineSphere – Full Stack React & Express Movie Application

A feature-packed, full-stack Movie Discovery, Watchlist, and Review platform built with **React.js** (Vite), **Express.js REST API**, and a modern dark-cinema UI design system.

---

## ✨ Features & Technical Implementation

- **🎨 Modern Dark-Cinema UI:** Glassmorphism, radiant gradient accents, responsive CSS Grid layout, and smooth animations.
- **🔎 Dynamic Discovery & Search:** Real-time search with multi-criteria filtering by genre pills, minimum IMDb rating slider, and multiple sort modes.
- **▶️ Trailer Modal Viewer:** Pop-up YouTube trailer player with keyboard `Escape` key and backdrop dismiss listeners.
- **📋 Personalized Watchlist:**
  - Categorize by **"Want to Watch"** vs **"Watched"**.
  - Attach editable **custom personal notes** (e.g. streaming platform, recommendations).
  - Assign private **1–5 star personal ratings**.
- **⭐ Community Reviews & Upvotes:**
  - Controlled review form with interactive star rating selector and character validation.
  - Live upvote / helpful counter per review.
- **📊 Platform Analytics (React Class Component):**
  - Built with **`React.Component`** demonstrating `this.state`, `this.setState`, `componentDidMount()`, `componentDidUpdate()`, and `componentWillUnmount()`.
  - Live genre distribution bars, IMDb overview metrics, and top-rated leaderboard.
- **➕ Custom Movie Creator:** Full controlled form to add custom movies directly to the Express.js API backend.
- **🛡️ Error Boundary:** Dedicated Class Component error boundary to prevent application crashes.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### 1. Installation
Install root, client, and server dependencies:
```bash
# In the project root directory
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

### 2. Running Both Frontend & Backend Concurrently
From the root directory, simply run:
```bash
npm run dev
```

This starts:
- 🌐 **Express Backend API:** `http://localhost:5000`
- 💻 **Vite React Frontend:** `http://localhost:5173`

---

## 📡 Express.js REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/movies` | Fetch movies with `search`, `genre`, `minRating`, `sort` query params |
| `GET` | `/api/movies/:id` | Fetch movie details along with reviews and watchlist status |
| `POST`| `/api/movies` | Add a new custom movie to the database |
| `GET` | `/api/watchlist` | Get user's populated watchlist |
| `POST`| `/api/watchlist` | Add or update movie in watchlist (`status`, `notes`, `rating`) |
| `PATCH`| `/api/watchlist/:id` | Update status or notes for a movie |
| `DELETE`| `/api/watchlist/:id`| Remove movie from watchlist |
| `GET` | `/api/reviews` | Fetch all reviews or filter by `?movieId=` |
| `POST`| `/api/reviews` | Submit a new user review with validation |
| `POST`| `/api/reviews/:id/like` | Upvote a review |
| `GET` | `/api/genres` | Fetch unique genres with movie count |
| `GET` | `/api/stats` | Analytics data for the React Class Component |

---

## 📁 Project Structure

```
CineSphere/
├── client/                     # React Frontend (Vite + React Router)
│   ├── src/
│   │   ├── components/         # Modular Functional & Class Components
│   │   ├── context/            # Global Watchlist state management
│   │   ├── pages/              # Pages: Home, MovieDetails, Watchlist, Analytics, AddMovie
│   │   ├── index.css           # Modern Dark-Cinema Design System
│   │   └── App.jsx             # Client-side router configuration
├── server/                     # Express.js REST API Backend
│   ├── data/                   # Persistent JSON files (movies, watchlist, reviews)
│   ├── server.js               # Express API and routes
│   └── package.json            # Server dependencies
├── docs/screenshots/           # High-resolution application screenshots
├── PROJECT_REPORT.md           # Technical Documentation & Report
└── package.json                # Root orchestration scripts
```

---

## 📖 Documentation
For the full technical architecture and concept breakdown, see [PROJECT_REPORT.md](file:///PROJECT_REPORT.md).
