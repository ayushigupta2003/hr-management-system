import { Inbox } from 'lucide-react';

export function EmptyState({ title, description, action, icon: Icon = Inbox }) {
  return (
    <section className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-card">
      <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon className="h-7 w-7" />
      </span>
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      {description && (
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </section>
  );
}
