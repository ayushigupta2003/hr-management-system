<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Attendance\BulkAttendanceRequest;
use App\Http\Requests\Attendance\MonthlyReportRequest;
use App\Http\Requests\Attendance\StoreAttendanceRequest;
use App\Http\Resources\AttendanceResource;
use App\Services\AttendanceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AttendanceController extends Controller
{
    public function __construct(
        private readonly AttendanceService $attendance
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        return AttendanceResource::collection(
            $this->attendance->list($request->only('employee_id', 'date', 'status', 'per_page'))
        );
    }

    public function myAttendance(Request $request): AnonymousResourceCollection
    {
        // Employee sees only their own attendance
        $employee = \App\Models\Employee::where('user_id', auth()->id())->first();
        $filters  = $request->only('date', 'status', 'per_page');
        if ($employee) $filters['employee_id'] = $employee->id;

        return AttendanceResource::collection($this->attendance->list($filters));
    }

    public function store(StoreAttendanceRequest $request): JsonResponse
    {
        return $this->successResponse('Attendance marked successfully.', [
            'attendance' => new AttendanceResource($this->attendance->mark($request->validated())),
        ], 201);
    }

    public function bulkStore(BulkAttendanceRequest $request): JsonResponse
    {
        $count = $this->attendance->bulkMark($request->validated('records'));

        return $this->successResponse("Attendance marked for {$count} employee(s) successfully.", [
            'count' => $count,
        ], 201);
    }

    public function monthlyReport(MonthlyReportRequest $request): JsonResponse
    {
        return $this->successResponse('Monthly attendance report fetched successfully.', [
            'report' => $this->attendance->monthlyReport(
                (int) $request->validated('year'),
                (int) $request->validated('month')
            ),
        ]);
    }
}
