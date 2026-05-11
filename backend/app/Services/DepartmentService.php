<?php

namespace App\Services;

use App\Models\Department;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class DepartmentService
{
    public function list(array $filters): LengthAwarePaginator
    {
        return Department::query()
            ->withCount('employees')
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($inner) use ($search): void {
                    $inner->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($filters['per_page'] ?? 10);
    }

    public function create(array $payload): Department
    {
        return Department::query()->create($payload)->loadCount('employees');
    }

    public function update(Department $department, array $payload): Department
    {
        $department->update($payload);

        return $department->refresh()->loadCount('employees');
    }

    public function delete(Department $department): void
    {
        $department->delete();
    }
}
