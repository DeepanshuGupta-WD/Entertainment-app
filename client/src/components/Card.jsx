import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookmarkIcon, MovieIcon, TvIcon, PlayIcon } from './icons';
import { useBookmarks } from '../hooks/useBookmarks';
import { cardIn } from '../motion';

export default function Card({ item, wide = false }) {
  const { has, toggle } = useBookmarks();
  const saved = has(item);
  const isMovie = item.mediaType === 'movie';
  const to = `/${isMovie ? 'movies' : 'tv'}/${item.id}`;
  const img = item.backdrop || item.poster;
  const Icon = isMovie ? MovieIcon : TvIcon;

  const meta = (
    <p className="flex items-center gap-2 text-xs text-white/75">
      <span>{item.year || '—'}</span>•<Icon size={12} />
      <span>{isMovie ? 'Movie' : 'TV Series'}</span>•<span>{item.age}</span>
    </p>
  );

  return (
    <motion.article variants={cardIn} className={`group relative ${wide ? 'w-72 shrink-0 sm:w-[26rem]' : ''}`}>
      <Link to={to} className="block" aria-label={`${item.title}, ${isMovie ? 'movie' : 'TV series'}`}>
        <div className={`relative overflow-hidden rounded-lg bg-navy ${wide ? 'aspect-video' : 'aspect-[16/10]'}`}>
          {img && (
            <img src={img} alt="" loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          )}
          <div className="absolute inset-0 grid place-items-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
            <span className="flex items-center gap-3 rounded-full bg-white/25 py-2 pl-2 pr-5 text-sm backdrop-blur">
              <PlayIcon /> View
            </span>
          </div>
          {wide && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {meta}
              <h3 className="text-lg font-medium sm:text-2xl">{item.title}</h3>
            </div>
          )}
        </div>
        {!wide && (
          <div className="mt-2">
            {meta}
            <h3 className="truncate text-sm font-medium sm:text-lg">{item.title}</h3>
          </div>
        )}
      </Link>

      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={() => toggle(item)}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${item.title} from bookmarks` : `Bookmark ${item.title}`}
        className={`absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full transition-colors ${
          saved ? 'bg-white text-ink' : 'bg-ink/60 text-white hover:bg-white hover:text-ink'
        }`}
      >
        <BookmarkIcon filled={saved} />
      </motion.button>
    </motion.article>
  );
}
