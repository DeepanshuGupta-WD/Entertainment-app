import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Logo, HomeIcon, MovieIcon, TvIcon, BookmarkIcon } from './icons';
import { logout } from '../store/authSlice';
import { api } from '../store/api';

const links = [
  { to: '/', label: 'Home', icon: <HomeIcon />, end: true },
  { to: '/movies', label: 'Movies', icon: <MovieIcon /> },
  { to: '/tv', label: 'TV series', icon: <TvIcon /> },
  { to: '/bookmarks', label: 'Bookmarks', icon: <BookmarkIcon size={20} /> },
];

export default function Layout() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const signOut = () => {
    dispatch(logout());
    dispatch(api.util.resetApiState()); // clear cached bookmarks of the previous user
    navigate('/login');
  };

  return (
    <div className="min-h-screen p-4 lg:flex lg:gap-8 lg:p-6">
      <aside className="flex items-center justify-between rounded-2xl bg-navy px-5 py-4 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-24 lg:flex-col lg:px-0 lg:py-8">
        <Logo />
        <nav aria-label="Main" className="flex gap-7 lg:flex-col lg:gap-10">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} aria-label={l.label} title={l.label}
              className={({ isActive }) => `transition-colors hover:text-accent ${isActive ? 'text-white' : 'text-slate'}`}>
              {l.icon}
            </NavLink>
          ))}
        </nav>
        <button onClick={signOut} aria-label="Log out" title="Log out"
          className="grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-white bg-slate text-sm uppercase lg:h-10 lg:w-10">
          {user?.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : user?.email?.[0]}
        </button>
      </aside>

      <main className="mt-6 min-w-0 flex-1 lg:mt-0">
        <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
