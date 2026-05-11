import { useEffect, useState } from 'react';
import {
  FileText, Plus, Pencil, Trash2, Download,
  FileCheck, AlertTriangle,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Avatar } from '../../../components/common/Avatar';
import { Button } from '../../../components/common/Button';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { DataTable } from '../../../components/common/DataTable';
import { InputField } from '../../../components/forms/InputField';
import { SelectField } from '../../../components/forms/SelectField';
import { Modal } from '../../../components/common/Modal';
import { PageHeader } from '../../../components/common/PageHeader';
import { TableSkeleton } from '../../../components/feedback/LoadingSkeleton';
import { fetchEmployees } from '../../employees/store/employeesSlice';
import { documentsApi } from '../services/documentsApi';

const CATEGORIES = ['id_proof','contract','certificate','offer_letter','other'];

const CAT_COLORS = {
  id_proof:     'bg-sky-50 text-sky-700',
  contract:     'bg-violet-50 text-violet-700',
  certificate:  'bg-emerald-50 text-emerald-700',
  offer_letter: 'bg-brand-50 text-brand-700',
  other:        'bg-slate-100 text-slate-600',
};

function formatBytes(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function IconBtn({ onClick, title, className = '', children }) {
  return (
    <button type="button" onClick={onClick} title={title}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus:outline-none ${className}`}>
      {children}
    </button>
  );
}

const EMPTY_FORM = { employee_id:'', title:'', category:'id_proof', expiry_date:'', notes:'', file: null };

export function DocumentsPage() {
  const dispatch  = useDispatch();
  const employees = useSelector((s) => s.employees.items);

  const [docs,      setDocs]      = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [modal,     setModal]     = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [saving,    setSaving]    = useState(false);
  const [confirm,   setConfirm]   = useState(null);
  const [empFilter, setEmpFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');

  useEffect(() => { dispatch(fetchEmployees({ per_page: 100 })); }, [dispatch]);
  useEffect(() => { loadDocs(); }, [empFilter, catFilter]);

  const loadDocs = async () => {
    setLoading(true);
    try {
      const res = await documentsApi.list({ employee_id: empFilter, category: catFilter, per_page: 50 });
      setDocs(res.data ?? []);
    } catch { toast.error('Failed to load documents.'); }
    finally { setLoading(false); }
  };

  const openModal = (doc = null) => {
    setEditing(doc);
    setForm(doc ? {
      employee_id:  doc.employee_id,
      title:        doc.title,
      category:     doc.category,
      expiry_date:  doc.expiry_date ?? '',
      notes:        doc.notes ?? '',
      file:         null,
    } : EMPTY_FORM);
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await documentsApi.update(editing.id, {
          title: form.title, category: form.category,
          expiry_date: form.expiry_date || null, notes: form.notes,
        });
        toast.success('Document updated.');
      } else {
        const fd = new FormData();
        fd.append('employee_id', form.employee_id);
        fd.append('title',       form.title);
        fd.append('category',    form.category);
        if (form.expiry_date) fd.append('expiry_date', form.expiry_date);
        if (form.notes)       fd.append('notes',       form.notes);
        if (form.file)        fd.append('file',        form.file);
        await documentsApi.upload(fd);
        toast.success('Document uploaded.');
      }
      setModal(false);
      loadDocs();
    } catch (err) { toast.error(err.message ?? 'Failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await documentsApi.remove(id); toast.success('Document deleted.'); loadDocs(); }
    catch { toast.error('Failed.'); }
    setConfirm(null);
  };

  const f = (field) => (e) => setForm((c) => ({ ...c, [field]: e.target.value }));

  // Check if document expires within 30 days
  const isExpiringSoon = (date) => {
    if (!date) return false;
    const diff = (new Date(date) - new Date()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 30;
  };

  const isExpired = (date) => date && new Date(date) < new Date();

  const columns = [
    {
      key: 'employee', label: 'Employee',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.employee?.full_name ?? '?'} size="sm" />
          <span className="font-medium text-ink">{row.employee?.full_name}</span>
        </div>
      ),
    },
    {
      key: 'title', label: 'Document',
      render: (row) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-400 shrink-0" />
          <div>
            <p className="font-medium text-ink">{row.title}</p>
            <p className="text-xs text-slate-400">{row.file_name} · {formatBytes(row.file_size)}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category', label: 'Category',
      render: (row) => (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${CAT_COLORS[row.category] ?? CAT_COLORS.other}`}>
          {row.category?.replace('_',' ')}
        </span>
      ),
    },
    {
      key: 'expiry_date', label: 'Expiry',
      render: (row) => {
        if (!row.expiry_date) return <span className="text-slate-300">—</span>;
        if (isExpired(row.expiry_date)) return (
          <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
            <AlertTriangle className="h-3.5 w-3.5" /> Expired
          </span>
        );
        if (isExpiringSoon(row.expiry_date)) return (
          <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
            <AlertTriangle className="h-3.5 w-3.5" /> {row.expiry_date}
          </span>
        );
        return <span className="text-xs text-slate-600">{row.expiry_date}</span>;
      },
    },
    {
      key: 'actions', label: '',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <IconBtn onClick={() => documentsApi.download(row.id, row.file_name)} title="Download" className="hover:bg-brand-50">
            <Download className="h-4 w-4 text-brand-500" />
          </IconBtn>
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

  const expiringSoon = docs.filter((d) => isExpiringSoon(d.expiry_date) || isExpired(d.expiry_date));

  return (
    <div className="grid gap-6 animate-fade-in">
      <PageHeader
        title="Documents"
        description="Upload and manage employee documents."
        icon={FileCheck}
        actions={
          <Button onClick={() => openModal()}>
            <Plus className="h-4 w-4" /> Upload Document
          </Button>
        }
      />

      {/* Expiry alerts */}
      {expiringSoon.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700">
            <span className="font-semibold">{expiringSoon.length} document{expiringSoon.length > 1 ? 's' : ''}</span> expiring soon or already expired.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={empFilter} onChange={(e) => setEmpFilter(e.target.value)}
          className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-ink outline-none hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 shadow-card">
          <option value="">All Employees</option>
          {employees.map((e) => <option key={e.id} value={e.id}>{e.full_name}</option>)}
        </select>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
          className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-ink outline-none hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 shadow-card">
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('_',' ')}</option>)}
        </select>
      </div>

      {loading ? <TableSkeleton rows={5} /> : (
        <DataTable columns={columns} rows={docs} getRowId={(r) => r.id} />
      )}

      {/* Upload / Edit modal */}
      <Modal title={editing ? 'Edit Document' : 'Upload Document'} isOpen={modal} onClose={() => setModal(false)}>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          {!editing && (
            <SelectField label="Employee" value={form.employee_id} onChange={f('employee_id')}>
              <option value="">Select employee</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.full_name}</option>)}
            </SelectField>
          )}
          <InputField label="Document title" value={form.title} onChange={f('title')} placeholder="e.g. Aadhar Card, Employment Contract" />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Category" value={form.category} onChange={f('category')}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('_',' ')}</option>)}
            </SelectField>
            <InputField label="Expiry date" type="date" value={form.expiry_date} onChange={f('expiry_date')} />
          </div>
          {!editing && (
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              <span>File <span className="text-slate-400 font-normal">(max 10MB)</span></span>
              <input type="file" onChange={(e) => setForm((c) => ({ ...c, file: e.target.files?.[0] ?? null }))}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-ink outline-none file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-brand-700 hover:file:bg-brand-100" />
            </label>
          )}
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            <span>Notes</span>
            <textarea rows={2} value={form.notes} onChange={f('notes')} placeholder="Optional notes…"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-ink outline-none hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none" />
          </label>
          <Button type="submit" isLoading={saving}>{editing ? 'Update Document' : 'Upload Document'}</Button>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!confirm} title="Delete Document" message="The file will be permanently deleted from storage."
        onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />
    </div>
  );
}
