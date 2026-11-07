import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import Grid from '../components/Grid';
import { useBookmarksQuery } from '../store/api';

export default function Bookmarks() {
  const [q, setQ] = useState('');
  const { data = [], isLoading } = useBookmarksQuery();
  const shown = data.filter((b) => b.title?.toLowerCase().includes(q.trim().toLowerCase()));
  const movies = shown.filter((b) => b.mediaType === 'movie');
  const shows = shown.filter((b) => b.mediaType === 'tv');
  const none = (kind) => (q ? `No bookmarked ${kind} match '${q}'.` : `No bookmarked ${kind} yet. Tap the bookmark on any title to save it.`);

  return (
    <>
      <SearchBar value={q} onChange={setQ} placeholder="Search for bookmarked shows" />
      <h2 className="mb-6 text-2xl font-light sm:text-3xl">Bookmarked Movies</h2>
      <Grid items={movies} loading={isLoading} empty={none('movies')} />
      <h2 className="mb-6 mt-12 text-2xl font-light sm:text-3xl">Bookmarked TV Series</h2>
      <Grid items={shows} loading={isLoading} empty={none('TV series')} />
    </>
  );
}
