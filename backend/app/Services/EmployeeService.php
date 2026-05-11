<?php

namespace App\Services;

use App\Enums\EmployeeStatus;
use App\Models\Employee;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class EmployeeService
{
    public function list(array $filters): LengthAwarePaginator
    {
        return Employee::query()
            ->with('department')
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($inner) use ($search): void {
                    $inner->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('employee_code', 'like', "%{$search}%");
                });
            })
            ->when($filters['department_id'] ?? null, fn ($query, $departmentId) => $query->where('department_id', $departmentId))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate($filters['per_page'] ?? 10);
    }

    public function create(array $payload, ?UploadedFile $image = null): Employee
    {
        if ($image) {
            $payload['image_path'] = $image->store('employees', 'public');
        }

        return Employee::query()->create($payload)->load('department');
    }

    public function update(Employee $employee, array $payload, ?UploadedFile $image = null): Employee
    {
        if ($image) {
            if ($employee->image_path) {
                Storage::disk('public')->delete($employee->image_path);
            }

            $payload['image_path'] = $image->store('employees', 'public');
        }

        $employee->update($payload);

        return $employee->refresh()->load('department');
    }

    public function delete(Employee $employee): void
    {
        if ($employee->image_path) {
            Storage::disk('public')->delete($employee->image_path);
        }

        $employee->delete();
    }

    public function toggleStatus(Employee $employee): Employee
    {
        $employee->update([
            'status' => $employee->status === EmployeeStatus::Active ? EmployeeStatus::Inactive : EmployeeStatus::Active,
        ]);

        return $employee->refresh()->load('department');
    }
}
