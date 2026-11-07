import { Router } from 'express';
import auth from '../middleware/auth.js';

// The API key stays on the server; the browser only talks to /api/tmdb/*.
const router = Router();
router.use(auth);

const BASE = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p/';
const isType = (t) => t === 'movie' || t === 'tv';
const pageOf = (req) => Math.min(Math.max(parseInt(req.query.page, 10) || 1, 1), 500);

async function tmdb(path, params = {}) {
  const url = new URL(BASE + path);
  url.searchParams.set('api_key', process.env.TMDB_API_KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const r = await fetch(url);
  if (!r.ok) {
    const e = new Error(r.status === 404 ? 'Title not found' : 'Could not reach TMDB');
    e.status = r.status === 404 ? 404 : 502;
    throw e;
  }
  return r.json();
}

// One card shape for everything the client lists.
const norm = (r, type) => ({
  id: r.id,
  mediaType: type || r.media_type,
  title: r.title || r.name,
  year: (r.release_date || r.first_air_date || '').slice(0, 4),
  poster: r.poster_path ? IMG + 'w500' + r.poster_path : null,
  backdrop: r.backdrop_path ? IMG + 'w780' + r.backdrop_path : null,
  age: r.adult ? '18+' : 'PG', // TMDB list results carry no certification
});
const withImage = (i) => i.backdrop || i.poster;
const paged = (d, items) => ({ items, page: d.page, totalPages: Math.min(d.total_pages, 50), total: d.total_results });

router.get('/home', async (req, res, next) => {
  try {
    const [t, m, s] = await Promise.all([tmdb('/trending/all/week'), tmdb('/movie/popular'), tmdb('/tv/popular')]);
    const trending = t.results.filter((r) => isType(r.media_type)).map((r) => norm(r)).filter(withImage).slice(0, 10);
    const seen = new Set(trending.map((i) => i.mediaType + i.id));
    const movies = m.results.map((r) => norm(r, 'movie')).filter(withImage);
    const shows = s.results.map((r) => norm(r, 'tv')).filter(withImage);
    const recommended = [];
    for (let i = 0; i < Math.max(movies.length, shows.length); i++)
      for (const x of [movies[i], shows[i]]) if (x && !seen.has(x.mediaType + x.id)) recommended.push(x);
    res.json({ trending, recommended: recommended.slice(0, 16) });
  } catch (e) { next(e); }
});

router.get('/list/:type', async (req, res, next) => {
  try {
    const { type } = req.params;
    if (!isType(type)) return res.status(400).json({ message: 'Unknown type' });
    const d = await tmdb(`/${type}/popular`, { page: pageOf(req) });
    res.json(paged(d, d.results.map((r) => norm(r, type)).filter(withImage)));
  } catch (e) { next(e); }
});

router.get('/search/:type', async (req, res, next) => {
  try {
    const { type } = req.params; // movie | tv | multi
    const q = String(req.query.q || '').trim();
    if (!(isType(type) || type === 'multi') || !q) return res.status(400).json({ message: 'Enter something to search for' });
    const d = await tmdb(`/search/${type}`, { query: q, page: pageOf(req), include_adult: false });
    const items = d.results
      .filter((r) => type !== 'multi' || isType(r.media_type))
      .map((r) => norm(r, isType(type) ? type : undefined))
      .filter(withImage);
    res.json(paged(d, items));
  } catch (e) { next(e); }
});

router.get('/details/:type/:id', async (req, res, next) => {
  try {
    const { type, id } = req.params;
    if (!isType(type) || !/^\d+$/.test(id)) return res.status(400).json({ message: 'Invalid title' });
    const d = await tmdb(`/${type}/${id}`, { append_to_response: 'credits,external_ids' });
    const minutes = type === 'movie' ? d.runtime : d.episode_run_time?.[0];
    res.json({
      id: d.id,
      mediaType: type,
      title: d.title || d.name,
      tagline: d.tagline || '',
      score: +(d.vote_average || 0).toFixed(1),
      length: minutes ? `${minutes} min.` : 'N/A',
      language: d.spoken_languages?.[0]?.english_name || d.original_language,
      year: (d.release_date || d.first_air_date || '').slice(0, 4),
      firstAir: d.first_air_date || null,
      lastAir: d.last_air_date || null,
      status: d.status || 'N/A',
      genres: (d.genres || []).map((g) => g.name),
      overview: d.overview,
      cast: (d.credits?.cast || []).slice(0, 12).map((c) => c.name),
      poster: d.poster_path ? IMG + 'w500' + d.poster_path : null,
      backdrop: d.backdrop_path ? IMG + 'w780' + d.backdrop_path : null,
      age: d.adult ? '18+' : 'PG',
      website: d.homepage || null,
      imdbId: d.imdb_id || d.external_ids?.imdb_id || null,
    });
  } catch (e) { next(e); }
});

export default router;
