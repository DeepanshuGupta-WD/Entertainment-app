import Grid from './Grid';

// Heading + grid + pager for any paged query (browse or search results).
export default function Results({ title, query, page, onPage, empty }) {
  const { data, isFetching, isError } = query;
  return (
    <section>
      <h2 className="mb-6 text-2xl font-light sm:text-3xl">{title}</h2>
      {isError ? (
        <p className="text-accent">Could not load titles. Check your connection and try again.</p>
      ) : (
        <div className={isFetching && data ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          <Grid key={`${title}-${page}`} items={data?.items} loading={isFetching && !data} empty={empty} />
        </div>
      )}
      {data && data.totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-6 text-sm">
          <button disabled={page <= 1} onClick={() => onPage(page - 1)}
            className="rounded-lg bg-navy px-5 py-2 transition-colors enabled:hover:bg-white enabled:hover:text-ink disabled:opacity-40">
            Previous
          </button>
          <span className="text-slate">Page {page} of {data.totalPages}</span>
          <button disabled={page >= data.totalPages} onClick={() => onPage(page + 1)}
            className="rounded-lg bg-navy px-5 py-2 transition-colors enabled:hover:bg-white enabled:hover:text-ink disabled:opacity-40">
            Next
          </button>
        </div>
      )}
    </section>
  );
}
