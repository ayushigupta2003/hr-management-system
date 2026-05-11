import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { UserPlus } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { InputField } from '../../../components/forms/InputField';
import { useAuth } from '../../../hooks/useAuth';
import { register } from '../store/authSlice';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  job_title: '',
  password: '',
  password_confirmation: '',
};

export function RegisterPage() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, errors } = useAuth();
  const [form, setForm] = useState(initialForm);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const set = (field) => (e) => setForm((c) => ({ ...c, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(form));
  };

  return (
    <>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-ink">Create account</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Register as an employee. Roles are assigned by an admin.
        </p>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <InputField label="Full name" placeholder="John Doe" value={form.name} error={errors?.name?.[0]} onChange={set('name')} />
        <InputField label="Email address" type="email" placeholder="you@company.com" value={form.email} error={errors?.email?.[0]} onChange={set('email')} />
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Phone" placeholder="+91 98765 43210" value={form.phone} error={errors?.phone?.[0]} onChange={set('phone')} />
          <InputField label="Job title" placeholder="Software Engineer" value={form.job_title} error={errors?.job_title?.[0]} onChange={set('job_title')} />
        </div>
        <InputField label="Password" type="password" placeholder="Min 8 chars, mixed case + number" value={form.password} error={errors?.password?.[0]} onChange={set('password')} />
        <InputField label="Confirm password" type="password" placeholder="••••••••" value={form.password_confirmation} onChange={set('password_confirmation')} />
        <Button type="submit" isLoading={isLoading} className="mt-1 w-full gap-2">
          <UserPlus className="h-4 w-4" />
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link className="font-semibold text-brand-600 hover:text-brand-700" to="/login">
          Sign in
        </Link>
      </p>
    </>
  );
}
