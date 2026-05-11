<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'department_id' => $this->department_id,
            'employee_code' => $this->employee_code,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name'     => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'designation' => $this->designation,
            'joining_date' => $this->joining_date?->toDateString(),
            'salary' => $this->salary,
            'address' => $this->address,
            'image_path' => $this->image_path,
            'status' => $this->status?->value,
            'department' => new DepartmentResource($this->whenLoaded('department')),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
