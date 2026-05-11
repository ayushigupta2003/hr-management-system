import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Users, UserCheck, UserX } from 'lucide-react';
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
import { fetchDepartments } from '../../departments/store/departmentsSlice';
import { deleteEmployee, fetchEmployees, saveEmployee, toggleEmployeeStatus } from '../store/employeesSlice';

const EMPTY_FORM = {
  department_id: '', employee_code: '', first_name: '', last_name: '',
  email: '', phone: '', designation: '', joining_date: '',
  salary: '', address: '', status: 'active', image: null,
};

const mapEmployeeToForm = (emp) => ({
  department_id: emp.department_id ?? '',
  employee_code: emp.employee_code ?? '',
  first_name:    emp.first_name    ?? '',
  last_name:     emp.last_name     ?? '',
  email:         emp.email         ?? '',
  phone:         emp.phone         ?? '',
  designation:   emp.designation   ?? '',
  joining_date:  emp.joining_date  ?? '',
  salary:        emp.salary        ?? '',
  address:       emp.address       ?? '',
  status:        emp.status        ?? 'active',
  image:         null,
});

function toFormData(values) {
  const fd = new FormData();
  Object.entries(values).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') fd.append(k, v);
  });
  return fd;
}

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
function buildColumns({ dispatch, isAdmin, openModal, setConfirm }) {
  return [
    {
      key: 'employee', label: 'Employee',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.image_path ? (
            <img
              src={`http://localhost:8000/storage/${row.image_path}`}
              alt={row.full_name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-100"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <Avatar name={row.full_name} size="md" />
          )}
          <div>
            <p className="font-medium text-ink">{row.full_name}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'employee_code', label: 'Code',
      render: (row) => (
        <span className="font-mono text-xs text-slate-500">{row.employee_code}</span>
      ),
    },
    {
      key: 'department', label: 'Department',
      render: (row) => row.department?.name ?? <span className="text-slate-300">—</span>,
    },
    { key: 'designation', label: 'Designation' },
    {
      key: 'status', label: 'Status',
      render: (row) => <Badge variant={row.status}>{row.status}</Badge>,
    },
    {
      key: 'actions', label: '',
      render: (row) => (
        <div className="flex justify-end gap-1">
          {/* Toggle active/inactive */}
          <IconBtn
            onClick={() => dispatch(toggleEmployeeStatus(row.id))}
            title={row.status === 'active' ? 'Deactivate' : 'Activate'}
            className="hover:bg-amber-50"
          >
            {row.status === 'active'
              ? <UserX className="h-4 w-4 text-amber-500" />
              : <UserCheck className="h-4 w-4 text-emerald-500" />}
          </IconBtn>

          {/* Edit */}
          <IconBtn
            onClick={() => openModal(row)}
            title="Edit employee"
            className="hover:bg-slate-100"
          >
            <Pencil className="h-4 w-4 text-slate-500" />
          </IconBtn>

          {/* Delete — admin only */}
          {isAdmin && (
            <IconBtn
              onClick={() => setConfirm(row.id)}
              title="Delete employee"
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

export function EmployeesPage() {
  const dispatch = useDispatch();
  const { items, meta, isLoading, isSaving, errors } = useSelector((s) => s.employees);
  const departments = useSelector((s) => s.departments.items);
  const { isAdmin, isAdminOrHR } = useRole();

  const [search,      setSearch]      = useState('');
  const [deptFilter,  setDeptFilter]  = useState('');
  const [statusFilter,setStatusFilter]= useState('');
  const [page,        setPage]        = useState(1);
  const [perPage,     setPerPage]     = useState(10);
  const [confirm,     setConfirm]     = useState(null);

  const { isOpen, editing, form, setField, openModal, closeModal, handleSubmit, f } =
    useCrudModal(EMPTY_FORM, saveEmployee, fetchEmployees, mapEmployeeToForm);

  useEffect(() => { setPage(1); }, [search, deptFilter, statusFilter]);

  useEffect(() => {
    dispatch(fetchEmployees({
      search,
      department_id: deptFilter,
      status:        statusFilter,
      page,
      per_page:      perPage,
    }));
  }, [dispatch, search, deptFilter, statusFilter, page, perPage]);

  useEffect(() => { dispatch(fetchDepartments({ per_page: 100 })); }, [dispatch]);

  // Build columns fresh every render — always has current isAdmin + openModal
  const columns = buildColumns({ dispatch, isAdmin, openModal, setConfirm });

  return (
    <div className="grid gap-6 animate-fade-in">
      <PageHeader
        title="Employees"
        description="Manage employee records, status, and profiles."
        icon={Users}
        actions={isAdminOrHR && (
          <Button onClick={() => openModal()}>
            <Plus className="h-4 w-4" /> Add Employee
          </Button>
        )}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or code…"
          className="flex-1 min-w-48"
        />
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-ink outline-none hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 shadow-card"
        >
          <option value="">All Departments</option>
          {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-ink outline-none hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 shadow-card"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
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
        title={editing ? 'Edit Employee' : 'Add Employee'}
        isOpen={isOpen}
        onClose={closeModal}
      >
        <form
          className="grid gap-4"
          onSubmit={(e) => handleSubmit(e, toFormData(form), {
            search, department_id: deptFilter,
            status: statusFilter, page, per_page: perPage,
          })}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="First name" value={form.first_name} error={errors?.first_name?.[0]} onChange={f('first_name')} placeholder="John" />
            <InputField label="Last name"  value={form.last_name}  error={errors?.last_name?.[0]}  onChange={f('last_name')}  placeholder="Doe" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Employee code" value={form.employee_code} error={errors?.employee_code?.[0]} onChange={f('employee_code')} placeholder="EMP-1001" />
            <SelectField label="Department" value={form.department_id} error={errors?.department_id?.[0]} onChange={f('department_id')}>
              <option value="">Select department</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </SelectField>
          </div>
          <InputField label="Email" type="email" value={form.email} error={errors?.email?.[0]} onChange={f('email')} placeholder="john@company.com" />
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Phone"       value={form.phone}       error={errors?.phone?.[0]}       onChange={f('phone')}       placeholder="+91 98765 43210" />
            <InputField label="Designation" value={form.designation} error={errors?.designation?.[0]} onChange={f('designation')} placeholder="Software Engineer" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Joining date" type="date"   value={form.joining_date} error={errors?.joining_date?.[0]} onChange={f('joining_date')} />
            <InputField label="Salary"       type="number" value={form.salary}       error={errors?.salary?.[0]}       onChange={f('salary')}       placeholder="50000" />
          </div>
          <SelectField label="Status" value={form.status} error={errors?.status?.[0]} onChange={f('status')}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </SelectField>
          <InputField label="Address"       value={form.address}  error={errors?.address?.[0]}  onChange={f('address')}  placeholder="City, State" />
          <InputField label="Profile image" type="file" accept="image/*" error={errors?.image?.[0]}
            onChange={(e) => setField('image', e.target.files?.[0] ?? null)} />
          <Button type="submit" isLoading={isSaving} className="mt-1">
            {editing ? 'Update Employee' : 'Create Employee'}
          </Button>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!confirm}
        title="Delete Employee"
        message="This will permanently delete the employee record. This action cannot be undone."
        onConfirm={() => { dispatch(deleteEmployee(confirm)); setConfirm(null); }}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
