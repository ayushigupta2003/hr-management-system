import clsx from 'clsx';

/** Base shimmer block */
function Shimmer({ className }) {
  return (
    <div
      className={clsx(
        'animate-pulse rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:400%_100%]',
        className,
      )}
      style={{ animation: 'shimmer 1.6s ease-in-out infinite' }}
    />
  );
}

/** Table / list skeleton — mimics DataTable rows */
export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
      {/* Header */}
      <div className="flex items-center gap-6 border-b border-slate-100 bg-slate-50 px-5 py-3">
        {[40, 120, 80, 60, 50].map((w, i) => (
          <Shimmer key={i} className={`h-3 rounded`} style={{ width: w }} />
        ))}
      </div>
      {/* Rows */}
      <div className="divide-y divide-slate-50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            {/* Avatar */}
            <Shimmer className="h-8 w-8 shrink-0 rounded-full" />
            {/* Name + email */}
            <div className="flex flex-1 flex-col gap-1.5">
              <Shimmer className="h-3.5 w-32" />
              <Shimmer className="h-2.5 w-24" />
            </div>
            {/* Code */}
            <Shimmer className="h-3 w-16" />
            {/* Department */}
            <Shimmer className="h-3 w-24" />
            {/* Badge */}
            <Shimmer className="h-5 w-14 rounded-full" />
            {/* Actions */}
            <div className="ml-auto flex gap-1.5">
              <Shimmer className="h-7 w-7 rounded-lg" />
              <Shimmer className="h-7 w-7 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Stat card skeleton — mimics dashboard cards */
export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-white p-5 shadow-card">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <Shimmer className="h-3 w-24" />
              <Shimmer className="h-8 w-16" />
              <Shimmer className="h-2.5 w-32" />
            </div>
            <Shimmer className="h-12 w-12 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Form skeleton — mimics modal form fields */
export function FormSkeleton({ fields = 4 }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="grid gap-1.5">
          <Shimmer className="h-3 w-20" />
          <Shimmer className="h-10 w-full rounded-lg" />
        </div>
      ))}
      <Shimmer className="mt-1 h-10 w-full rounded-lg" />
    </div>
  );
}

/** Simple inline spinner */
export function Spinner({ size = 'md', className }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' };
  return (
    <svg
      className={clsx('animate-spin text-brand-500', sizes[size] ?? sizes.md, className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

/** Full-page centered loader */
export function PageLoader({ message = 'Loading…' }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}

/** Backward-compatible default export — same as TableSkeleton */
export function LoadingSkeleton({ rows = 5 }) {
  return <TableSkeleton rows={rows} />;
}
