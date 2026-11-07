import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import Results from '../components/Results';
import Grid from '../components/Grid';
import Card from '../components/Card';
import useDebounce from '../hooks/useDebounce';
import { useHomeQuery, useSearchQuery } from '../store/api';
import { container } from '../motion';

export default function Home() {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const dq = useDebounce(q.trim());
  useEffect(() => setPage(1), [dq]);

  const home = useHomeQuery();
  const search = useSearchQuery({ type: 'multi', q: dq, page }, { skip: !dq });

  return (
    <>
      <SearchBar value={q} onChange={setQ} placeholder="Search for movies or TV series" />
      {dq ? (
        <Results
          title={search.data ? `Found ${search.data.total} results for '${dq}'` : `Searching for '${dq}'…`}
          query={search} page={page} onPage={setPage} empty="No matches. Try a different title."
        />
      ) : (
        <>
          <h2 className="mb-6 text-2xl font-light sm:text-3xl">Trending</h2>
          <motion.div variants={container} initial="hidden" animate="show"
            className="-mx-4 mb-10 flex gap-4 overflow-x-auto px-4 pb-3 sm:gap-10 lg:mx-0 lg:px-0">
            {home.data?.trending.map((i) => <Card key={i.mediaType + i.id} item={i} wide />)}
            {home.isLoading && Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="aspect-video w-72 shrink-0 animate-pulse rounded-lg bg-navy sm:w-[26rem]" />
            ))}
          </motion.div>
          <h2 className="mb-6 text-2xl font-light sm:text-3xl">Recommended for you</h2>
          {home.isError
            ? <p className="text-accent">Could not load titles. Check your connection and try again.</p>
            : <Grid items={home.data?.recommended} loading={home.isLoading} />}
        </>
      )}
    </>
  );
}
