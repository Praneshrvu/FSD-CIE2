import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Custom request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// File paths
const MOVIES_FILE = path.join(__dirname, 'data', 'movies.json');
const WATCHLIST_FILE = path.join(__dirname, 'data', 'watchlist.json');
const REVIEWS_FILE = path.join(__dirname, 'data', 'reviews.json');

// Helper functions for reading/writing files
async function readData(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
}

async function writeData(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    throw err;
  }
}

/* =========================================================
   ROUTES: MOVIES
========================================================= */

// GET /api/movies - List movies with search, filter, and sort
app.get('/api/movies', async (req, res) => {
  try {
    let movies = await readData(MOVIES_FILE);
    const { search, genre, minRating, sort, featured, trending } = req.query;

    if (search) {
      const q = search.toLowerCase().trim();
      movies = movies.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q) ||
          m.cast.some((actor) => actor.toLowerCase().includes(q))
      );
    }

    if (genre && genre !== 'All') {
      movies = movies.filter((m) =>
        m.genres.map((g) => g.toLowerCase()).includes(genre.toLowerCase())
      );
    }

    if (minRating) {
      const min = parseFloat(minRating);
      if (!isNaN(min)) {
        movies = movies.filter((m) => m.rating >= min);
      }
    }

    if (featured === 'true') {
      movies = movies.filter((m) => m.featured);
    }

    if (trending === 'true') {
      movies = movies.filter((m) => m.trending);
    }

    if (sort) {
      if (sort === 'rating-desc') {
        movies.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'rating-asc') {
        movies.sort((a, b) => a.rating - b.rating);
      } else if (sort === 'year-desc') {
        movies.sort((a, b) => b.year - a.year);
      } else if (sort === 'year-asc') {
        movies.sort((a, b) => a.year - b.year);
      } else if (sort === 'title-asc') {
        movies.sort((a, b) => a.title.localeCompare(b.title));
      }
    }

    res.json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving movies', error: error.message });
  }
});

