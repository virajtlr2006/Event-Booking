import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/event')
      .then(res => setEvents(res.data))
      .catch(() => alert('Failed to load events'))
      .finally(() => setLoading(false));
  }, []);

  const handleBook = async (eventID) => {
    if (!user) return navigate('/login');
    try {
      await api.post('/booking', { userID: user.userID, eventID, seats: 1 });
      alert('Booking confirmed!');
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div>
        <span className="text-slate-500 text-sm">Loading events...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-1">Discover</p>
            <h1 className="text-4xl font-extrabold text-white">Live Events</h1>
          </div>
          <div className="flex gap-2">
            {user && (
              <>
                <button onClick={() => navigate('/create-event')} className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-orange-900/30">
                  + Create Event
                </button>
                <button onClick={() => navigate('/profile')} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors border border-slate-700">
                  Profile
                </button>
              </>
            )}
            {!user && (
              <button onClick={() => navigate('/login')} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors border border-slate-700">
                Login
              </button>
            )}
          </div>
        </div>

        {events.length === 0 && (
          <div className="text-center mt-28">
            <p className="text-5xl mb-4">🎭</p>
            <p className="text-slate-500">No events yet. Be the first to create one!</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map(event => (
            <div key={event._id} className="group bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-2xl p-5 flex flex-col gap-4 transition-all hover:shadow-xl hover:shadow-orange-900/10">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-white font-bold text-base leading-snug group-hover:text-orange-400 transition-colors">{event.title}</h3>
                <span className="shrink-0 bg-violet-500/10 text-violet-400 text-xs font-semibold px-2.5 py-1 rounded-lg">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              {event.description && (
                <p className="text-slate-500 text-sm leading-relaxed flex-1">{event.description}</p>
              )}
              <div className="flex gap-3 text-xs">
                <span className="bg-slate-800 text-slate-400 px-2.5 py-1 rounded-lg">📍 {event.location}</span>
                <span className="bg-slate-800 text-slate-400 px-2.5 py-1 rounded-lg">👥 {event.capacity}</span>
              </div>
              <button
                onClick={() => handleBook(event._id)}
                className="mt-auto bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 text-white text-sm font-bold py-2.5 rounded-xl transition-all"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}