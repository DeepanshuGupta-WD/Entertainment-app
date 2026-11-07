const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinejoin: 'round', strokeLinecap: 'round', 'aria-hidden': true };

export const Logo = (p) => (
  <svg viewBox="0 0 33 27" width="32" height="26" fill="#FC4747" aria-hidden="true" {...p}>
    <path d="M26.463.408 29.4 6.3h-4.2L22.26.408h-3.92L21.28 6.3h-4.2L14.14.408h-3.92L13.16 6.3H8.96L6.02.408H5.4A4.9 4.9 0 0 0 .5 5.308v16.8a4.9 4.9 0 0 0 4.9 4.9h22.4a4.9 4.9 0 0 0 4.9-4.9V.408h-6.237Z" />
  </svg>
);
export const HomeIcon = () => (<svg {...base}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>);
export const MovieIcon = ({ size = 20 }) => (<svg {...base} width={size} height={size}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 3v18M17 3v18M3 12h18M3 7.5h4M3 16.5h4M17 7.5h4M17 16.5h4" /></svg>);
export const TvIcon = ({ size = 20 }) => (<svg {...base} width={size} height={size}><rect x="3" y="7" width="18" height="14" rx="2" /><path d="m8 3 4 4 4-4" /></svg>);
export const BookmarkIcon = ({ filled, size = 14 }) => (<svg {...base} width={size} height={size} fill={filled ? 'currentColor' : 'none'}><path d="M6 3h12v18l-6-4-6 4z" /></svg>);
export const SearchIcon = () => (<svg {...base} width="24" height="24"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>);
export const PlayIcon = () => (<svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="15" fill="#fff" /><path d="M11.5 8.5v13l10-6.5z" fill="#10141E" /></svg>);
