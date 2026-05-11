import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from '../../../components/common/Avatar';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { DataTable } from '../../../components/common/DataTable';
import { Modal } from '../../../components/common/Modal';
import { PageHeader } from '../../../components/common/PageHeader';
import { Pagination } from '../../../components/common/Pagination';
import { SearchInput } from '../../../components/common/SearchInput';
import { TableSkeleton } from '../../../components/feedback/LoadingSkeleton';
import { InputField } from '../../../components/forms/InputField';
import { SelectField } from '../../../components/forms/SelectField';
import { useCrudModal } from '../../../hooks/useCrudModal';
import { useRole } from '../../../hooks/useRole';
import { deleteDepartment, fetchDepartments, saveDepartment } from '../store/departmentsSlice';

const EMPTY_FORM = { name: '', code: '', description: '', is_active: true };

// ── Reusable icon button ─────────────────────────────────────────────────────
function IconBtn({ onClick, title, className = '', children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400 ${className}`}
    >
      {children}
    </button>
  );
}

// ── Column definitions as a plain function (no useMemo) ──────────────────────
function buildColumns({ isAdmin, openModal, setConfirm, dispatch }) {
  return [
    {
      key: 'name', label: 'Department',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="font-medium text-ink">{row.name}</p>
            {row.description && (
              <p className="max-w-[200px] truncate text-xs text-slate-400">{row.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'code', label: 'Code',
      render: (row) => (
        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-600">
          {row.code}
        </span>
      ),
    },
    {
      key: 'employees_count', label: 'Members',
      render: (row) => (
        <span className="text-sm text-slate-600">
          <span className="font-semibold text-ink">{row.employees_count ?? 0}</span> members
        </span>
      ),
    },
    {
      key: 'is_active', label: 'Status',
      render: (row) => (
        <Badge variant={row.is_active ? 'active' : 'inactive'}>
          {row.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions', label: '',
      render: (row) => (
        <div className="flex justify-end gap-1">
          {/* Edit — admin only */}
          {isAdmin && (
            <IconBtn
              onClick={() => openModal(row)}
              title="Edit department"
              className="hover:bg-slate-100"
            >
              <Pencil className="h-4 w-4 text-slate-500" />
            </IconBtn>
          )}

          {/* Delete — admin only */}
          {isAdmin && (
            <IconBtn
              onClick={() => setConfirm(row.id)}
              title="Delete department"
              className="hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </IconBtn>
          )}
        </div>
      ),
    },
  ];
}

export function DepartmentsPage() {
  const dispatch = useDispatch();
  const { items, meta, isLoading, isSaving, errors } = useSelector((s) => s.departments);
  const { isAdmin } = useRole();

  const [search,  setSearch]  = useState('');
  const [page,    setPage]    = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [confirm, setConfirm] = useState(null);

  const { isOpen, editing, form, setField, openModal, closeModal, handleSubmit, f } =
    useCrudModal(EMPTY_FORM, saveDepartment, fetchDepartments);

  useEffect(() => { setPage(1); }, [search]);

  useEffect(() => {
    dispatch(fetchDepartments({ search, page, per_page: perPage }));
  }, [dispatch, search, page, perPage]);

  // Build columns fresh every render — always has current isAdmin + openModal
  const columns = buildColumns({ isAdmin, openModal, setConfirm, dispatch });

  return (
    <div className="grid gap-6 animate-fade-in">
      <PageHeader
        title="Departments"
        description="Create and manage company departments."
        icon={Building2}
        actions={isAdmin && (
          <Button onClick={() => openModal()}>
            <Plus className="h-4 w-4" /> Add Department
          </Button>
        )}
      />

      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or code…"
      />

      {isLoading ? <TableSkeleton rows={perPage} /> : (
        <div className="grid gap-3">
          <DataTable columns={columns} rows={items} getRowId={(r) => r.id} />
          <Pagination
            meta={meta}
            onChange={(p) => setPage(p)}
            onPerPageChange={(pp) => { setPerPage(pp); setPage(1); }}
          />
        </div>
      )}

      {/* Create / Edit modal */}
      <Modal
        title={editing ? 'Edit Department' : 'Add Department'}
        isOpen={isOpen}
        onClose={closeModal}
      >
        <form
          className="grid gap-4"
          onSubmit={(e) => handleSubmit(e, form, { search, page, per_page: perPage })}
        >
          <InputField
            label="Department name"
            value={form.name}
            error={errors?.name?.[0]}
            onChange={f('name')}
            placeholder="e.g. Engineering"
          />
          <InputField
            label="Code"
            value={form.code}
            error={errors?.code?.[0]}
            onChange={f('code')}
            placeholder="e.g. ENG"
            hint="Short unique identifier"
          />
          <InputField
            label="Description"
            value={form.description ?? ''}
            error={errors?.description?.[0]}
            onChange={f('description')}
            placeholder="Brief description"
          />
          <SelectField
            label="Status"
            value={String(form.is_active)}
            onChange={(e) => setField('is_active', e.target.value === 'true')}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </SelectField>
          <Button type="submit" isLoading={isSaving} className="mt-1">
            {editing ? 'Update Department' : 'Create Department'}
          </Button>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!confirm}
        title="Delete Department"
        message="This will permanently delete the department. This action cannot be undone."
        onConfirm={() => { dispatch(deleteDepartment(confirm)); setConfirm(null); }}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
