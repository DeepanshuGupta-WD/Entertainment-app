# Entertainment App (MERN)

Search movies and TV series, view details, and bookmark favorites.
React + Redux Toolkit (RTK Query) + Tailwind + Framer Motion on the client; Express + MongoDB + JWT on the server; data from TMDB.

## Setup
1. Get a free TMDB API key (v3) at themoviedb.org → Settings → API.
2. Server:
   ```
   cd server && cp .env.example .env   # fill in TMDB_API_KEY, JWT_SECRET, MONGO_URI
   npm install && npm run dev          # http://localhost:5000
   ```
3. Client (second terminal):
   ```
   cd client && npm install && npm run dev   # http://localhost:5173
   ```
   Vite proxies `/api` to the server, so no CORS setup is needed in development.

## API
| Method | Route | Notes |
|---|---|---|
| POST | /api/auth/signup, /api/auth/login | returns `{ token, user }` |
| GET | /api/tmdb/home | trending + recommended |
| GET | /api/tmdb/list/:type?page= | `movie` or `tv` |
| GET | /api/tmdb/search/:type?q=&page= | `movie`, `tv`, or `multi` |
| GET | /api/tmdb/details/:type/:id | synopsis, cast, links |
| GET | /api/bookmarks | current user's bookmarks |
| POST | /api/bookmarks/toggle | add or remove |

All routes except auth require `Authorization: Bearer <token>`.

## Structure
- `server/routes/tmdb.js` proxies TMDB so the API key never reaches the browser.
- `client/src/store/api.js` defines every endpoint (RTK Query); `authSlice.js` holds the session.
- `client/src/pages/` Login, Sign Up, Home, Movies, TV Series, Bookmarks, Detail.

## Known limits
- Age labels show `PG`/`18+` from TMDB's adult flag, since list results carry no certification.
- Profile images are stored as small base64 strings; move to S3/Cloudinary for production.
- For deployment, build the client (`npm run build`), serve it from Express or Netlify/Vercel, and set `CLIENT_URL` and an API base URL.
