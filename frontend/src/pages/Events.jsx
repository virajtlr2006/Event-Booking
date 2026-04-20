import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/event')
      .then(res => setEvents(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load events'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 rounded-full border-2 border-brand-400 border-t-transparent animate-spin"></div>
        <span className="text-sm text-slate-400">Loading events...</span>
      </div>
    </div>
  );

  return (
    <div className="page-shell">
      <div className="content-wrap space-y-8">
        <div className="glass-card flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="badge-soft mb-3">Discover Curated Experiences</span>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Live Events</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
              Explore upcoming events, reserve your spot instantly, and keep all your bookings organized in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {user && (
              <>
                <button onClick={() => navigate('/create-event')} className="btn-primary">
                  + Create Event
                </button>
                <button onClick={() => navigate('/profile')} className="btn-secondary">
                  Profile
                </button>
              </>
            )}
            {!user && (
              <button onClick={() => navigate('/login')} className="btn-secondary">
                Login
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {!error && events.length === 0 && (
          <div className="glass-card mt-10 px-6 py-14 text-center">
            <p className="mb-4 text-5xl">🎭</p>
            <p className="text-slate-300">No events yet. Be the first to create one!</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map(event => (
            <div key={event._id} className="group surface-card flex flex-col gap-4 p-5 transition-all hover:-translate-y-1 hover:border-brand-300/60 hover:bg-slate-900">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold leading-snug text-white transition-colors group-hover:text-brand-200">{event.title}</h3>
                <span className="shrink-0 rounded-lg border border-brand-300/35 bg-brand-500/10 px-2.5 py-1 text-xs font-semibold text-brand-100">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              {event.description && (
                <p className="flex-1 text-sm leading-relaxed text-slate-300">{event.description}</p>
              )}
              <div className="flex gap-3 text-xs">
                <span className="rounded-lg border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-slate-300">📍 {event.location}</span>
                <span className="rounded-lg border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-slate-300">👥 {event.capacity}</span>
              </div>
              <button
                onClick={() => navigate(`/events/${event._id}`)}
                className="btn-primary mt-auto w-full"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}