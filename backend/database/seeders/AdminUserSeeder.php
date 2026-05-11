<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@hrms.test'],
            [
                'name' => 'System Admin',
                'password' => 'Password123',
                'role' => UserRole::Admin,
                'status' => UserStatus::Active,
                'job_title' => 'HRMS Administrator',
            ]
        );
    }
}
