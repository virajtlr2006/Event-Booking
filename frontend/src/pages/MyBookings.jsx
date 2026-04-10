import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return navigate('/login');
    api.get(`/booking/user/${user.userID}`)
      .then(res => setBookings(res.data))
      .catch(() => alert('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.delete(`/booking/${id}`);
      setBookings(prev => prev.filter(b => b._id !== id));
    } catch {
      alert('Failed to cancel booking');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div>
        <span className="text-slate-500 text-sm">Loading your bookings...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-1">Your Tickets</p>
            <h1 className="text-3xl font-extrabold text-white">My Bookings</h1>
          </div>
          <button onClick={() => navigate('/events')} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors border border-slate-700">
            ← Back to Events
          </button>
        </div>

        {bookings.length === 0 && (
          <div className="text-center mt-28">
            <p className="text-5xl mb-4">🎫</p>
            <p className="text-slate-500">No bookings yet. Go grab some tickets!</p>
            <button onClick={() => navigate('/events')} className="mt-4 text-orange-400 text-sm font-semibold hover:text-orange-300 transition-colors">Browse Events →</button>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {bookings.map(b => (
            <div key={b._id} className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 border border-orange-500/20 flex items-center justify-center text-lg">🎟️</div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-300 text-sm font-semibold">
                    Event <code className="text-orange-400 text-xs font-mono">{b.eventID}</code>
                  </span>
                  <span className="text-slate-600 text-xs">{b.seats} seat{b.seats > 1 ? 's' : ''} booked</span>
                </div>
              </div>
              <button
                onClick={() => handleCancel(b._id)}
                className="border border-red-900/60 hover:bg-red-950/50 hover:border-red-700 text-red-400 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}