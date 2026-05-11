<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'      => ['required', 'string', 'max:120'],
            'email'     => ['required', 'email:rfc', 'max:255', Rule::unique('users', 'email')->ignore(Auth::id())],
            'phone'     => ['nullable', 'string', 'max:30'],
            'job_title' => ['nullable', 'string', 'max:120'],
        ];
    }
}
