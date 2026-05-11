import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  CalendarDays, BarChart3, Clock, CheckCircle2, XCircle,
  AlertCircle, Umbrella, UserCheck, Plus, Trash2,
  Download, Users, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from '../../../components/common/Avatar';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { DataTable } from '../../../components/common/DataTable';
import { PageHeader } from '../../../components/common/PageHeader';
import { Pagination } from '../../../components/common/Pagination';
import { TableSkeleton } from '../../../components/feedback/LoadingSkeleton';
import { SelectField } from '../../../components/forms/SelectField';
import { fetchEmployees } from '../../employees/store/employeesSlice';
import {
  fetchAttendance, markAttendance,
  bulkMarkAttendance, fetchMonthlyReport,
} from '../store/attendanceSlice';
import { exportAttendanceToExcel, exportMonthlyReportToExcel } from '../../../utils/exportExcel';
import { exportAttendanceToPdf, exportMonthlyReportToPdf } from '../../../utils/exportPdf';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ['present', 'late', 'absent', 'leave'];

const STATUS_ICONS = {
  present: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  late:    <AlertCircle  className="h-4 w-4 text-amber-500"   />,
  absent:  <XCircle      className="h-4 w-4 text-red-500"     />,
  leave:   <Umbrella     className="h-4 w-4 text-purple-500"  />,
};

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const today = () => new Date().toISOString().slice(0, 10);

const EMPTY_ROW = () => ({
  _id:             Date.now() + Math.random(),
  employee_id:     '',
  attendance_date: today(),
  check_in:        '',
  check_out:       '',
  status:          'present',
  remarks:         '',
});

// ─── Reusable styled native inputs ───────────────────────────────────────────

const inputCls = 'w-full min-h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-ink outline-none transition-all hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 cursor-pointer';

