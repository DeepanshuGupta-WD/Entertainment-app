import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import bookmarkRoutes from './routes/bookmarks.js';
import tmdbRoutes from './routes/tmdb.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' })); // room for an optional base64 avatar

app.use('/api/auth', authRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/tmdb', tmdbRoutes);

app.use((err, req, res, next) => {
  if (err.status !== 404) console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong' });
});

const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(port, () => console.log(`API running on :${port}`)))
  .catch((e) => { console.error('MongoDB connection failed:', e.message); process.exit(1); });
