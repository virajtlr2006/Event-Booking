import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function CreateEvent() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, []);

  const onSubmit = async (data) => {
    try {
      await api.post('/event', { ...data, userID: user.userID });
      navigate('/events');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create event');
    }
  };

  const inputClass = "bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all placeholder:text-slate-600";

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="inline-block bg-orange-500/10 text-orange-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest mb-3">New Event</span>
          <h2 className="text-3xl font-extrabold text-white">Create an Event</h2>
          <p className="text-slate-500 text-sm mt-1">Fill in the details to publish your event</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col gap-5 shadow-xl shadow-black/40">

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</label>
            <input {...register('title', { required: 'Title is required' })} placeholder="Give your event a name" className={inputClass} />
            {errors.title && <span className="text-red-400 text-xs">{errors.title.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
            <input {...register('description')} placeholder="What's this event about?" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</label>
              <input type="date" {...register('date', { required: 'Date is required' })} className={inputClass} />
              {errors.date && <span className="text-red-400 text-xs">{errors.date.message}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Capacity</label>
              <input type="number" {...register('capacity', { required: 'Required', min: 1 })} placeholder="100" className={inputClass} />
              {errors.capacity && <span className="text-red-400 text-xs">{errors.capacity.message}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</label>
            <input {...register('location', { required: 'Location is required' })} placeholder="City, Venue" className={inputClass} />
            {errors.location && <span className="text-red-400 text-xs">{errors.location.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-orange-900/30"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Event 🎉'}
          </button>
        </form>
      </div>
    </div>
  );
}