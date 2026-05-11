import { useEffect, useState } from 'react';
import { Star, Plus, Pencil, Trash2, TrendingUp } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Avatar } from '../../../components/common/Avatar';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { DataTable } from '../../../components/common/DataTable';
import { InputField } from '../../../components/forms/InputField';
import { SelectField } from '../../../components/forms/SelectField';
import { Modal } from '../../../components/common/Modal';
import { PageHeader } from '../../../components/common/PageHeader';
import { TableSkeleton } from '../../../components/feedback/LoadingSkeleton';
import { fetchEmployees } from '../../employees/store/employeesSlice';
import { performanceApi } from '../services/performanceApi';

const REVIEW_STATUSES = ['draft', 'submitted', 'acknowledged'];

const STATUS_COLORS = {
  draft:        'bg-slate-100 text-slate-600',
  submitted:    'bg-brand-50 text-brand-700',
  acknowledged: 'bg-emerald-50 text-emerald-700',
};

function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map((n) => (
        <button key={n} type="button" onClick={() => onChange?.(n)}
          className={`transition-colors ${onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}>
          <Star className={`h-5 w-5 ${n <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
        </button>
      ))}
    </div>
  );
}

function IconBtn({ onClick, title, className = '', children }) {
  return (
    <button type="button" onClick={onClick} title={title}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus:outline-none ${className}`}>
      {children}
    </button>
  );
}

const EMPTY_FORM = {
  employee_id:'', period:'', rating:3, strengths:'', improvements:'',
  goals:'', comments:'', status:'draft', review_date: new Date().toISOString().slice(0,10),
};

export function PerformancePage() {
  const dispatch  = useDispatch();
  const employees = useSelector((s) => s.employees.items);

  const [reviews,  setReviews]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [modal,    setModal]    = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [saving,   setSaving]   = useState(false);
  const [confirm,  setConfirm]  = useState(null);
  const [empFilter,setEmpFilter]= useState('');

  useEffect(() => { dispatch(fetchEmployees({ per_page: 100 })); }, [dispatch]);
  useEffect(() => { loadReviews(); }, [empFilter]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await performanceApi.list({ employee_id: empFilter, per_page: 50 });
      setReviews(res.data ?? []);
    } catch { toast.error('Failed to load reviews.'); }
    finally { setLoading(false); }
  };

  const openModal = (review = null) => {
    setEditing(review);
    setForm(review ? {
      employee_id:  review.employee_id,
      period:       review.period,
      rating:       review.rating,
      strengths:    review.strengths    ?? '',
      improvements: review.improvements ?? '',
      goals:        review.goals        ?? '',
      comments:     review.comments     ?? '',
      status:       review.status,
      review_date:  review.review_date,
    } : EMPTY_FORM);
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) { await performanceApi.update(editing.id, form); toast.success('Review updated.'); }
      else         { await performanceApi.create(form);             toast.success('Review created.'); }
      setModal(false);
      loadReviews();
    } catch (err) { toast.error(err.message ?? 'Failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await performanceApi.remove(id); toast.success('Review deleted.'); loadReviews(); }
    catch { toast.error('Failed.'); }
    setConfirm(null);
  };

  const f = (field) => (e) => setForm((c) => ({ ...c, [field]: e.target.value }));

  const columns = [
    {
      key: 'employee', label: 'Employee',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.employee?.full_name ?? '?'} size="sm" />
          <div>
            <p className="font-medium text-ink">{row.employee?.full_name}</p>
            <p className="text-xs text-slate-400">{row.employee?.designation}</p>
          </div>
        </div>
      ),
    },
    { key: 'period', label: 'Period' },
    {
      key: 'rating', label: 'Rating',
      render: (row) => <StarRating value={row.rating} />,
    },
    {
      key: 'status', label: 'Status',
      render: (row) => (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLORS[row.status] ?? 'bg-slate-100 text-slate-600'}`}>
          {row.status}
        </span>
      ),
    },
    { key: 'review_date', label: 'Date' },
    {
      key: 'reviewer', label: 'Reviewer',
      render: (row) => <span className="text-xs text-slate-500">{row.reviewer?.name ?? '—'}</span>,
    },
    {
      key: 'actions', label: '',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <IconBtn onClick={() => openModal(row)} title="Edit" className="hover:bg-slate-100">
            <Pencil className="h-4 w-4 text-slate-500" />
          </IconBtn>
          <IconBtn onClick={() => setConfirm(row.id)} title="Delete" className="hover:bg-red-50">
            <Trash2 className="h-4 w-4 text-red-500" />
          </IconBtn>
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-6 animate-fade-in">
      <PageHeader
        title="Performance Reviews"
        description="Track employee performance and set goals."
        icon={TrendingUp}
        actions={
          <Button onClick={() => openModal()}>
            <Plus className="h-4 w-4" /> New Review
          </Button>
        }
      />

      {/* Filter */}
      <div className="flex gap-3">
        <select value={empFilter} onChange={(e) => setEmpFilter(e.target.value)}
          className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-ink outline-none hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 shadow-card">
          <option value="">All Employees</option>
          {employees.map((e) => <option key={e.id} value={e.id}>{e.full_name}</option>)}
        </select>
      </div>

      {loading ? <TableSkeleton rows={5} /> : (
        <DataTable columns={columns} rows={reviews} getRowId={(r) => r.id} />
      )}

      {/* Modal */}
      <Modal title={editing ? 'Edit Review' : 'New Performance Review'} isOpen={modal} onClose={() => setModal(false)}>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Employee" value={form.employee_id} onChange={f('employee_id')}>
              <option value="">Select employee</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.full_name}</option>)}
            </SelectField>
            <InputField label="Period" value={form.period} onChange={f('period')} placeholder="e.g. Q1 2026 / Annual 2025" />
          </div>

          <div className="grid gap-1.5">
            <span className="text-sm font-medium text-slate-700">Rating</span>
            <StarRating value={form.rating} onChange={(v) => setForm((c) => ({ ...c, rating: v }))} />
          </div>

          {[
            { field: 'strengths',    label: 'Strengths',         placeholder: 'Key strengths observed…' },
            { field: 'improvements', label: 'Areas to Improve',  placeholder: 'Areas needing improvement…' },
            { field: 'goals',        label: 'Goals for Next Period', placeholder: 'Goals and targets…' },
            { field: 'comments',     label: 'Additional Comments', placeholder: 'Any other feedback…' },
          ].map(({ field, label, placeholder }) => (
            <label key={field} className="grid gap-1.5 text-sm font-medium text-slate-700">
              <span>{label}</span>
              <textarea rows={2} value={form[field]} onChange={f(field)} placeholder={placeholder}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-ink outline-none hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none" />
            </label>
          ))}

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Status" value={form.status} onChange={f('status')}>
              {REVIEW_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
            </SelectField>
            <InputField label="Review Date" type="date" value={form.review_date} onChange={f('review_date')} />
          </div>

          <Button type="submit" isLoading={saving}>{editing ? 'Update Review' : 'Create Review'}</Button>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!confirm} title="Delete Review" message="This performance review will be permanently deleted."
        onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />
    </div>
  );
}
