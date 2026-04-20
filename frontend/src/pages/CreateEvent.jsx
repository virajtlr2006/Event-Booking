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

  const inputClass = "input-modern";

  return (
    <div className="page-shell">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 text-center">
          <span className="badge-soft mb-3">Host Experience</span>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Create a New Event</h2>
          <p className="mt-2 text-sm text-slate-300">Publish your event and start collecting bookings in minutes.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card flex flex-col gap-5 p-6 sm:p-8">

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Title</label>
            <input {...register('title', { required: 'Title is required' })} placeholder="Give your event a name" className={inputClass} />
            {errors.title && <span className="text-red-400 text-xs">{errors.title.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Description</label>
            <input {...register('description')} placeholder="What's this event about?" className={inputClass} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Date</label>
              <input type="date" {...register('date', { required: 'Date is required' })} className={inputClass} />
              {errors.date && <span className="text-red-400 text-xs">{errors.date.message}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Capacity</label>
              <input type="number" {...register('capacity', { required: 'Required', min: 1 })} placeholder="100" className={inputClass} />
              {errors.capacity && <span className="text-red-400 text-xs">{errors.capacity.message}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Location</label>
            <input {...register('location', { required: 'Location is required' })} placeholder="City, Venue" className={inputClass} />
            {errors.location && <span className="text-red-400 text-xs">{errors.location.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Event'}
          </button>
        </form>
      </div>
    </div>
  );
}