export function AuthCard({ title, subtitle, children }) {
  return (
    <section className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft">
      <div className="mb-6">
        <p className="text-sm font-semibold text-brand-600">HR Management System</p>
        <h1 className="mt-2 text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}
