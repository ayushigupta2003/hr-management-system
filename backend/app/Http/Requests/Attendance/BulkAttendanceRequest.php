<?php

namespace App\Http\Requests\Attendance;

use App\Enums\AttendanceStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BulkAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'records'                    => ['required', 'array', 'min:1'],
            'records.*.employee_id'      => ['required', 'exists:employees,id'],
            'records.*.attendance_date'  => ['required', 'date'],
            'records.*.check_in'         => ['nullable', 'date_format:H:i'],
            'records.*.check_out'        => ['nullable', 'date_format:H:i'],
            'records.*.status'           => ['required', Rule::in(AttendanceStatus::values())],
            'records.*.remarks'          => ['nullable', 'string', 'max:255'],
        ];
    }
}
