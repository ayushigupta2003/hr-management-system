<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'employee_id'     => $this->employee_id,
            'attendance_date' => $this->attendance_date?->toDateString(),
            'check_in'        => $this->check_in,   // already "HH:MM" via accessor
            'check_out'       => $this->check_out,  // already "HH:MM" via accessor
            'status'          => $this->status?->value,
            'remarks'         => $this->remarks,
            'employee'        => new EmployeeResource($this->whenLoaded('employee')),
            'created_at'      => $this->created_at?->toISOString(),
        ];
    }
}
