<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\StoreEmployeeRequest;
use App\Http\Requests\Employee\UpdateEmployeeRequest;
use App\Http\Resources\EmployeeResource;
use App\Models\Employee;
use App\Services\EmployeeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class EmployeeController extends Controller
{
    public function __construct(
        private readonly EmployeeService $employees
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        return EmployeeResource::collection(
            $this->employees->list($request->only('search', 'department_id', 'status', 'per_page'))
        );
    }

    public function store(StoreEmployeeRequest $request): JsonResponse
    {
        return $this->successResponse('Employee created successfully.', [
            'employee' => new EmployeeResource(
                $this->employees->create($request->validated(), $request->file('image'))
            ),
        ], 201);
    }

    public function show(Employee $employee): JsonResponse
    {
        return $this->successResponse('Employee fetched successfully.', [
            'employee' => new EmployeeResource($employee->load('department')),
        ]);
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee): JsonResponse
    {
        return $this->successResponse('Employee updated successfully.', [
            'employee' => new EmployeeResource(
                $this->employees->update($employee, $request->validated(), $request->file('image'))
            ),
        ]);
    }

    public function destroy(Employee $employee): JsonResponse
    {
        $this->employees->delete($employee);

        return $this->successResponse('Employee deleted successfully.');
    }

    public function toggleStatus(Employee $employee): JsonResponse
    {
        return $this->successResponse('Employee status updated successfully.', [
            'employee' => new EmployeeResource($this->employees->toggleStatus($employee)),
        ]);
    }
}
