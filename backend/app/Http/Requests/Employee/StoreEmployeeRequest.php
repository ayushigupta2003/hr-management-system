<?php

namespace App\Http\Requests\Employee;

use App\Enums\EmployeeStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['nullable', 'exists:users,id', 'unique:employees,user_id'],
            'department_id' => ['required', 'exists:departments,id'],
            'employee_code' => ['required', 'string', 'max:60', 'unique:employees,employee_code'],
            'first_name' => ['required', 'string', 'max:80'],
            'last_name' => ['required', 'string', 'max:80'],
            'email' => ['required', 'email:rfc', 'max:255', 'unique:employees,email'],
            'phone' => ['nullable', 'string', 'max:30'],
            'designation' => ['required', 'string', 'max:120'],
            'joining_date' => ['nullable', 'date'],
            'salary' => ['nullable', 'numeric', 'min:0'],
            'address' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:2048'],
            'status' => ['sometimes', Rule::in(EmployeeStatus::values())],
        ];
    }
}
