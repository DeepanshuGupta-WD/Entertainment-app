import { motion } from 'framer-motion';
import Card from './Card';
import { container } from '../motion';

export default function Grid({ items, loading, empty = 'Nothing to show yet.' }) {
  if (loading)
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="aspect-[16/10] animate-pulse rounded-lg bg-navy" />
        ))}
      </div>
    );
  if (!items?.length) return <p className="text-slate">{empty}</p>;
  return (
    <motion.div variants={container} initial="hidden" animate="show"
      className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => <Card key={item.mediaType + item.id} item={item} />)}
    </motion.div>
  );
}
