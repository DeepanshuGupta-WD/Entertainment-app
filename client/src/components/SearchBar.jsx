import { SearchIcon } from './icons';

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <label className="mb-6 flex items-center gap-4 border-b border-transparent pb-2 text-slate focus-within:border-slate focus-within:text-white sm:mb-8">
      <SearchIcon />
      <input
        type="search" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} aria-label={placeholder}
        className="w-full bg-transparent text-base font-light text-white outline-none placeholder:text-slate sm:text-2xl"
      />
    </label>
  );
}
