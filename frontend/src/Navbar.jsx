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

  const isActive = (path) => {
    if (path === '/events') {
      return location.pathname === '/events' || location.pathname.startsWith('/events/');
    }
    return location.pathname === path;
  };

  const navLink = (path, label) => (
    <button
      onClick={() => navigate(path)}
      className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
        isActive(path)
          ? 'bg-brand-500/20 text-brand-100'
          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  // Hide navbar on auth pages
  const hideOn = ['/login', '/signup'];
  if (hideOn.includes(location.pathname)) return null;

  return (
    <nav className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <div className="content-wrap glass-card">
        <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
          <button
            onClick={() => navigate('/events')}
            className="flex shrink-0 items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-base shadow-lg shadow-black/40">
              ✦
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">Event Platform</p>
              <p className="text-lg font-bold text-white">Evently</p>
            </div>
          </button>

          {user && (
            <div className="hidden items-center gap-1 md:flex">
              {navLink('/events', 'Events')}
              {navLink('/create-event', 'Create Event')}
              {navLink('/my-events', 'My Events')}
              {navLink('/my-bookings', 'My Bookings')}
            </div>
          )}

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/profile')}
                  className={`flex items-center gap-2 rounded-xl border px-2.5 py-1.5 transition-all ${
                    isActive('/profile')
                      ? 'border-brand-300/50 bg-brand-500/15'
                      : 'border-transparent hover:border-slate-600 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-white">
                    {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden text-sm font-semibold text-slate-200 sm:block">
                    {user?.name?.split(' ')[0] ?? 'Profile'}
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="rounded-xl border border-slate-700 px-3 py-1.5 text-sm font-semibold text-slate-300 transition-all hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="btn-secondary py-2"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="btn-primary py-2"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {user && (
          <div className="flex items-center justify-around border-t border-white/10 px-2 py-2 md:hidden">
            {[
              { path: '/events', icon: '🗓️', label: 'Events' },
              { path: '/create-event', icon: '➕', label: 'Create' },
              { path: '/my-events', icon: '📋', label: 'Mine' },
              { path: '/my-bookings', icon: '🎫', label: 'Bookings' },
              { path: '/profile', icon: '👤', label: 'Profile' },
            ].map(({ path, icon, label }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex min-w-16 flex-col items-center gap-1 rounded-lg px-3 py-1.5 transition-all ${
                  isActive(path)
                    ? 'bg-brand-500/20 text-brand-200'
                    : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                }`}
              >
                <span className="text-sm">{icon}</span>
                <span className="text-[11px] font-medium">{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}