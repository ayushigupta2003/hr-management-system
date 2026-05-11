import { useEffect, useState, useCallback } from 'react';
import {
  Briefcase, Plus, Pencil, Trash2, Users,
  ChevronDown, ChevronUp, UserPlus, X,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Avatar } from '../../../components/common/Avatar';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { InputField } from '../../../components/forms/InputField';
import { SelectField } from '../../../components/forms/SelectField';
import { Modal } from '../../../components/common/Modal';
import { PageHeader } from '../../../components/common/PageHeader';
import { TableSkeleton } from '../../../components/feedback/LoadingSkeleton';
import { fetchDepartments } from '../../departments/store/departmentsSlice';
import { recruitmentApi } from '../services/recruitmentApi';

const JOB_TYPES     = ['full_time','part_time','contract','internship'];
const JOB_STATUSES  = ['open','closed','on_hold'];
const APP_STATUSES  = ['applied','screening','interview','offered','hired','rejected'];

const STATUS_COLORS = {
  open:        'bg-emerald-50 text-emerald-700',
  closed:      'bg-slate-100 text-slate-600',
  on_hold:     'bg-amber-50 text-amber-700',
  applied:     'bg-sky-50 text-sky-700',
  screening:   'bg-violet-50 text-violet-700',
  interview:   'bg-amber-50 text-amber-700',
  offered:     'bg-brand-50 text-brand-700',
  hired:       'bg-emerald-50 text-emerald-700',
  rejected:    'bg-red-50 text-red-700',
};

