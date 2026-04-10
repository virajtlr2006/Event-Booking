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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center gap-5 text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-3xl font-extrabold text-white shadow-lg shadow-orange-900/40">
              {profile?.name?.[0]?.toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-slate-900"></div>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-white">{profile?.name}</h2>
            <p className="text-slate-400 text-sm mt-0.5">{profile?.email}</p>
            <p className="text-slate-700 text-xs font-mono mt-2 bg-slate-800 px-3 py-1 rounded-lg">{profile?._id}</p>
          </div>

          <div className="flex flex-col gap-2.5 w-full mt-1">
            <button onClick={() => navigate('/events')} className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-orange-900/30">
              Browse Events
            </button>
            <button onClick={() => navigate('/my-bookings')} className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold py-3 rounded-xl text-sm transition-colors">
              My Bookings 🎫
            </button>
            <button onClick={handleLogout} className="w-full bg-transparent border border-red-900/60 hover:bg-red-950/40 hover:border-red-700 text-red-400 font-semibold py-3 rounded-xl text-sm transition-all">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}