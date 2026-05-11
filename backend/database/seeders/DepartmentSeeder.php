<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        collect([
            [
                'name'        => 'Human Resources',
                'code'        => 'HR',
                'description' => 'People operations, hiring, onboarding, and compliance.',
                'is_active'   => true,
            ],
            [
                'name'        => 'Engineering',
                'code'        => 'ENG',
                'description' => 'Product engineering, software development, and technical delivery.',
                'is_active'   => true,
            ],
            [
                'name'        => 'Finance',
                'code'        => 'FIN',
                'description' => 'Payroll, accounts, budgeting, and financial operations.',
                'is_active'   => true,
            ],
            [
                'name'        => 'Operations',
                'code'        => 'OPS',
                'description' => 'Business operations, logistics, and administration.',
                'is_active'   => true,
            ],
            [
                'name'        => 'Marketing',
                'code'        => 'MKT',
                'description' => 'Brand management, campaigns, and digital marketing.',
                'is_active'   => true,
            ],
            [
                'name'        => 'Sales',
                'code'        => 'SLS',
                'description' => 'Revenue generation, client acquisition, and account management.',
                'is_active'   => true,
            ],
        ])->each(fn (array $dept) => Department::query()->updateOrCreate(
            ['code' => $dept['code']],
            $dept
        ));
    }
}
