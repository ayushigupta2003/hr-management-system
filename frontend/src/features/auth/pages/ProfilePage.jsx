import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  User, Mail, Phone, Briefcase, Lock,
  Shield, CheckCircle2, Eye, EyeOff,
} from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { InputField } from '../../../components/forms/InputField';
import { PageHeader } from '../../../components/common/PageHeader';
import { updateProfile, changePassword } from '../store/authSlice';

export function ProfilePage() {
  const dispatch = useDispatch();
  const { user, isLoading, errors } = useSelector((s) => s.auth);

  const [profileForm, setProfileForm] = useState({
    name:      user?.name      ?? '',
    email:     user?.email     ?? '',
    phone:     user?.phone     ?? '',
    job_title: user?.job_title ?? '',
  });

  const [pwForm, setPwForm] = useState({
    current_password: '',
    password:         '',
    password_confirmation: '',
  });

  const [showPw, setShowPw] = useState({
    current: false, new: false, confirm: false,
  });

  const pf = (field) => (e) => setProfileForm((c) => ({ ...c, [field]: e.target.value }));
  const pw = (field) => (e) => setPwForm((c) => ({ ...c, [field]: e.target.value }));

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(profileForm));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(changePassword(pwForm));
    if (changePassword.fulfilled.match(result)) {
      setPwForm({ current_password: '', password: '', password_confirmation: '' });
    }
  };

  const roleColors = {
    admin:    'from-brand-500 to-brand-700',
    hr:       'from-violet-500 to-violet-700',
    employee: 'from-sky-500 to-sky-700',
  };

  return (
    <div className="grid gap-6 animate-fade-in max-w-2xl">
      <PageHeader
        title="My Profile"
        description="Manage your account information and security settings."
        icon={User}
      />

      {/* ── Profile card ─────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        {/* Avatar + role */}
        <div className="mb-6 flex items-center gap-4">
          <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${roleColors[user?.role] ?? roleColors.employee} text-xl font-bold text-white shadow-sm`}>
            {user?.name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() ?? 'U'}
          </div>
          <div>
            <p className="text-lg font-bold text-ink">{user?.name}</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant={user?.role}>{user?.role}</Badge>
              <Badge variant={user?.status}>{user?.status}</Badge>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {[
            { icon: Mail,     label: 'Email',     value: user?.email     },
            { icon: Phone,    label: 'Phone',     value: user?.phone     },
            { icon: Briefcase,label: 'Job Title', value: user?.job_title },
            { icon: Shield,   label: 'Role',      value: user?.role      },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <Icon className="h-4 w-4 shrink-0 text-slate-400" />
              <div className="min-w-0">
                <p className="text-xs text-slate-400">{label}</p>
                <p className="truncate text-sm font-medium text-ink">{value || '—'}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Edit form */}
        <form className="grid gap-4" onSubmit={handleProfileSubmit}>
          <h3 className="text-sm font-semibold text-ink border-t border-slate-100 pt-4">
            Edit Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Full name"
              value={profileForm.name}
              error={errors?.name?.[0]}
              onChange={pf('name')}
              placeholder="John Doe"
            />
            <InputField
              label="Email address"
              type="email"
              value={profileForm.email}
              error={errors?.email?.[0]}
              onChange={pf('email')}
              placeholder="you@company.com"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Phone"
              value={profileForm.phone}
              error={errors?.phone?.[0]}
              onChange={pf('phone')}
              placeholder="+91 98765 43210"
            />
            <InputField
              label="Job title"
              value={profileForm.job_title}
              error={errors?.job_title?.[0]}
              onChange={pf('job_title')}
              placeholder="Software Engineer"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" isLoading={isLoading}>
              <CheckCircle2 className="h-4 w-4" /> Save Changes
            </Button>
          </div>
        </form>
      </section>

      {/* ── Change password ───────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
          <Lock className="h-4 w-4 text-brand-500" />
          Change Password
        </h3>
        <form className="grid gap-4" onSubmit={handlePasswordSubmit}>
          {/* Current password */}
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            <span>Current password</span>
            <div className="relative">
              <input
                type={showPw.current ? 'text' : 'password'}
                value={pwForm.current_password}
                onChange={pw('current_password')}
                placeholder="••••••••"
                className={`w-full min-h-10 rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-ink outline-none transition-all hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 ${errors?.current_password ? 'border-red-400' : 'border-slate-200'}`}
              />
              <button type="button" onClick={() => setShowPw((c) => ({ ...c, current: !c.current }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPw.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors?.current_password && <span className="text-xs text-red-600">{errors.current_password[0]}</span>}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* New password */}
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              <span>New password</span>
              <div className="relative">
                <input
                  type={showPw.new ? 'text' : 'password'}
                  value={pwForm.password}
                  onChange={pw('password')}
                  placeholder="Min 8 chars, mixed case + number"
                  className={`w-full min-h-10 rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-ink outline-none transition-all hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 ${errors?.password ? 'border-red-400' : 'border-slate-200'}`}
                />
                <button type="button" onClick={() => setShowPw((c) => ({ ...c, new: !c.new }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors?.password && <span className="text-xs text-red-600">{errors.password[0]}</span>}
            </label>

            {/* Confirm password */}
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              <span>Confirm new password</span>
              <div className="relative">
                <input
                  type={showPw.confirm ? 'text' : 'password'}
                  value={pwForm.password_confirmation}
                  onChange={pw('password_confirmation')}
                  placeholder="••••••••"
                  className="w-full min-h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 pr-10 text-sm text-ink outline-none transition-all hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
                <button type="button" onClick={() => setShowPw((c) => ({ ...c, confirm: !c.confirm }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
          </div>

          <div className="flex justify-end">
            <Button type="submit" isLoading={isLoading} variant="secondary">
              <Lock className="h-4 w-4" /> Change Password
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
