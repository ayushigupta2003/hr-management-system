import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import clsx from 'clsx';

/**
 * Pagination component — works with Laravel's LengthAwarePaginator meta.
 *
 * @param {object} meta        { current_page, last_page, per_page, total, from, to }
 * @param {function} onChange  Called with new page number
 * @param {number[]} pageSizes Optional array of per-page options
 * @param {function} onPerPageChange  Called with new per_page value
 */
export function Pagination({ meta, onChange, pageSizes = [10, 25, 50], onPerPageChange }) {
  if (!meta || meta.last_page <= 1) return null;

  const { current_page: page, last_page: total, per_page, from, to, total: count } = meta;

  const pages = buildPages(page, total);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1 pt-3">
      {/* Info */}
      <p className="text-xs text-slate-500 shrink-0">
        Showing <span className="font-semibold text-ink">{from}–{to}</span> of{' '}
        <span className="font-semibold text-ink">{count}</span> results
      </p>

      <div className="flex items-center gap-3">
        {/* Per-page selector */}
        {onPerPageChange && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Rows</span>
            <select
              value={per_page}
              onChange={(e) => onPerPageChange(Number(e.target.value))}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-ink outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            >
              {pageSizes.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}

        {/* Page buttons */}
        <nav className="flex items-center gap-1" aria-label="Pagination">
          {/* First */}
          <PageBtn onClick={() => onChange(1)} disabled={page === 1} aria-label="First page">
            <ChevronsLeft className="h-3.5 w-3.5" />
          </PageBtn>
          {/* Prev */}
          <PageBtn onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Previous page">
            <ChevronLeft className="h-3.5 w-3.5" />
          </PageBtn>

          {/* Page numbers */}
          {pages.map((p, i) =>
            p === '…' ? (
              <span key={`ellipsis-${i}`} className="px-1 text-xs text-slate-400">…</span>
            ) : (
              <PageBtn
                key={p}
                onClick={() => onChange(p)}
                active={p === page}
                aria-label={`Page ${p}`}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </PageBtn>
            )
          )}

          {/* Next */}
          <PageBtn onClick={() => onChange(page + 1)} disabled={page === total} aria-label="Next page">
            <ChevronRight className="h-3.5 w-3.5" />
          </PageBtn>
          {/* Last */}
          <PageBtn onClick={() => onChange(total)} disabled={page === total} aria-label="Last page">
            <ChevronsRight className="h-3.5 w-3.5" />
          </PageBtn>
        </nav>
      </div>
    </div>
  );
}

// ─── Page button ──────────────────────────────────────────────────────────────

function PageBtn({ children, onClick, disabled, active, ...props }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition-all',
        active
          ? 'bg-brand-600 text-white shadow-sm'
          : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-ink',
        disabled && 'cursor-not-allowed opacity-40',
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// ─── Build page number array with ellipsis ────────────────────────────────────

function buildPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [];
  const delta = 1; // pages around current

  const left  = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  pages.push(1);
  if (left > 2)      pages.push('…');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push('…');
  pages.push(total);

  return pages;
}
