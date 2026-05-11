import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LogIn, Mail, Lock } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { InputField } from '../../../components/forms/InputField';
import { useAuth } from '../../../hooks/useAuth';
import { login } from '../store/authSlice';

export function LoginPage() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, errors } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-ink">Welcome back</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Sign in to your account to continue.
        </p>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <InputField
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={form.email}
          error={errors?.email?.[0]}
          onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))}
        />
        <InputField
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={form.password}
          error={errors?.password?.[0]}
          onChange={(e) => setForm((c) => ({ ...c, password: e.target.value }))}
        />
        <Button type="submit" isLoading={isLoading} className="mt-1 w-full gap-2">
          <LogIn className="h-4 w-4" />
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <Link className="font-semibold text-brand-600 hover:text-brand-700" to="/register">
          Create one
        </Link>
      </p>
    </>
  );
}
