import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import Results from '../components/Results';
import useDebounce from '../hooks/useDebounce';
import { useListQuery, useSearchQuery } from '../store/api';

// Shared by the Movies and TV Series pages: type is 'movie' or 'tv'.
export default function Browse({ type }) {
  const isMovie = type === 'movie';
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const dq = useDebounce(q.trim());
  useEffect(() => setPage(1), [dq]);

  const list = useListQuery({ type, page }, { skip: !!dq });
  const search = useSearchQuery({ type, q: dq, page }, { skip: !dq });

  return (
    <>
      <SearchBar value={q} onChange={setQ} placeholder={isMovie ? 'Search for movies' : 'Search for TV series'} />
      <Results
        title={dq ? `Found ${search.data?.total ?? '…'} results for '${dq}'` : isMovie ? 'Movies' : 'TV Series'}
        query={dq ? search : list} page={page} onPage={setPage} empty="No matches. Try a different title."
      />
    </>
  );
}