// GET /api/movies/:id - Get movie details + user reviews + watchlist status
app.get('/api/movies/:id', async (req, res) => {
  try {
    const movies = await readData(MOVIES_FILE);
    const movie = movies.find((m) => m.id === req.params.id);

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    const reviews = await readData(REVIEWS_FILE);
    const movieReviews = reviews.filter((r) => r.movieId === movie.id);

    const watchlist = await readData(WATCHLIST_FILE);
    const watchItem = watchlist.find((w) => w.movieId === movie.id);

    res.json({
      success: true,
      data: {
        ...movie,
        reviews: movieReviews,
        inWatchlist: !!watchItem,
        watchlistData: watchItem || null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving movie details', error: error.message });
  }
});

// POST /api/movies - Add a custom new movie to the platform (Student Modification / Admin feature)
app.post('/api/movies', async (req, res) => {
  try {
    const { title, year, genres, rating, duration, director, cast, synopsis, poster, backdrop, trailerUrl } = req.body;

    if (!title || !year || !director) {
      return res.status(400).json({ success: false, message: 'Title, year, and director are required.' });
    }

    const movies = await readData(MOVIES_FILE);

    const newMovie = {
      id: `m${Date.now()}`,
      title: title.trim(),
      year: parseInt(year, 10),
      genres: Array.isArray(genres) ? genres : genres ? genres.split(',').map((g) => g.trim()) : ['Drama'],
      rating: parseFloat(rating) || 7.5,
      duration: duration || '2h 00m',
      director: director.trim(),
      cast: Array.isArray(cast) ? cast : cast ? cast.split(',').map((c) => c.trim()) : [],
      synopsis: synopsis || 'No synopsis provided.',
      poster: poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
      backdrop: backdrop || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
      trailerUrl: trailerUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      featured: false,
      trending: true,
    };

    movies.unshift(newMovie);
    await writeData(MOVIES_FILE, movies);

    res.status(201).json({ success: true, message: 'Movie added successfully!', data: newMovie });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add movie', error: error.message });
  }
});

/* =========================================================
   ROUTES: GENRES & STATS (For Class Component & Dashboard)
========================================================= */

app.get('/api/genres', async (req, res) => {
  try {
    const movies = await readData(MOVIES_FILE);
    const genreCounts = {};

    movies.forEach((m) => {
      m.genres.forEach((g) => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });

    const genres = Object.keys(genreCounts).map((name) => ({
      name,
      count: genreCounts[name],
    }));

    res.json({ success: true, data: genres });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving genres' });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const movies = await readData(MOVIES_FILE);
    const watchlist = await readData(WATCHLIST_FILE);
    const reviews = await readData(REVIEWS_FILE);

    const totalMovies = movies.length;
    const avgRating = totalMovies > 0 ? (movies.reduce((acc, m) => acc + m.rating, 0) / totalMovies).toFixed(1) : 0;
    const watchedCount = watchlist.filter((w) => w.status === 'watched').length;
    const wantToWatchCount = watchlist.filter((w) => w.status === 'want_to_watch').length;

    // Top rated movies
    const topMovies = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 5);

    // Genre distribution
    const genreMap = {};
    movies.forEach((m) => {
      m.genres.forEach((g) => {
        genreMap[g] = (genreMap[g] || 0) + 1;
      });
    });

    res.json({
      success: true,
      data: {
        totalMovies,
        avgRating,
        totalReviews: reviews.length,
        watchlistStats: {
          total: watchlist.length,
          watched: watchedCount,
          wantToWatch: wantToWatchCount,
        },
        genreBreakdown: genreMap,
        topMovies,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
});

/* =========================================================
   ROUTES: WATCHLIST (Student Modification #1)
========================================================= */

// GET /api/watchlist - Get populated watchlist items
app.get('/api/watchlist', async (req, res) => {
  try {
    const watchlist = await readData(WATCHLIST_FILE);
    const movies = await readData(MOVIES_FILE);

    const populated = watchlist.map((item) => {
      const movie = movies.find((m) => m.id === item.movieId);
      return {
        ...item,
        movie: movie || null,
      };
    }).filter((item) => item.movie !== null);

    res.json({ success: true, count: populated.length, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving watchlist' });
  }
});

// POST /api/watchlist - Add or update watchlist item
app.post('/api/watchlist', async (req, res) => {
  try {
    const { movieId, status = 'want_to_watch', personalNotes = '', userRating = 0 } = req.body;

    if (!movieId) {
      return res.status(400).json({ success: false, message: 'Movie ID is required' });
    }

    const watchlist = await readData(WATCHLIST_FILE);
    const existingIndex = watchlist.findIndex((item) => item.movieId === movieId);

    if (existingIndex > -1) {
      // Update existing
      watchlist[existingIndex] = {
        ...watchlist[existingIndex],
        status,
        personalNotes,
        userRating,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Add new
      watchlist.unshift({
        movieId,
        addedAt: new Date().toISOString(),
        status,
        personalNotes,
        userRating,
      });
    }

    await writeData(WATCHLIST_FILE, watchlist);
    res.json({ success: true, message: 'Watchlist updated successfully', data: watchlist });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating watchlist' });
  }
});

// PATCH /api/watchlist/:id - Toggle status or update notes
app.patch('/api/watchlist/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    const { status, personalNotes, userRating } = req.body;

    const watchlist = await readData(WATCHLIST_FILE);
    const item = watchlist.find((w) => w.movieId === movieId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not in watchlist' });
    }

    if (status !== undefined) item.status = status;
    if (personalNotes !== undefined) item.personalNotes = personalNotes;
    if (userRating !== undefined) item.userRating = userRating;
    item.updatedAt = new Date().toISOString();

    await writeData(WATCHLIST_FILE, watchlist);
    res.json({ success: true, message: 'Watchlist item updated', data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating watchlist item' });
  }
});

// DELETE /api/watchlist/:movieId - Remove from watchlist
app.delete('/api/watchlist/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    let watchlist = await readData(WATCHLIST_FILE);
    const initialLen = watchlist.length;
    watchlist = watchlist.filter((item) => item.movieId !== movieId);

    if (watchlist.length === initialLen) {
      return res.status(404).json({ success: false, message: 'Movie not found in watchlist' });
    }

    await writeData(WATCHLIST_FILE, watchlist);
    res.json({ success: true, message: 'Movie removed from watchlist' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing from watchlist' });
  }
});

/* =========================================================
   ROUTES: REVIEWS (Student Modification #2)
========================================================= */

// GET /api/reviews - Get reviews
app.get('/api/reviews', async (req, res) => {
  try {
    let reviews = await readData(REVIEWS_FILE);
    const { movieId } = req.query;

    if (movieId) {
      reviews = reviews.filter((r) => r.movieId === movieId);
    }

    // Sort newest first
    reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving reviews' });
  }
});

// POST /api/reviews - Submit a new review
app.post('/api/reviews', async (req, res) => {
  try {
    const { movieId, movieTitle, author, rating, reviewText } = req.body;

    if (!movieId || !author || !rating || !reviewText) {
      return res.status(400).json({
        success: false,
        message: 'All fields (movieId, author, rating, reviewText) are required.',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5 stars.' });
    }

    const reviews = await readData(REVIEWS_FILE);
    const newReview = {
      id: `rev-${Date.now()}`,
      movieId,
      movieTitle: movieTitle || 'Movie',
      author: author.trim(),
      rating: Number(rating),
      reviewText: reviewText.trim(),
      date: new Date().toISOString(),
      likes: 0,
    };

    reviews.unshift(newReview);
    await writeData(REVIEWS_FILE, reviews);

    res.status(201).json({ success: true, message: 'Review posted successfully!', data: newReview });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error posting review' });
  }
});

// POST /api/reviews/:id/like - Upvote a review
app.post('/api/reviews/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await readData(REVIEWS_FILE);
    const review = reviews.find((r) => r.id === id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.likes = (review.likes || 0) + 1;
    await writeData(REVIEWS_FILE, reviews);

    res.json({ success: true, likes: review.likes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error liking review' });
  }
});

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` CineSphere Express Backend running on port ${PORT} `);
  console.log(` API Endpoint: http://localhost:${PORT}/api/movies `);
  console.log(`===============================================`);
});
