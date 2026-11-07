import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout';
import { Login, Signup } from './pages/AuthPages';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Bookmarks from './pages/Bookmarks';
import Detail from './pages/Detail';

const Private = ({ children }) => (useSelector((s) => s.auth.token) ? children : <Navigate to="/login" replace />);
const Public = ({ children }) => (useSelector((s) => s.auth.token) ? <Navigate to="/" replace /> : children);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Public><Login /></Public>} />
      <Route path="/signup" element={<Public><Signup /></Public>} />
      <Route element={<Private><Layout /></Private>}>
        <Route index element={<Home />} />
        <Route path="movies" element={<Browse type="movie" />} />
        <Route path="movies/:id" element={<Detail type="movie" />} />
        <Route path="tv" element={<Browse type="tv" />} />
        <Route path="tv/:id" element={<Detail type="tv" />} />
        <Route path="bookmarks" element={<Bookmarks />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
