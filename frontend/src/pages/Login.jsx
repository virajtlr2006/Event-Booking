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

  const inputClass = "input-modern";

  return (
    <div className="page-shell flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-2xl shadow-lg shadow-black/40">✦</div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-1 text-sm text-slate-300">Sign in to manage your events and bookings.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card flex flex-col gap-5 p-7">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Email</label>
            <input type="email" {...register('email', { required: 'Email is required' })} placeholder="john@example.com" className={inputClass} />
            {errors.email && <span className="text-red-400 text-xs">{errors.email.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Password</label>
            <input type="password" {...register('password', { required: 'Password is required' })} placeholder="••••••••" className={inputClass} />
            {errors.password && <span className="text-red-400 text-xs">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary mt-1 w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-slate-300">
            No account? <Link to="/signup" className="font-semibold text-brand-200 transition-colors hover:text-brand-100">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}