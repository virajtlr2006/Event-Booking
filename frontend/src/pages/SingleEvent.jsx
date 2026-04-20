import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function SingleEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingSeats, setBookingSeats] = useState(1);
  const [bookingState, setBookingState] = useState({
    status: 'idle',
    message: '',
  });

  useEffect(() => {
    api.get(`/event/${id}`)
      .then((res) => setEvent(res.data))
      .catch((err) => {
        setBookingState({
          status: 'error',
          message: err.response?.data?.message || 'Failed to load event',
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (bookingState.status !== 'success' && bookingState.status !== 'error') return;

    const timer = setTimeout(() => {
      setBookingState((prev) => ({ ...prev, status: 'idle', message: '' }));
    }, 3500);

    return () => clearTimeout(timer);
  }, [bookingState.status]);

  const handleBookTicket = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setBookingState({ status: 'submitting', message: '' });
      await api.post('/booking', {
        userID: user.userID,
        eventID: event._id,
        seats: Number(bookingSeats) || 1,
      });
      setBookingState({
        status: 'success',
        message: 'Booking confirmed! Your ticket is now reserved.',
      });
    } catch (err) {
      setBookingState({
        status: 'error',
        message: err.response?.data?.message || 'Booking failed. Please try again.',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 rounded-full border-2 border-brand-400 border-t-transparent animate-spin"></div>
          <span className="text-sm text-slate-400">Loading event details...</span>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="page-shell">
        <div className="content-wrap">
          <div className="glass-card px-6 py-14 text-center">
            <h1 className="text-2xl font-bold text-white">Event not found</h1>
            <p className="mt-2 text-slate-300">The event might have been removed or the link is invalid.</p>
            <button onClick={() => navigate('/events')} className="btn-secondary mt-5">
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell relative overflow-hidden">
      {bookingState.status === 'success' && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="celebrate-burst">
            {Array.from({ length: 16 }).map((_, index) => (
              <span
                key={index}
                className="celebrate-dot"
                style={{ '--angle': `${index * 22.5}deg` }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="content-wrap">
        <div className="glass-card overflow-hidden">
          <div className="border-b border-white/10 px-6 py-6 sm:px-8">
            <button onClick={() => navigate('/events')} className="btn-secondary mb-5">
              ← All Events
            </button>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="badge-soft mb-3">Single Event</span>
                <h1 className="text-3xl font-bold text-white sm:text-4xl">{event.title}</h1>
                {event.description && <p className="mt-3 max-w-2xl text-slate-300">{event.description}</p>}
              </div>
              <div className="rounded-2xl border border-brand-300/30 bg-brand-500/10 px-4 py-3 text-sm text-brand-100">
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[1fr_320px]">
            <div className="surface-card p-5">
              <h2 className="text-lg font-semibold text-white">Event Details</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Location</p>
                  <p className="mt-1 text-sm font-medium text-white">{event.location}</p>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Capacity</p>
                  <p className="mt-1 text-sm font-medium text-white">{event.capacity} seats</p>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4 sm:col-span-2">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Event ID</p>
                  <p className="mt-1 break-all font-mono text-xs text-brand-200">{event._id}</p>
                </div>
              </div>
            </div>

            <div className="surface-card p-5">
              <h2 className="text-lg font-semibold text-white">Book Tickets</h2>
              <p className="mt-2 text-sm text-slate-300">Reserve your spot for this event in one click.</p>

              <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Number of Seats
              </label>
              <input
                type="number"
                min="1"
                max={event.capacity || 1000}
                value={bookingSeats}
                onChange={(e) => setBookingSeats(e.target.value)}
                className="input-modern mt-2"
              />

              <button
                onClick={handleBookTicket}
                disabled={bookingState.status === 'submitting'}
                className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                {bookingState.status === 'submitting' ? 'Booking...' : 'Book Tickets'}
              </button>

              {bookingState.message && (
                <div
                  className={`mt-4 rounded-xl border px-3 py-2 text-sm ${
                    bookingState.status === 'success'
                      ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
                      : 'border-red-400/40 bg-red-500/10 text-red-200'
                  }`}
                >
                  {bookingState.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
