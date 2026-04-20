import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return navigate('/login');
    api.get(`/user/profile/${user.userID}`)
      .then(res => setProfile(res.data))
      .catch(() => alert('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-9 w-9 rounded-full border-2 border-brand-400 border-t-transparent animate-spin"></div>
    </div>
  );

  return (
    <div className="page-shell flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="glass-card flex flex-col items-center gap-5 p-8 text-center">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-3xl font-extrabold text-white shadow-lg shadow-black/40">
              {profile?.name?.[0]?.toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-slate-900 bg-emerald-400"></div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">{profile?.name}</h2>
            <p className="mt-0.5 text-sm text-slate-300">{profile?.email}</p>
            <p className="mt-2 rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-1 font-mono text-xs text-slate-400">{profile?._id}</p>
          </div>

          <div className="mt-1 flex w-full flex-col gap-2.5">
            <button onClick={() => navigate('/events')} className="btn-primary w-full">
              Browse Events
            </button>
            <button onClick={() => navigate('/my-bookings')} className="btn-secondary w-full">
              My Bookings
            </button>
            <button onClick={handleLogout} className="w-full rounded-xl border border-red-500/35 bg-red-500/10 py-3 text-sm font-semibold text-red-300 transition-all hover:bg-red-500/20">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}