function DateInput({ label, value, onChange, error, className = '' }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-700">
      {label && <span>{label}</span>}
      <div className="relative">
        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="date"
          value={value}
          onChange={onChange}
          className={`${inputCls} pl-9 ${error ? 'border-red-400 bg-red-50/30' : ''} ${className}`}
        />
      </div>
      {error && <span className="text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

function TimeInput({ label, value, onChange, error, placeholder = 'HH:MM', className = '' }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-700">
      {label && <span>{label}</span>}
      <div className="relative">
        <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="time"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${inputCls} pl-9 ${error ? 'border-red-400 bg-red-50/30' : ''} ${className}`}
        />
      </div>
      {error && <span className="text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

function MonthYearInput({ label, year, month, onYearChange, onMonthChange }) {
  return (
    <div className="grid gap-1.5 text-sm font-medium text-slate-700">
      {label && <span>{label}</span>}
      <div className="flex gap-2">
        <select
          value={month}
          onChange={onMonthChange}
          className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-ink outline-none hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        >
          {MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>{m}</option>
          ))}
        </select>
        <input
          type="number"
          value={year}
          onChange={onYearChange}
          min="2000"
          max="2100"
          className="w-24 min-h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-ink outline-none hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function AttendancePage() {
  const dispatch  = useDispatch();
  const { items, meta, report, isLoading, isSaving, errors } = useSelector((s) => s.attendance);
  const employees = useSelector((s) => s.employees.items);

  const [viewDate,    setViewDate]    = useState(today());
  const [empFilter,   setEmpFilter]   = useState('');
  const [statFilter,  setStatFilter]  = useState('');
  const [activeTab,   setActiveTab]   = useState('single');
  const [reportYear,  setReportYear]  = useState(new Date().getFullYear());
  const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1);
  const [attPage,     setAttPage]     = useState(1);
  const [attPerPage,  setAttPerPage]  = useState(15);

  const [single, setSingle] = useState({
    employee_id: '', attendance_date: today(),
    check_in: '', check_out: '', status: 'present', remarks: '',
  });

  const [bulkRows, setBulkRows] = useState([EMPTY_ROW()]);

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => { dispatch(fetchEmployees({ per_page: 100 })); }, [dispatch]);
  useEffect(() => {
    dispatch(fetchAttendance({
      date: viewDate,
      employee_id: empFilter,
      status: statFilter,
      page: attPage,
      per_page: attPerPage,
    }));
  }, [dispatch, viewDate, empFilter, statFilter, attPage, attPerPage]);

  // Reset page when filters change
  useEffect(() => { setAttPage(1); }, [viewDate, empFilter, statFilter]);

  // ── Single submit ─────────────────────────────────────────────────────────
  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      employee_id:     single.employee_id,
      attendance_date: single.attendance_date,
      check_in:        single.check_in  || null,
      check_out:       single.check_out || null,
      status:          single.status,
      remarks:         single.remarks   || null,
    };
    const result = await dispatch(markAttendance(payload));
    if (markAttendance.fulfilled.match(result)) {
      dispatch(fetchAttendance({ date: single.attendance_date, page: attPage, per_page: attPerPage }));
    }
  };

  // ── Bulk submit ───────────────────────────────────────────────────────────
  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    const records = bulkRows
      .filter((r) => r.employee_id)
      .map((r) => ({
        employee_id:     r.employee_id,
        attendance_date: r.attendance_date,
        check_in:        r.check_in  || null,
        check_out:       r.check_out || null,
        status:          r.status,
        remarks:         r.remarks   || null,
      }));
    if (!records.length) return;
    const result = await dispatch(bulkMarkAttendance(records));
    if (bulkMarkAttendance.fulfilled.match(result)) {
      setBulkRows([EMPTY_ROW()]);
      dispatch(fetchAttendance({ date: records[0].attendance_date, page: 1, per_page: attPerPage }));
      setAttPage(1);
    }
  };

  // ── Bulk helpers ──────────────────────────────────────────────────────────
  const updateBulkRow = useCallback((id, field, value) => {
    setBulkRows((rows) => rows.map((r) => r._id === id ? { ...r, [field]: value } : r));
  }, []);
  const addBulkRow    = () => setBulkRows((rows) => [...rows, EMPTY_ROW()]);
  const removeBulkRow = (id) => setBulkRows((rows) => rows.length > 1 ? rows.filter((r) => r._id !== id) : rows);

  // ── View date navigation ──────────────────────────────────────────────────
  const shiftDay = (delta) => {
    setViewDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + delta);
      return next.toISOString().slice(0, 10);
    });
  };

  const viewDateLabel = new Date(viewDate + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });

  // ── Table columns ─────────────────────────────────────────────────────────
  const attendanceColumns = useMemo(() => [
    {
      key: 'employee', label: 'Employee',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.employee?.full_name ?? '?'} size="sm" />
          <span className="font-medium text-ink">{row.employee?.full_name ?? '—'}</span>
        </div>
      ),
    },
    {
      key: 'attendance_date', label: 'Date',
      render: (row) => (
        <span className="flex items-center gap-1.5 text-slate-600">
          <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
          {row.attendance_date}
        </span>
      ),
    },
    {
      key: 'check_in', label: 'Check In',
      render: (row) => row.check_in
        ? <span className="flex items-center gap-1.5 text-slate-600"><Clock className="h-3.5 w-3.5 text-slate-400" />{row.check_in}</span>
        : <span className="text-slate-300">—</span>,
    },
    {
      key: 'check_out', label: 'Check Out',
      render: (row) => row.check_out
        ? <span className="flex items-center gap-1.5 text-slate-600"><Clock className="h-3.5 w-3.5 text-slate-400" />{row.check_out}</span>
        : <span className="text-slate-300">—</span>,
    },
    {
      key: 'status', label: 'Status',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {STATUS_ICONS[row.status]}
          <Badge variant={row.status}>{row.status}</Badge>
        </div>
      ),
    },
    {
      key: 'remarks', label: 'Remarks',
      render: (row) => row.remarks
        ? <span className="text-xs text-slate-500">{row.remarks}</span>
        : <span className="text-slate-300">—</span>,
    },
  ], []);

  const reportColumns = useMemo(() => [
    {
      key: 'employee', label: 'Employee',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.employee?.full_name ?? '?'} size="sm" />
          <div>
            <p className="font-medium text-ink">{row.employee.full_name}</p>
            <p className="text-xs text-slate-400">{row.employee.department ?? '—'}</p>
          </div>
        </div>
      ),
    },
    { key: 'present', label: 'Present', render: (row) => <span className="font-semibold text-emerald-600">{row.summary.present ?? 0}</span> },
    { key: 'late',    label: 'Late',    render: (row) => <span className="font-semibold text-amber-600">{row.summary.late ?? 0}</span> },
    { key: 'absent',  label: 'Absent',  render: (row) => <span className="font-semibold text-red-600">{row.summary.absent ?? 0}</span> },
    { key: 'leave',   label: 'Leave',   render: (row) => <span className="font-semibold text-purple-600">{row.summary.leave ?? 0}</span> },
    {
      key: 'total', label: 'Working Days',
      render: (row) => <span className="font-semibold text-ink">{(row.summary.present ?? 0) + (row.summary.late ?? 0)}</span>,
    },
  ], []);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="grid gap-6 animate-fade-in">
      <PageHeader title="Attendance" description="Mark daily attendance and view monthly summaries." icon={CalendarDays} />

      {/* ── Mark Attendance ─────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-card">
        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          {[
            { id: 'single', label: 'Single Employee', icon: UserCheck },
            { id: 'bulk',   label: 'Bulk Mark',       icon: Users     },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                activeTab === id
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-ink'
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* ── Single form ── */}
          {activeTab === 'single' && (
            <form className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" onSubmit={handleSingleSubmit}>
              <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                <span>Employee</span>
                <select
                  className={inputCls}
                  value={single.employee_id}
                  onChange={(e) => setSingle((c) => ({ ...c, employee_id: e.target.value }))}
                >
                  <option value="">Select employee</option>
                  {employees.map((e) => <option key={e.id} value={e.id}>{e.full_name}</option>)}
                </select>
                {errors?.employee_id && <span className="text-xs text-red-600">{errors.employee_id[0]}</span>}
              </label>

              <DateInput
                label="Date"
                value={single.attendance_date}
                onChange={(e) => setSingle((c) => ({ ...c, attendance_date: e.target.value }))}
                error={errors?.attendance_date?.[0]}
              />
              <TimeInput
                label="Check In"
                value={single.check_in}
                onChange={(e) => setSingle((c) => ({ ...c, check_in: e.target.value }))}
                error={errors?.check_in?.[0]}
              />
              <TimeInput
                label="Check Out"
                value={single.check_out}
                onChange={(e) => setSingle((c) => ({ ...c, check_out: e.target.value }))}
                error={errors?.check_out?.[0]}
              />
              <SelectField
                label="Status"
                value={single.status}
                onChange={(e) => setSingle((c) => ({ ...c, status: e.target.value }))}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </SelectField>
              <div className="flex items-end">
                <Button type="submit" isLoading={isSaving} className="w-full">
                  <CheckCircle2 className="h-4 w-4" /> Mark
                </Button>
              </div>
            </form>
          )}

          {/* ── Bulk form ── */}
          {activeTab === 'bulk' && (
            <form onSubmit={handleBulkSubmit}>
              <div className="mb-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {['Employee', 'Date', 'Check In', 'Check Out', 'Status', 'Remarks', ''].map((h) => (
                        <th key={h} className="pb-2 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {bulkRows.map((row) => (
                      <tr key={row._id}>
                        {/* Employee */}
                        <td className="py-2 pr-3 min-w-[170px]">
                          <select
                            className="w-full min-h-9 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                            value={row.employee_id}
                            onChange={(e) => updateBulkRow(row._id, 'employee_id', e.target.value)}
                          >
                            <option value="">Select…</option>
                            {employees.map((e) => <option key={e.id} value={e.id}>{e.full_name}</option>)}
                          </select>
                        </td>
                        {/* Date */}
                        <td className="py-2 pr-3 min-w-[150px]">
                          <input
                            type="date"
                            value={row.attendance_date}
                            onChange={(e) => updateBulkRow(row._id, 'attendance_date', e.target.value)}
                            className="w-full min-h-9 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 cursor-pointer"
                          />
                        </td>
                        {/* Check In */}
                        <td className="py-2 pr-3 min-w-[120px]">
                          <input
                            type="time"
                            value={row.check_in}
                            onChange={(e) => updateBulkRow(row._id, 'check_in', e.target.value)}
                            className="w-full min-h-9 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 cursor-pointer"
                          />
                        </td>
                        {/* Check Out */}
                        <td className="py-2 pr-3 min-w-[120px]">
                          <input
                            type="time"
                            value={row.check_out}
                            onChange={(e) => updateBulkRow(row._id, 'check_out', e.target.value)}
                            className="w-full min-h-9 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 cursor-pointer"
                          />
                        </td>
                        {/* Status */}
                        <td className="py-2 pr-3 min-w-[120px]">
                          <select
                            className="w-full min-h-9 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                            value={row.status}
                            onChange={(e) => updateBulkRow(row._id, 'status', e.target.value)}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                        </td>
                        {/* Remarks */}
                        <td className="py-2 pr-3 min-w-[150px]">
                          <input
                            type="text"
                            placeholder="Optional…"
                            value={row.remarks}
                            onChange={(e) => updateBulkRow(row._id, 'remarks', e.target.value)}
                            className="w-full min-h-9 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                          />
                        </td>
                        {/* Remove */}
                        <td className="py-2">
                          <button
                            type="button"
                            onClick={() => removeBulkRow(row._id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                            aria-label="Remove row"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <Button type="button" variant="ghost" onClick={addBulkRow} className="gap-1.5 text-brand-600">
                  <Plus className="h-4 w-4" /> Add Row
                </Button>
                <Button type="submit" isLoading={isSaving}>
                  <CheckCircle2 className="h-4 w-4" />
                  Mark {bulkRows.filter((r) => r.employee_id).length} Employee(s)
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ── Attendance Records ───────────────────────────────────────────── */}
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            Records for <span className="text-brand-600">{viewDateLabel}</span>
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            {/* Employee filter */}
            <select
              value={empFilter}
              onChange={(e) => setEmpFilter(e.target.value)}
              className="min-h-9 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-ink outline-none hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 shadow-card"
            >
              <option value="">All Employees</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.full_name}</option>)}
            </select>
            {/* Status filter */}
            <select
              value={statFilter}
              onChange={(e) => setStatFilter(e.target.value)}
              className="min-h-9 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-ink outline-none hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 shadow-card"
            >
              <option value="">All Status</option>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            {/* Day navigator */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-1 py-1 shadow-card">
              <button onClick={() => shiftDay(-1)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors" aria-label="Previous day">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <input
                type="date"
                value={viewDate}
                onChange={(e) => setViewDate(e.target.value)}
                className="w-36 border-0 bg-transparent text-center text-sm font-medium text-ink outline-none cursor-pointer"
              />
              <button onClick={() => shiftDay(1)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors" aria-label="Next day">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            {items.length > 0 && (
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => exportAttendanceToExcel(items, `attendance-${viewDate}`)}>
                  <Download className="h-4 w-4" /> Excel
                </Button>
                <Button variant="secondary" onClick={() => exportAttendanceToPdf(items, viewDate)}>
                  <Download className="h-4 w-4" /> PDF
                </Button>
              </div>
            )}
          </div>
        </div>
        {isLoading
          ? <TableSkeleton rows={attPerPage} />
          : (
            <div className="grid gap-3">
              <DataTable columns={attendanceColumns} rows={items} getRowId={(r) => r.id} />
              <Pagination
                meta={meta}
                onChange={(p) => setAttPage(p)}
                onPerPageChange={(pp) => { setAttPerPage(pp); setAttPage(1); }}
                pageSizes={[10, 15, 25, 50]}
              />
            </div>
          )
        }
      </section>

      {/* ── Monthly Report ───────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
            <BarChart3 className="h-4 w-4 text-brand-500" />
            Monthly Report
          </h2>
          {report.length > 0 && (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => exportMonthlyReportToExcel(report, reportYear, reportMonth)}>
                <Download className="h-4 w-4" /> Excel
              </Button>
              <Button variant="secondary" onClick={() => exportMonthlyReportToPdf(report, reportYear, reportMonth)}>
                <Download className="h-4 w-4" /> PDF
              </Button>
            </div>
          )}
        </div>

        <div className="mb-4 flex flex-wrap items-end gap-3">
          <MonthYearInput
            label="Month & Year"
            year={reportYear}
            month={reportMonth}
            onYearChange={(e) => setReportYear(Number(e.target.value))}
            onMonthChange={(e) => setReportMonth(Number(e.target.value))}
          />
          <Button
            variant="secondary"
            onClick={() => dispatch(fetchMonthlyReport({ year: reportYear, month: reportMonth }))}
            isLoading={isLoading}
          >
            <BarChart3 className="h-4 w-4" /> Generate
          </Button>
        </div>

        {report.length > 0 && (
          <>
            <div className="mb-4 flex flex-wrap gap-2">
              {[
                { label: 'Present',  key: 'present', cls: 'bg-emerald-50 text-emerald-700' },
                { label: 'Late',     key: 'late',    cls: 'bg-amber-50 text-amber-700'     },
                { label: 'Absent',   key: 'absent',  cls: 'bg-red-50 text-red-700'         },
                { label: 'On Leave', key: 'leave',   cls: 'bg-purple-50 text-purple-700'   },
              ].map(({ label, key, cls }) => {
                const total = report.reduce((s, r) => s + (r.summary[key] ?? 0), 0);
                return (
                  <span key={key} className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
                    {label}: {total}
                  </span>
                );
              })}
            </div>
            <DataTable columns={reportColumns} rows={report} getRowId={(r) => r.employee.id} />
          </>
        )}
      </section>
    </div>
  );
}
