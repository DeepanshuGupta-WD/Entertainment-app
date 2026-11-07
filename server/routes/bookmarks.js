import { Router } from 'express';
import Bookmark from '../models/Bookmark.js';
import auth from '../middleware/auth.js';

const router = Router();
router.use(auth);

const out = (b) => ({
  id: b.tmdbId, mediaType: b.mediaType, title: b.title, year: b.year,
  poster: b.poster, backdrop: b.backdrop, age: b.age,
});

router.get('/', async (req, res, next) => {
  try {
    const list = await Bookmark.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(list.map(out));
  } catch (e) { next(e); }
});

// Adds the bookmark if it isn't saved yet, removes it if it is.
router.post('/toggle', async (req, res, next) => {
  try {
    const { id, mediaType, title, year, poster, backdrop, age } = req.body;
    if (!Number.isInteger(id) || !['movie', 'tv'].includes(mediaType))
      return res.status(400).json({ message: 'Invalid title' });

    const key = { user: req.userId, tmdbId: id, mediaType };
    const removed = await Bookmark.findOneAndDelete(key);
    if (removed) return res.json({ bookmarked: false });

    await Bookmark.create({ ...key, title, year, poster, backdrop, age });
    res.status(201).json({ bookmarked: true });
  } catch (e) { next(e); }
});

export default router;
