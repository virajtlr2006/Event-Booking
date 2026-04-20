import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function MyEvents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [participantsByEvent, setParticipantsByEvent] = useState({});
  const [expanded, setExpanded] = useState({});
  const [loadingParticipants, setLoadingParticipants] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    api.get(`/event/user/${user.userID}`)
      .then((res) => setEvents(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load your events'))
      .finally(() => setLoading(false));
  }, [navigate, user]);

  const loadParticipants = async (eventID) => {
    if (participantsByEvent[eventID]) return;
    try {
      setLoadingParticipants((prev) => ({ ...prev, [eventID]: true }));
      const res = await api.get(`/booking/event/${eventID}/participants`, {
        params: { userID: user.userID },
      });
      setParticipantsByEvent((prev) => ({ ...prev, [eventID]: res.data }));
    } catch (err) {
      setParticipantsByEvent((prev) => ({
        ...prev,
        [eventID]: { error: err.response?.data?.message || 'Failed to load participants' },
      }));
    } finally {
      setLoadingParticipants((prev) => ({ ...prev, [eventID]: false }));
    }
  };

  const toggleParticipants = async (eventID) => {
    const nextOpen = !expanded[eventID];
    setExpanded((prev) => ({ ...prev, [eventID]: nextOpen }));
    if (nextOpen) {
      await loadParticipants(eventID);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 rounded-full border-2 border-brand-400 border-t-transparent animate-spin"></div>
          <span className="text-sm text-slate-400">Loading your events...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="content-wrap">
        <div className="glass-card mb-8 flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="badge-soft mb-2">Event Owner Dashboard</span>
            <h1 className="text-3xl font-bold text-white">My Events</h1>
            <p className="mt-2 text-sm text-slate-300">View all events you created and see their participants.</p>
          </div>
          <button onClick={() => navigate('/create-event')} className="btn-primary">
            + Create Event
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {!error && events.length === 0 && (
          <div className="glass-card px-6 py-14 text-center">
            <p className="mb-4 text-5xl">📅</p>
            <p className="text-slate-300">You have not created any events yet.</p>
            <button onClick={() => navigate('/create-event')} className="btn-secondary mt-4">
              Create your first event
            </button>
          </div>
        )}

        <div className="space-y-4">
          {events.map((event) => {
            const participantData = participantsByEvent[event._id];
            const isOpen = expanded[event._id];
            const isLoadingParticipants = loadingParticipants[event._id];
            const participants = Array.isArray(participantData) ? participantData : [];
            const participantError = participantData?.error;

            return (
              <div key={event._id} className="surface-card overflow-hidden">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">{event.title}</h2>
                    <p className="mt-1 text-sm text-slate-300">
                      {new Date(event.date).toLocaleDateString()} · {event.location}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">Capacity: {event.capacity}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate(`/events/${event._id}`)}
                      className="btn-secondary"
                    >
                      Open Event
                    </button>
                    <button
                      onClick={() => toggleParticipants(event._id)}
                      className="btn-primary"
                    >
                      {isOpen ? 'Hide Participants' : 'View Participants'}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-slate-700/70 bg-slate-900/50 p-5">
                    {isLoadingParticipants && (
                      <p className="text-sm text-slate-400">Loading participants...</p>
                    )}

                    {!isLoadingParticipants && participantError && (
                      <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {participantError}
                      </div>
                    )}

                    {!isLoadingParticipants && !participantError && participants.length === 0 && (
                      <p className="text-sm text-slate-400">No participants yet.</p>
                    )}

                    {!isLoadingParticipants && !participantError && participants.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="text-slate-400">
                              <th className="pb-2 font-medium">Name</th>
                              <th className="pb-2 font-medium">Email</th>
                              <th className="pb-2 font-medium">Seats</th>
                            </tr>
                          </thead>
                          <tbody>
                            {participants.map((participant) => (
                              <tr key={participant.bookingID} className="border-t border-slate-700/50 text-slate-200">
                                <td className="py-2">{participant.name}</td>
                                <td className="py-2">{participant.email}</td>
                                <td className="py-2">{participant.seats}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
