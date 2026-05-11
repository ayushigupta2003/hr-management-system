<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role?->value,
            'status' => $this->status?->value,
            'avatar_path' => $this->avatar_path,
            'phone' => $this->phone,
            'job_title' => $this->job_title,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
