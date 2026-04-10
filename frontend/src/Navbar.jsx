import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (path, label) => (
    <button
      onClick={() => navigate(path)}
      className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition-all ${
        isActive(path)
          ? 'bg-orange-500/15 text-orange-400'
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      {label}
    </button>
  );

  // Hide navbar on auth pages
  const hideOn = ['/login', '/signup'];
  if (hideOn.includes(location.pathname)) return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <button
          onClick={() => navigate('/events')}
          className="flex items-center gap-2.5 shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-sm shadow-lg shadow-orange-900/40">
            🎟️
          </div>
          <span className="text-white font-extrabold text-lg tracking-tight">
            Evently
          </span>
        </button>

        {/* Center nav links */}
        {user && (
          <div className="hidden sm:flex items-center gap-1">
            {navLink('/events', 'Events')}
            {navLink('/create-event', '+ Create')}
            {navLink('/my-bookings', 'My Bookings')}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <button
                onClick={() => navigate('/profile')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${
                  isActive('/profile')
                    ? 'bg-orange-500/15 border border-orange-500/20'
                    : 'hover:bg-slate-800 border border-transparent'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-xs font-extrabold text-white">
                  {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase()}
                </div>
                <span className="text-slate-300 text-sm font-semibold hidden sm:block">
                  {user?.name?.split(' ')[0] ?? 'Profile'}
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-slate-500 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-950/30 transition-all border border-transparent hover:border-red-900/40"
              >
                Sign out
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-all"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="text-sm font-bold bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-orange-900/30"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom nav — only when logged in */}
      {user && (
        <div className="sm:hidden flex items-center justify-around border-t border-slate-800/60 px-2 py-2 bg-slate-950/95">
          {[
            { path: '/events', icon: '🗓️', label: 'Events' },
            { path: '/create-event', icon: '➕', label: 'Create' },
            { path: '/my-bookings', icon: '🎫', label: 'Bookings' },
            { path: '/profile', icon: '👤', label: 'Profile' },
          ].map(({ path, icon, label }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all ${
                isActive(path)
                  ? 'text-orange-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="text-base">{icon}</span>
              <span className="text-[10px] font-semibold">{label}</span>
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}