<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Applicant;
use App\Models\JobPosting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RecruitmentController extends Controller
{
    // ── Job Postings ──────────────────────────────────────────────────────────

    public function indexJobs(Request $request)
    {
        $jobs = JobPosting::with(['department'])
            ->withCount('applicants')
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when($request->department_id, fn ($q, $d) => $q->where('department_id', $d))
            ->latest()
            ->paginate($request->per_page ?? 10);

        return response()->json(['success' => true, 'message' => 'Job postings fetched.', 'data' => $jobs->items(), 'meta' => $jobs->toArray()]);
    }

    public function storeJob(Request $request): JsonResponse
    {
        $data = $request->validate([
            'department_id' => ['required', 'exists:departments,id'],
            'title'         => ['required', 'string', 'max:200'],
            'description'   => ['nullable', 'string'],
            'location'      => ['nullable', 'string', 'max:120'],
            'type'          => ['required', 'in:full_time,part_time,contract,internship'],
            'status'        => ['required', 'in:open,closed,on_hold'],
            'deadline'      => ['nullable', 'date'],
            'vacancies'     => ['required', 'integer', 'min:1'],
        ]);

        $job = JobPosting::create($data);

        return $this->successResponse('Job posting created.', ['job' => $job->load('department')], 201);
    }

    public function updateJob(Request $request, JobPosting $job): JsonResponse
    {
        $data = $request->validate([
            'department_id' => ['required', 'exists:departments,id'],
            'title'         => ['required', 'string', 'max:200'],
            'description'   => ['nullable', 'string'],
            'location'      => ['nullable', 'string', 'max:120'],
            'type'          => ['required', 'in:full_time,part_time,contract,internship'],
            'status'        => ['required', 'in:open,closed,on_hold'],
            'deadline'      => ['nullable', 'date'],
            'vacancies'     => ['required', 'integer', 'min:1'],
        ]);

        $job->update($data);

        return $this->successResponse('Job posting updated.', ['job' => $job->fresh()->load('department')]);
    }

    public function destroyJob(JobPosting $job): JsonResponse
    {
        $job->delete();

        return $this->successResponse('Job posting deleted.');
    }

    // ── Applicants ────────────────────────────────────────────────────────────

    public function indexApplicants(Request $request, JobPosting $job)
    {
        $applicants = $job->applicants()
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json(['success' => true, 'message' => 'Applicants fetched.', 'data' => $applicants->items(), 'meta' => $applicants->toArray()]);
    }

    public function storeApplicant(Request $request, JobPosting $job): JsonResponse
    {
        $data = $request->validate([
            'name'   => ['required', 'string', 'max:120'],
            'email'  => ['required', 'email'],
            'phone'  => ['nullable', 'string', 'max:30'],
            'status' => ['required', 'in:applied,screening,interview,offered,hired,rejected'],
            'notes'  => ['nullable', 'string'],
        ]);

        if ($request->hasFile('resume')) {
            $data['resume_path'] = $request->file('resume')->store('resumes', 'public');
        }

        $applicant = $job->applicants()->create($data);

        return $this->successResponse('Applicant added.', ['applicant' => $applicant], 201);
    }

    public function updateApplicant(Request $request, JobPosting $job, Applicant $applicant): JsonResponse
    {
        $data = $request->validate([
            'name'   => ['required', 'string', 'max:120'],
            'email'  => ['required', 'email'],
            'phone'  => ['nullable', 'string', 'max:30'],
            'status' => ['required', 'in:applied,screening,interview,offered,hired,rejected'],
            'notes'  => ['nullable', 'string'],
        ]);

        $applicant->update($data);

        return $this->successResponse('Applicant updated.', ['applicant' => $applicant->fresh()]);
    }

    public function destroyApplicant(JobPosting $job, Applicant $applicant): JsonResponse
    {
        $applicant->delete();

        return $this->successResponse('Applicant removed.');
    }
}