function StatusChip({ status }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLORS[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {status?.replace('_', ' ')}
    </span>
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

const EMPTY_JOB = { department_id:'', title:'', description:'', location:'', type:'full_time', status:'open', deadline:'', vacancies:1 };
const EMPTY_APP = { name:'', email:'', phone:'', status:'applied', notes:'' };

export function RecruitmentPage() {
  const dispatch   = useDispatch();
  const departments = useSelector((s) => s.departments.items);

  const [jobs,        setJobs]        = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [expandedJob, setExpandedJob] = useState(null);
  const [applicants,  setApplicants]  = useState({});

  // Job modal
  const [jobModal,    setJobModal]    = useState(false);
  const [editingJob,  setEditingJob]  = useState(null);
  const [jobForm,     setJobForm]     = useState(EMPTY_JOB);
  const [jobSaving,   setJobSaving]   = useState(false);
  const [confirmJob,  setConfirmJob]  = useState(null);

  // Applicant modal
  const [appModal,    setAppModal]    = useState(null); // jobId
  const [editingApp,  setEditingApp]  = useState(null);
  const [appForm,     setAppForm]     = useState(EMPTY_APP);
  const [appSaving,   setAppSaving]   = useState(false);
  const [confirmApp,  setConfirmApp]  = useState(null); // {jobId, appId}

  useEffect(() => { dispatch(fetchDepartments({ per_page: 100 })); }, [dispatch]);
  useEffect(() => { loadJobs(); }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await recruitmentApi.listJobs({ per_page: 50 });
      setJobs(res.data ?? []);
    } catch { toast.error('Failed to load jobs.'); }
    finally { setLoading(false); }
  };

  const loadApplicants = async (jobId) => {
    try {
      const res = await recruitmentApi.listApplicants(jobId, { per_page: 50 });
      setApplicants((prev) => ({ ...prev, [jobId]: res.data ?? [] }));
    } catch { toast.error('Failed to load applicants.'); }
  };

  const toggleExpand = (jobId) => {
    if (expandedJob === jobId) { setExpandedJob(null); return; }
    setExpandedJob(jobId);
    if (!applicants[jobId]) loadApplicants(jobId);
  };

  // ── Job CRUD ──────────────────────────────────────────────────────────────
  const openJobModal = (job = null) => {
    setEditingJob(job);
    setJobForm(job ? { ...job, deadline: job.deadline ?? '', department_id: job.department_id ?? '' } : EMPTY_JOB);
    setJobModal(true);
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setJobSaving(true);
    try {
      if (editingJob) {
        await recruitmentApi.updateJob(editingJob.id, jobForm);
        toast.success('Job updated.');
      } else {
        await recruitmentApi.createJob(jobForm);
        toast.success('Job created.');
      }
      setJobModal(false);
      loadJobs();
    } catch (err) { toast.error(err.message ?? 'Failed.'); }
    finally { setJobSaving(false); }
  };

  const handleDeleteJob = async (id) => {
    try { await recruitmentApi.deleteJob(id); toast.success('Job deleted.'); loadJobs(); }
    catch { toast.error('Failed to delete.'); }
    setConfirmJob(null);
  };

  // ── Applicant CRUD ────────────────────────────────────────────────────────
  const openAppModal = (jobId, app = null) => {
    setAppModal(jobId);
    setEditingApp(app);
    setAppForm(app ? { name: app.name, email: app.email, phone: app.phone ?? '', status: app.status, notes: app.notes ?? '' } : EMPTY_APP);
  };

  const handleAppSubmit = async (e) => {
    e.preventDefault();
    setAppSaving(true);
    try {
      if (editingApp) {
        await recruitmentApi.updateApplicant(appModal, editingApp.id, appForm);
        toast.success('Applicant updated.');
      } else {
        await recruitmentApi.createApplicant(appModal, appForm);
        toast.success('Applicant added.');
      }
      setAppModal(null);
      loadApplicants(appModal);
    } catch (err) { toast.error(err.message ?? 'Failed.'); }
    finally { setAppSaving(false); }
  };

  const handleDeleteApp = async ({ jobId, appId }) => {
    try { await recruitmentApi.deleteApplicant(jobId, appId); toast.success('Applicant removed.'); loadApplicants(jobId); }
    catch { toast.error('Failed.'); }
    setConfirmApp(null);
  };

  const jf = (field) => (e) => setJobForm((c) => ({ ...c, [field]: e.target.value }));
  const af = (field) => (e) => setAppForm((c) => ({ ...c, [field]: e.target.value }));

  return (
    <div className="grid gap-6 animate-fade-in">
      <PageHeader
        title="Recruitment"
        description="Manage job postings and track applicants."
        icon={Briefcase}
        actions={
          <Button onClick={() => openJobModal()}>
            <Plus className="h-4 w-4" /> New Job Posting
          </Button>
        }
      />

      {loading ? <TableSkeleton rows={4} /> : (
        <div className="grid gap-4">
          {jobs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <Briefcase className="mx-auto mb-3 h-10 w-10 text-slate-300" />
              <p className="text-sm text-slate-400">No job postings yet. Create one to get started.</p>
            </div>
          )}
          {jobs.map((job) => (
            <div key={job.id} className="rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden">
              {/* Job header */}
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-ink">{job.title}</h3>
                    <StatusChip status={job.status} />
                    <span className="text-xs text-slate-400 capitalize">{job.type?.replace('_',' ')}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {job.department?.name} {job.location && `· ${job.location}`} · {job.vacancies} vacanc{job.vacancies === 1 ? 'y' : 'ies'}
                    {job.deadline && ` · Deadline: ${job.deadline}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    <Users className="h-3 w-3" /> {job.applicants_count ?? 0}
                  </span>
                  <IconBtn onClick={() => openJobModal(job)} title="Edit" className="hover:bg-slate-100">
                    <Pencil className="h-4 w-4 text-slate-500" />
                  </IconBtn>
                  <IconBtn onClick={() => setConfirmJob(job.id)} title="Delete" className="hover:bg-red-50">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </IconBtn>
                  <IconBtn onClick={() => toggleExpand(job.id)} title="View applicants" className="hover:bg-brand-50">
                    {expandedJob === job.id
                      ? <ChevronUp className="h-4 w-4 text-brand-500" />
                      : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </IconBtn>
                </div>
              </div>

              {/* Applicants panel */}
              {expandedJob === job.id && (
                <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-ink">Applicants</h4>
                    <Button variant="secondary" className="h-8 text-xs gap-1.5" onClick={() => openAppModal(job.id)}>
                      <UserPlus className="h-3.5 w-3.5" /> Add Applicant
                    </Button>
                  </div>
                  {!applicants[job.id] ? (
                    <p className="text-xs text-slate-400">Loading…</p>
                  ) : applicants[job.id].length === 0 ? (
                    <p className="text-xs text-slate-400">No applicants yet.</p>
                  ) : (
                    <div className="grid gap-2">
                      {applicants[job.id].map((app) => (
                        <div key={app.id} className="flex items-center gap-3 rounded-xl bg-white px-4 py-2.5 shadow-sm">
                          <Avatar name={app.name} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ink">{app.name}</p>
                            <p className="text-xs text-slate-400">{app.email}{app.phone && ` · ${app.phone}`}</p>
                          </div>
                          <StatusChip status={app.status} />
                          <IconBtn onClick={() => openAppModal(job.id, app)} title="Edit" className="hover:bg-slate-100">
                            <Pencil className="h-3.5 w-3.5 text-slate-400" />
                          </IconBtn>
                          <IconBtn onClick={() => setConfirmApp({ jobId: job.id, appId: app.id })} title="Remove" className="hover:bg-red-50">
                            <X className="h-3.5 w-3.5 text-red-400" />
                          </IconBtn>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Job modal */}
      <Modal title={editingJob ? 'Edit Job Posting' : 'New Job Posting'} isOpen={jobModal} onClose={() => setJobModal(false)}>
        <form className="grid gap-4" onSubmit={handleJobSubmit}>
          <InputField label="Job title" value={jobForm.title} onChange={jf('title')} placeholder="e.g. Senior Developer" />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Department" value={jobForm.department_id} onChange={jf('department_id')}>
              <option value="">Select department</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </SelectField>
            <InputField label="Location" value={jobForm.location} onChange={jf('location')} placeholder="e.g. Mumbai / Remote" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <SelectField label="Type" value={jobForm.type} onChange={jf('type')}>
              {JOB_TYPES.map((t) => <option key={t} value={t}>{t.replace('_',' ')}</option>)}
            </SelectField>
            <SelectField label="Status" value={jobForm.status} onChange={jf('status')}>
              {JOB_STATUSES.map((s) => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
            </SelectField>
            <InputField label="Vacancies" type="number" min="1" value={jobForm.vacancies} onChange={jf('vacancies')} />
          </div>
          <InputField label="Deadline" type="date" value={jobForm.deadline} onChange={jf('deadline')} />
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            <span>Description</span>
            <textarea rows={3} value={jobForm.description} onChange={jf('description')}
              placeholder="Job description, requirements…"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-ink outline-none hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none" />
          </label>
          <Button type="submit" isLoading={jobSaving}>{editingJob ? 'Update Job' : 'Create Job'}</Button>
        </form>
      </Modal>

      {/* Applicant modal */}
      <Modal title={editingApp ? 'Edit Applicant' : 'Add Applicant'} isOpen={!!appModal} onClose={() => setAppModal(null)}>
        <form className="grid gap-4" onSubmit={handleAppSubmit}>
          <InputField label="Full name" value={appForm.name} onChange={af('name')} placeholder="John Doe" />
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Email" type="email" value={appForm.email} onChange={af('email')} placeholder="john@email.com" />
            <InputField label="Phone" value={appForm.phone} onChange={af('phone')} placeholder="+91 98765 43210" />
          </div>
          <SelectField label="Status" value={appForm.status} onChange={af('status')}>
            {APP_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </SelectField>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            <span>Notes</span>
            <textarea rows={2} value={appForm.notes} onChange={af('notes')} placeholder="Interview notes, feedback…"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-ink outline-none hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none" />
          </label>
          <Button type="submit" isLoading={appSaving}>{editingApp ? 'Update Applicant' : 'Add Applicant'}</Button>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!confirmJob} title="Delete Job Posting" message="All applicants for this job will also be deleted."
        onConfirm={() => handleDeleteJob(confirmJob)} onCancel={() => setConfirmJob(null)} />
      <ConfirmDialog isOpen={!!confirmApp} title="Remove Applicant" message="This applicant record will be permanently deleted."
        onConfirm={() => handleDeleteApp(confirmApp)} onCancel={() => setConfirmApp(null)} />
    </div>
  );
}
