import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Signup() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await api.post('/user/signup', data);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  const inputClass = "bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all placeholder:text-slate-600 w-full";

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 text-2xl mb-4 shadow-lg shadow-violet-900/40">🎪</div>
          <h2 className="text-3xl font-extrabold text-white">Join the party</h2>
          <p className="text-slate-500 text-sm mt-1">Create your account to start booking</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-900 border border-slate-800 rounded-2xl p-7 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</label>
            <input {...register('name', { required: 'Name is required' })} placeholder="John Doe" className={inputClass} />
            {errors.name && <span className="text-red-400 text-xs">{errors.name.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</label>
            <input type="email" {...register('email', { required: 'Email is required' })} placeholder="john@example.com" className={inputClass} />
            {errors.email && <span className="text-red-400 text-xs">{errors.email.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
            <input type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} placeholder="••••••••" className={inputClass} />
            {errors.password && <span className="text-red-400 text-xs">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-400 hover:to-pink-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-violet-900/30"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account 🎉'}
          </button>

          <p className="text-center text-slate-500 text-sm">
            Already have an account? <Link to="/login" className="text-orange-400 font-semibold hover:text-orange-300 transition-colors">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}