<?php

namespace App\Services;

use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class AttendanceService
{
    public function list(array $filters): LengthAwarePaginator
    {
        return Attendance::query()
            ->with(['employee.department'])
            ->when($filters['employee_id'] ?? null, fn ($query, $employeeId) => $query->where('employee_id', $employeeId))
            ->when($filters['date'] ?? null, fn ($query, $date) => $query->whereDate('attendance_date', $date))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->latest('attendance_date')
            ->paginate($filters['per_page'] ?? 10);
    }

    public function mark(array $payload): Attendance
    {
        return Attendance::query()->updateOrCreate(
            [
                'employee_id'     => $payload['employee_id'],
                'attendance_date' => $payload['attendance_date'],
            ],
            $payload
        )->load(['employee.department']);
    }

    /**
     * Bulk upsert multiple attendance records at once.
     * Returns count of records processed.
     */
    public function bulkMark(array $records): int
    {
        foreach ($records as $record) {
            Attendance::query()->updateOrCreate(
                [
                    'employee_id'     => $record['employee_id'],
                    'attendance_date' => $record['attendance_date'],
                ],
                $record
            );
        }

        return count($records);
    }

    public function monthlyReport(int $year, int $month): Collection
    {
        $start = Carbon::create($year, $month, 1)->startOfMonth();
        $end   = $start->copy()->endOfMonth();

        return Attendance::query()
            ->selectRaw('employee_id, status, count(*) as total')
            ->whereBetween('attendance_date', [$start->toDateString(), $end->toDateString()])
            ->groupBy('employee_id', 'status')
            ->with('employee.department')
            ->get()
            ->groupBy('employee_id')
            ->map(function ($rows) {
                $employee = $rows->first()->employee;

                // Use the raw string value of status as the key
                $summary = $rows->mapWithKeys(function ($row) {
                    $key = $row->status instanceof \BackedEnum
                        ? $row->status->value
                        : (string) $row->status;
                    return [$key => (int) $row->total];
                })->all();

                return [
                    'employee' => [
                        'id'            => $employee->id,
                        'full_name'     => $employee->full_name,
                        'employee_code' => $employee->employee_code,
                        'department'    => $employee->department?->name,
                    ],
                    'summary' => $summary,
                ];
            })
            ->values();
    }
}
