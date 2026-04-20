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

  const inputClass = "input-modern";

  return (
    <div className="page-shell flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-brand-500 text-2xl shadow-lg shadow-black/40">◎</div>
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="mt-1 text-sm text-slate-300">Join Evently and start booking in seconds.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card flex flex-col gap-5 p-7">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Name</label>
            <input {...register('name', { required: 'Name is required' })} placeholder="John Doe" className={inputClass} />
            {errors.name && <span className="text-red-400 text-xs">{errors.name.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Email</label>
            <input type="email" {...register('email', { required: 'Email is required' })} placeholder="john@example.com" className={inputClass} />
            {errors.email && <span className="text-red-400 text-xs">{errors.email.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Password</label>
            <input type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} placeholder="••••••••" className={inputClass} />
            {errors.password && <span className="text-red-400 text-xs">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary mt-1 w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-slate-300">
            Already have an account? <Link to="/login" className="font-semibold text-brand-200 transition-colors hover:text-brand-100">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}