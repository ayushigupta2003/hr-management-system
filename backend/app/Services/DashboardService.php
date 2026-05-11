<?php

namespace App\Services;

use App\Enums\AttendanceStatus;
use App\Enums\EmployeeStatus;
use App\Models\Attendance;
use App\Models\Department;
use App\Models\Employee;

class DashboardService
{
    public function stats(): array
    {
        $today = now()->toDateString();
        $todayTotal = Attendance::query()->whereDate('attendance_date', $today)->count();
        $todayPresent = Attendance::query()
            ->whereDate('attendance_date', $today)
            ->where('status', AttendanceStatus::Present->value)
            ->count();

        // Last 7 days attendance trend
        $trend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date  = now()->subDays($i)->toDateString();
            $total = Attendance::query()->whereDate('attendance_date', $date)->count();
            $present = Attendance::query()
                ->whereDate('attendance_date', $date)
                ->where('status', AttendanceStatus::Present->value)
                ->count();
            $trend[] = [
                'date'       => $date,
                'day'        => now()->subDays($i)->format('D'),
                'total'      => $total,
                'present'    => $present,
                'percentage' => $total > 0 ? round(($present / $total) * 100) : 0,
            ];
        }

        return [
            'employees' => [
                'total'    => Employee::query()->count(),
                'active'   => Employee::query()->where('status', EmployeeStatus::Active->value)->count(),
                'inactive' => Employee::query()->where('status', EmployeeStatus::Inactive->value)->count(),
            ],
            'departments' => [
                'total'  => Department::query()->count(),
                'active' => Department::query()->where('is_active', true)->count(),
            ],
            'attendance' => [
                'today_total'      => $todayTotal,
                'today_present'    => $todayPresent,
                'today_percentage' => $todayTotal > 0 ? round(($todayPresent / $todayTotal) * 100, 2) : 0,
                'weekly_trend'     => $trend,
            ],
        ];
    }
}
