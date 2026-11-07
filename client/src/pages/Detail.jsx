import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDetailsQuery } from '../store/api';
import { useBookmarks } from '../hooks/useBookmarks';
import { BookmarkIcon } from '../components/icons';

const Stat = ({ label, value }) => (
  <div>
    <dt className="text-sm text-slate">{label}</dt>
    <dd className="mt-1 text-base">{value || 'N/A'}</dd>
  </div>
);
const Chip = ({ children }) => <li className="rounded border border-white/80 px-2 py-0.5 text-xs">{children}</li>;

// type is 'movie' or 'tv'
export default function Detail({ type }) {
  const { id } = useParams();
  const { data: d, isLoading, isError } = useDetailsQuery({ type, id });
  const { has, toggle } = useBookmarks();
  const back = type === 'movie' ? '/movies' : '/tv';

  if (isLoading) return <div className="h-96 animate-pulse rounded-2xl bg-navy" />;
  if (isError || !d)
    return <p>Could not load this title. <Link to={back} className="text-accent underline">Go back</Link></p>;

  const card = { id: d.id, mediaType: d.mediaType, title: d.title, year: d.year, poster: d.poster, backdrop: d.backdrop, age: d.age };
  const saved = has(card);
  const stars = Math.round(d.score / 2);

  return (
    <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="flex flex-col gap-8 rounded-2xl bg-navy p-5 sm:p-8 md:flex-row">
      {d.poster && <img src={d.poster} alt={`${d.title} poster`} className="w-full max-w-[16rem] self-center rounded-lg md:w-64 md:self-start" />}

      <div className="min-w-0 flex-1">
        <h1 className="text-3xl font-light sm:text-4xl">{d.title}</h1>
        {d.tagline && <p className="mt-2 text-sm text-slate">{d.tagline}</p>}
        <p className="mt-4 flex items-center gap-3 text-2xl">
          {d.score.toFixed(1)}
          <span className="text-base tracking-wider" aria-label={`${stars} out of 5 stars`}>{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {type === 'movie' ? (
            <>
              <Stat label="Length" value={d.length} /><Stat label="Language" value={d.language} />
              <Stat label="Year" value={d.year} /><Stat label="Status" value={d.status} />
            </>
          ) : (
            <>
              <Stat label="Language" value={d.language} /><Stat label="First air" value={d.firstAir} />
              <Stat label="Last air" value={d.lastAir} /><Stat label="Status" value={d.status} />
            </>
          )}
        </dl>

        {d.genres.length > 0 && (<><h2 className="mb-2 mt-6 text-base">Genres</h2><ul className="flex flex-wrap gap-2">{d.genres.map((g) => <Chip key={g}>{g}</Chip>)}</ul></>)}
        {d.overview && (<><h2 className="mb-2 mt-6 text-base">Synopsis</h2><p className="max-w-prose text-sm font-light leading-relaxed">{d.overview}</p></>)}
        {d.cast.length > 0 && (<><h2 className="mb-2 mt-6 text-base">Cast</h2><ul className="flex flex-wrap gap-2">{d.cast.map((c) => <Chip key={c}>{c}</Chip>)}</ul></>)}

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          {d.website && <a href={d.website} target="_blank" rel="noreferrer" className="rounded bg-slate/60 px-6 py-2.5 transition-colors hover:bg-white hover:text-ink">Website</a>}
          {d.imdbId && <a href={`https://www.imdb.com/title/${d.imdbId}`} target="_blank" rel="noreferrer" className="rounded bg-slate/60 px-6 py-2.5 transition-colors hover:bg-white hover:text-ink">IMDB</a>}
          <button onClick={() => toggle(card)} aria-pressed={saved}
            className="flex items-center gap-2 rounded border border-white/80 px-5 py-2.5 transition-colors hover:bg-white hover:text-ink">
            <BookmarkIcon filled={saved} /> {saved ? 'Bookmarked' : 'Bookmark'}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
