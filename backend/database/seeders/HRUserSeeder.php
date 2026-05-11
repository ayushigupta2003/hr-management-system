<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Database\Seeder;

class HRUserSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'hr@hrms.test'],
            [
                'name' => 'HR Manager',
                'password' => 'Password123',
                'role' => UserRole::HR,
                'status' => UserStatus::Active,
                'job_title' => 'HR Manager',
            ]
        );

        User::query()->updateOrCreate(
            ['email' => 'employee@hrms.test'],
            [
                'name' => 'Test Employee',
                'password' => 'Password123',
                'role' => UserRole::Employee,
                'status' => UserStatus::Active,
                'job_title' => 'Software Engineer',
            ]
        );
    }
}
