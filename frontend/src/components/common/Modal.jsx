import { X } from 'lucide-react';
import { useEffect } from 'react';

export function Modal({ title, children, isOpen, onClose }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop — click to close */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <section className="relative z-10 w-full max-w-lg animate-slide-up rounded-2xl bg-white shadow-soft overflow-hidden">
        {/* Header with close button */}
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Body */}
        <div className="max-h-[80vh] overflow-y-auto px-6 py-5">
          {children}
        </div>
      </section>
    </div>
  );
}
