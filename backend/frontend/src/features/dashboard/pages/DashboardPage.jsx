import { useEffect } from 'react';
import {
  Users, Building2, CalendarCheck2,
  TrendingUp, UserCheck, UserX, LayoutDashboard,
  ArrowRight,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CardSkeleton } from '../../../components/feedback/LoadingSkeleton';
import { useAuth } from '../../../hooks/useAuth';
import { useRole } from '../../../hooks/useRole';
import { fetchDashboardStats } from '../store/dashboardSlice';

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, gradient, subIcon: SubIcon }) {
  return (
    <article className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-ink">{value}</p>
          {sub && (
            <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-slate-400">
              {SubIcon && <SubIcon className="h-3.5 w-3.5" />}
              {sub}
            </p>
          )}
        </div>
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${gradient} shadow-sm`}>
          <Icon className="h-5 w-5 text-white" />
        </span>
      </div>
      <div className={`pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-5`} />
    </article>
  );
}

// ─── Weekly Attendance Bar Chart (pure CSS) ───────────────────────────────────
function WeeklyChart({ trend = [] }) {
  if (!trend.length) return null;

  const max = Math.max(...trend.map((d) => d.total), 1);

  const statusColors = {
    high:   'bg-emerald-500',
    medium: 'bg-amber-400',
    low:    'bg-red-400',
    zero:   'bg-slate-200',
  };

  const getColor = (pct) => {
    if (pct === 0) return statusColors.zero;
    if (pct >= 75) return statusColors.high;
    if (pct >= 50) return statusColors.medium;
    return statusColors.low;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold text-ink">
        <TrendingUp className="h-4 w-4 text-brand-500" />
        7-Day Attendance Trend
      </h2>
      <div className="flex items-end justify-between gap-2 h-32">
        {trend.map((day) => {
          const heightPct = max > 0 ? (day.total / max) * 100 : 0;
          const color = getColor(day.percentage);
          return (
            <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5 group">
              {/* Tooltip */}
              <div className="relative flex flex-col items-center">
                <div className="absolute bottom-full mb-1.5 hidden group-hover:flex flex-col items-center z-10">
                  <div className="rounded-lg bg-ink px-2.5 py-1.5 text-xs text-white shadow-lg whitespace-nowrap">
                    <p className="font-semibold">{day.day} — {day.date}</p>
                    <p>{day.present}/{day.total} present ({day.percentage}%)</p>
                  </div>
                  <div className="h-1.5 w-1.5 rotate-45 bg-ink -mt-0.5" />
                </div>
                {/* Bar */}
                <div
                  className={`w-full rounded-t-md transition-all duration-300 ${color} min-h-[4px]`}
                  style={{ height: `${Math.max(heightPct, 4)}%`, maxHeight: '100px' }}
                />
              </div>
              {/* Day label */}
              <span className="text-xs font-medium text-slate-400">{day.day}</span>
              {/* Percentage */}
              <span className="text-xs font-semibold text-ink">{day.percentage}%</span>
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-3">
        {[
          { color: 'bg-emerald-500', label: '≥75% Present' },
          { color: 'bg-amber-400',   label: '50–74%' },
          { color: 'bg-red-400',     label: '<50%' },
          { color: 'bg-slate-200',   label: 'No data' },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className={`h-2.5 w-2.5 rounded-sm ${color}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Department breakdown donut (pure CSS) ────────────────────────────────────
function AttendanceDonut({ stats }) {
  const present  = stats?.attendance?.today_present    ?? 0;
  const total    = stats?.attendance?.today_total      ?? 0;
  const absent   = total - present;
  const pct      = total > 0 ? Math.round((present / total) * 100) : 0;

  // SVG donut
  const r = 40;
  const circ = 2 * Math.PI * r;
  const presentArc = (present / Math.max(total, 1)) * circ;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
        <CalendarCheck2 className="h-4 w-4 text-brand-500" />
        Today's Attendance
      </h2>
      <div className="flex items-center gap-6">
        {/* Donut */}
        <div className="relative shrink-0">
          <svg width="100" height="100" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle cx="50" cy="50" r={r} fill="none" stroke="#f1f5f9" strokeWidth="12" />
            {/* Present arc */}
            <circle
              cx="50" cy="50" r={r}
              fill="none"
              stroke={pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'}
              strokeWidth="12"
              strokeDasharray={`${presentArc} ${circ}`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-ink">{pct}%</span>
            <span className="text-xs text-slate-400">present</span>
          </div>
        </div>
        {/* Stats */}
        <div className="grid gap-3 flex-1">
          <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2">
            <span className="text-xs font-medium text-emerald-600">Present</span>
            <span className="text-sm font-bold text-emerald-700">{present}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-red-50 px-3 py-2">
            <span className="text-xs font-medium text-red-500">Absent / Other</span>
            <span className="text-sm font-bold text-red-600">{absent}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
            <span className="text-xs font-medium text-slate-500">Total Marked</span>
            <span className="text-sm font-bold text-ink">{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const STAT_CARDS = (stats) => [
  {
    label:    'Total Employees',
    value:    stats?.employees?.total ?? 0,
    sub:      `${stats?.employees?.active ?? 0} active · ${stats?.employees?.inactive ?? 0} inactive`,
    icon:     Users,
    gradient: 'from-brand-500 to-brand-700',
    subIcon:  UserCheck,
  },
  {
    label:    'Departments',
    value:    stats?.departments?.total ?? 0,
    sub:      `${stats?.departments?.active ?? 0} active`,
    icon:     Building2,
    gradient: 'from-emerald-500 to-emerald-700',
    subIcon:  TrendingUp,
  },
  {
    label:    "Today's Attendance",
    value:    `${stats?.attendance?.today_percentage ?? 0}%`,
    sub:      `${stats?.attendance?.today_present ?? 0} of ${stats?.attendance?.today_total ?? 0} present`,
    icon:     CalendarCheck2,
    gradient: 'from-amber-500 to-orange-600',
    subIcon:  UserCheck,
  },
];

export function DashboardPage() {
  const dispatch = useDispatch();
  const { stats, isLoading } = useSelector((s) => s.dashboard);
  const { user } = useAuth();
  const { isAdminOrHR } = useRole();

  useEffect(() => { dispatch(fetchDashboardStats()); }, [dispatch]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="grid gap-6 animate-fade-in">
      {/* Greeting */}
      <section className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
          <LayoutDashboard className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-bold text-ink">
            {greeting}, {user?.name?.split(' ')[0] ?? 'there'} 👋
          </h1>
          <p className="text-sm text-slate-500">Here's what's happening today.</p>
        </div>
      </section>

      {/* Stat cards */}
      {isLoading ? (
        <CardSkeleton count={3} />
      ) : (
        <section className="grid gap-4 md:grid-cols-3">
          {STAT_CARDS(stats).map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </section>
      )}

      {/* Charts row */}
      {!isLoading && (
        <section className="grid gap-4 lg:grid-cols-2">
          <WeeklyChart trend={stats?.attendance?.weekly_trend ?? []} />
          <AttendanceDonut stats={stats} />
        </section>
      )}

      {/* Quick overview */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
          <TrendingUp className="h-4 w-4 text-brand-500" />
          Quick Overview
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3">
            <UserCheck className="h-5 w-5 text-emerald-600" />
            <div className="flex-1">
              <p className="text-xs font-medium text-emerald-600">Active Employees</p>
              <p className="text-lg font-bold text-emerald-700">{stats?.employees?.active ?? 0}</p>
            </div>
            {isAdminOrHR && (
              <Link to="/employees" className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5">
                View <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-red-50 px-4 py-3">
            <UserX className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <p className="text-xs font-medium text-red-500">Inactive Employees</p>
              <p className="text-lg font-bold text-red-600">{stats?.employees?.inactive ?? 0}</p>
            </div>
            {isAdminOrHR && (
              <Link to="/employees?status=inactive" className="text-xs text-red-500 hover:text-red-600 flex items-center gap-0.5">
                View <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
