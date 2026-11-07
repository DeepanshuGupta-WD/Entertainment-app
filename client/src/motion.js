// Shared animation variants: grids fade in with a short stagger, cards rise slightly.
export const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
export const cardIn = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};
