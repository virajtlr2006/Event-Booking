import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/user/login', data);
      login(res.data);
      navigate('/events');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  const inputClass = "bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all placeholder:text-slate-600 w-full";

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 text-2xl mb-4 shadow-lg shadow-orange-900/40">🎟️</div>
          <h2 className="text-3xl font-extrabold text-white">Welcome back</h2>
          <p className="text-slate-500 text-sm mt-1">Sign in to manage your events</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-900 border border-slate-800 rounded-2xl p-7 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</label>
            <input type="email" {...register('email', { required: 'Email is required' })} placeholder="john@example.com" className={inputClass} />
            {errors.email && <span className="text-red-400 text-xs">{errors.email.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
            <input type="password" {...register('password', { required: 'Password is required' })} placeholder="••••••••" className={inputClass} />
            {errors.password && <span className="text-red-400 text-xs">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-orange-900/30"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-slate-500 text-sm">
            No account? <Link to="/signup" className="text-orange-400 font-semibold hover:text-orange-300 transition-colors">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}