<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Department\StoreDepartmentRequest;
use App\Http\Requests\Department\UpdateDepartmentRequest;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use App\Services\DepartmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DepartmentController extends Controller
{
    public function __construct(
        private readonly DepartmentService $departments
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        return DepartmentResource::collection(
            $this->departments->list($request->only('search', 'per_page'))
        );
    }

    public function store(StoreDepartmentRequest $request): JsonResponse
    {
        return $this->successResponse('Department created successfully.', [
            'department' => new DepartmentResource($this->departments->create($request->validated())),
        ], 201);
    }

    public function show(Department $department): JsonResponse
    {
        return $this->successResponse('Department fetched successfully.', [
            'department' => new DepartmentResource($department->loadCount('employees')),
        ]);
    }

    public function update(UpdateDepartmentRequest $request, Department $department): JsonResponse
    {
        return $this->successResponse('Department updated successfully.', [
            'department' => new DepartmentResource($this->departments->update($department, $request->validated())),
        ]);
    }

    public function destroy(Department $department): JsonResponse
    {
        $this->departments->delete($department);

        return $this->successResponse('Department deleted successfully.');
    }
}
