import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!user) return navigate('/login');
    api.get(`/booking/user/${user.userID}`)
      .then(res => setBookings(res.data))
      .catch(() => alert('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    try {
      setIsCancelling(true);
      await api.delete(`/booking/${cancelTarget._id}`);
      setBookings(prev => prev.filter(b => b._id !== cancelTarget._id));
      setCancelTarget(null);
    } catch {
      alert('Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 rounded-full border-2 border-brand-400 border-t-transparent animate-spin"></div>
        <span className="text-sm text-slate-400">Loading your bookings...</span>
      </div>
    </div>
  );

  return (
    <div className="page-shell">
      <div className="mx-auto w-full max-w-3xl">
        <div className="glass-card mb-8 flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="badge-soft mb-2">Your Reservations</span>
            <h1 className="text-3xl font-bold text-white">My Bookings</h1>
          </div>
          <button onClick={() => navigate('/events')} className="btn-secondary">
            ← Back to Events
          </button>
        </div>

        {bookings.length === 0 && (
          <div className="glass-card mt-20 px-6 py-14 text-center">
            <p className="mb-4 text-5xl">🎫</p>
            <p className="text-slate-300">No bookings yet. Go grab some tickets!</p>
            <button onClick={() => navigate('/events')} className="mt-4 text-sm font-semibold text-brand-200 transition-colors hover:text-brand-100">Browse Events →</button>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {bookings.map(b => (
            <div key={b._id} className="surface-card flex items-center justify-between gap-4 px-5 py-4 transition-all hover:border-brand-300/45">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-300/35 bg-brand-500/15 text-lg">🎟️</div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-slate-100">
                    Event <code className="font-mono text-xs text-brand-200">{b.eventID}</code>
                  </span>
                  <span className="text-xs text-slate-400">{b.seats} seat{b.seats > 1 ? 's' : ''} booked</span>
                </div>
              </div>
              <button
                onClick={() => setCancelTarget(b)}
                className="rounded-xl border border-red-500/35 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-300 transition-all hover:bg-red-500/20"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      </div>

      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="cancel-modal glass-card w-full max-w-md p-6">
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/35 bg-red-500/15 text-xl">
              ⚠️
            </div>
            <h2 className="text-xl font-semibold text-white">Cancel Booking?</h2>
            <p className="mt-2 text-sm text-slate-300">
              This will remove your ticket for event
              {' '}
              <span className="font-mono text-brand-200">{cancelTarget.eventID}</span>
              .
            </p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setCancelTarget(null)}
                className="btn-secondary"
                disabled={isCancelling}
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="rounded-xl border border-red-500/35 bg-red-500/15 px-4 py-2.5 text-sm font-semibold text-red-200 transition-all hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}