<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\PerformanceReview;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PerformanceController extends Controller
{
    public function index(Request $request)
    {
        $reviews = PerformanceReview::with(['employee', 'reviewer'])
            ->when($request->employee_id, fn ($q, $e) => $q->where('employee_id', $e))
            ->when($request->status,      fn ($q, $s) => $q->where('status', $s))
            ->when($request->period,      fn ($q, $p) => $q->where('period', 'like', "%{$p}%"))
            ->latest('review_date')
            ->paginate($request->per_page ?? 10);

        return response()->json([
            'success' => true,
            'message' => 'Performance reviews fetched.',
            'data'    => $reviews->items(),
            'meta'    => $reviews->toArray(),
        ]);
    }

    public function myReviews(Request $request)
    {
        // Employee sees only their own reviews
        $employee = \App\Models\Employee::where('user_id', auth()->id())->first();

        $reviews = PerformanceReview::with(['employee', 'reviewer'])
            ->when($employee, fn ($q) => $q->where('employee_id', $employee->id))
            ->where('status', '!=', 'draft') // employees see submitted/acknowledged only
            ->latest('review_date')
            ->paginate($request->per_page ?? 10);

        return response()->json([
            'success' => true,
            'message' => 'Your performance reviews fetched.',
            'data'    => $reviews->items(),
            'meta'    => $reviews->toArray(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'employee_id'  => ['required', 'exists:employees,id'],
            'period'       => ['required', 'string', 'max:50'],
            'rating'       => ['required', 'integer', 'between:1,5'],
            'strengths'    => ['nullable', 'string'],
            'improvements' => ['nullable', 'string'],
            'goals'        => ['nullable', 'string'],
            'comments'     => ['nullable', 'string'],
            'status'       => ['required', 'in:draft,submitted,acknowledged'],
            'review_date'  => ['required', 'date'],
        ]);

        $data['reviewer_id'] = Auth::id();

        $review = PerformanceReview::create($data);

        return $this->successResponse('Review created.', [
            'review' => $review->load(['employee', 'reviewer']),
        ], 201);
    }

    public function update(Request $request, PerformanceReview $review): JsonResponse
    {
        $data = $request->validate([
            'employee_id'  => ['required', 'exists:employees,id'],
            'period'       => ['required', 'string', 'max:50'],
            'rating'       => ['required', 'integer', 'between:1,5'],
            'strengths'    => ['nullable', 'string'],
            'improvements' => ['nullable', 'string'],
            'goals'        => ['nullable', 'string'],
            'comments'     => ['nullable', 'string'],
            'status'       => ['required', 'in:draft,submitted,acknowledged'],
            'review_date'  => ['required', 'date'],
        ]);

        $review->update($data);

        return $this->successResponse('Review updated.', [
            'review' => $review->fresh()->load(['employee', 'reviewer']),
        ]);
    }

    public function destroy(PerformanceReview $review): JsonResponse
    {
        $review->delete();

        return $this->successResponse('Review deleted.');
    }
}
