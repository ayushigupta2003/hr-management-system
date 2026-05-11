<?php

namespace Database\Seeders;

use App\Enums\EmployeeStatus;
use App\Models\Department;
use App\Models\Employee;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $depts = Department::query()->pluck('id', 'code');

        $employees = [
            // Human Resources
            [
                'code' => 'EMP-1001', 'dept' => 'HR',
                'first' => 'Aarav',    'last' => 'Sharma',
                'email' => 'aarav.sharma@hrms.test',
                'phone' => '+91 98765 43210',
                'designation' => 'HR Manager',
                'joining_date' => '2022-03-01',
                'salary' => 95000,
                'address' => 'Bandra West, Mumbai, Maharashtra',
                'status' => EmployeeStatus::Active,
            ],
            [
                'code' => 'EMP-1002', 'dept' => 'HR',
                'first' => 'Priya',   'last' => 'Nair',
                'email' => 'priya.nair@hrms.test',
                'phone' => '+91 98765 43211',
                'designation' => 'HR Executive',
                'joining_date' => '2023-01-15',
                'salary' => 55000,
                'address' => 'Koramangala, Bengaluru, Karnataka',
                'status' => EmployeeStatus::Active,
            ],

            // Engineering
            [
                'code' => 'EMP-1003', 'dept' => 'ENG',
                'first' => 'Rohan',   'last' => 'Mehta',
                'email' => 'rohan.mehta@hrms.test',
                'phone' => '+91 98765 43212',
                'designation' => 'Engineering Lead',
                'joining_date' => '2021-07-01',
                'salary' => 145000,
                'address' => 'Powai, Mumbai, Maharashtra',
                'status' => EmployeeStatus::Active,
            ],
            [
                'code' => 'EMP-1004', 'dept' => 'ENG',
                'first' => 'Maya',    'last' => 'Iyer',
                'email' => 'maya.iyer@hrms.test',
                'phone' => '+91 98765 43213',
                'designation' => 'Senior Software Engineer',
                'joining_date' => '2022-06-15',
                'salary' => 120000,
                'address' => 'Indiranagar, Bengaluru, Karnataka',
                'status' => EmployeeStatus::Active,
            ],
            [
                'code' => 'EMP-1005', 'dept' => 'ENG',
                'first' => 'Arjun',   'last' => 'Patel',
                'email' => 'arjun.patel@hrms.test',
                'phone' => '+91 98765 43214',
                'designation' => 'Software Engineer',
                'joining_date' => '2023-03-01',
                'salary' => 85000,
                'address' => 'Satellite, Ahmedabad, Gujarat',
                'status' => EmployeeStatus::Active,
            ],
            [
                'code' => 'EMP-1006', 'dept' => 'ENG',
                'first' => 'Sneha',   'last' => 'Reddy',
                'email' => 'sneha.reddy@hrms.test',
                'phone' => '+91 98765 43215',
                'designation' => 'Frontend Developer',
                'joining_date' => '2023-08-01',
                'salary' => 78000,
                'address' => 'Jubilee Hills, Hyderabad, Telangana',
                'status' => EmployeeStatus::Active,
            ],
            [
                'code' => 'EMP-1007', 'dept' => 'ENG',
                'first' => 'Karan',   'last' => 'Singh',
                'email' => 'karan.singh@hrms.test',
                'phone' => '+91 98765 43216',
                'designation' => 'DevOps Engineer',
                'joining_date' => '2022-11-01',
                'salary' => 105000,
                'address' => 'Sector 62, Noida, Uttar Pradesh',
                'status' => EmployeeStatus::Active,
            ],
            [
                'code' => 'EMP-1008', 'dept' => 'ENG',
                'first' => 'Divya',   'last' => 'Krishnan',
                'email' => 'divya.krishnan@hrms.test',
                'phone' => '+91 98765 43217',
                'designation' => 'QA Engineer',
                'joining_date' => '2024-01-10',
                'salary' => 68000,
                'address' => 'Anna Nagar, Chennai, Tamil Nadu',
                'status' => EmployeeStatus::Inactive,
            ],

            // Finance
            [
                'code' => 'EMP-1009', 'dept' => 'FIN',
                'first' => 'Vikram',  'last' => 'Joshi',
                'email' => 'vikram.joshi@hrms.test',
                'phone' => '+91 98765 43218',
                'designation' => 'Finance Manager',
                'joining_date' => '2021-04-01',
                'salary' => 110000,
                'address' => 'Deccan, Pune, Maharashtra',
                'status' => EmployeeStatus::Active,
            ],
            [
                'code' => 'EMP-1010', 'dept' => 'FIN',
                'first' => 'Ananya',  'last' => 'Gupta',
                'email' => 'ananya.gupta@hrms.test',
                'phone' => '+91 98765 43219',
                'designation' => 'Accountant',
                'joining_date' => '2023-05-01',
                'salary' => 60000,
                'address' => 'Lajpat Nagar, New Delhi',
                'status' => EmployeeStatus::Active,
            ],
            [
                'code' => 'EMP-1011', 'dept' => 'FIN',
                'first' => 'Rahul',   'last' => 'Verma',
                'email' => 'rahul.verma@hrms.test',
                'phone' => '+91 98765 43220',
                'designation' => 'Financial Analyst',
                'joining_date' => '2022-09-01',
                'salary' => 82000,
                'address' => 'Salt Lake, Kolkata, West Bengal',
                'status' => EmployeeStatus::Active,
            ],

            // Operations
            [
                'code' => 'EMP-1012', 'dept' => 'OPS',
                'first' => 'Neha',    'last' => 'Kapoor',
                'email' => 'neha.kapoor@hrms.test',
                'phone' => '+91 98765 43221',
                'designation' => 'Operations Manager',
                'joining_date' => '2021-01-15',
                'salary' => 100000,
                'address' => 'Andheri East, Mumbai, Maharashtra',
                'status' => EmployeeStatus::Active,
            ],
            [
                'code' => 'EMP-1013', 'dept' => 'OPS',
                'first' => 'Suresh',  'last' => 'Kumar',
                'email' => 'suresh.kumar@hrms.test',
                'phone' => '+91 98765 43222',
                'designation' => 'Operations Executive',
                'joining_date' => '2023-02-01',
                'salary' => 52000,
                'address' => 'Whitefield, Bengaluru, Karnataka',
                'status' => EmployeeStatus::Active,
            ],

            // Marketing
            [
                'code' => 'EMP-1014', 'dept' => 'MKT',
                'first' => 'Pooja',   'last' => 'Malhotra',
                'email' => 'pooja.malhotra@hrms.test',
                'phone' => '+91 98765 43223',
                'designation' => 'Marketing Manager',
                'joining_date' => '2022-02-01',
                'salary' => 98000,
                'address' => 'Connaught Place, New Delhi',
                'status' => EmployeeStatus::Active,
            ],
            [
                'code' => 'EMP-1015', 'dept' => 'MKT',
                'first' => 'Aditya',  'last' => 'Bose',
                'email' => 'aditya.bose@hrms.test',
                'phone' => '+91 98765 43224',
                'designation' => 'Digital Marketing Specialist',
                'joining_date' => '2023-06-01',
                'salary' => 65000,
                'address' => 'Park Street, Kolkata, West Bengal',
                'status' => EmployeeStatus::Active,
            ],
            [
                'code' => 'EMP-1016', 'dept' => 'MKT',
                'first' => 'Riya',    'last' => 'Shah',
                'email' => 'riya.shah@hrms.test',
                'phone' => '+91 98765 43225',
                'designation' => 'Content Strategist',
                'joining_date' => '2024-02-01',
                'salary' => 58000,
                'address' => 'Navrangpura, Ahmedabad, Gujarat',
                'status' => EmployeeStatus::Active,
            ],

            // Sales
            [
                'code' => 'EMP-1017', 'dept' => 'SLS',
                'first' => 'Amit',    'last' => 'Tiwari',
                'email' => 'amit.tiwari@hrms.test',
                'phone' => '+91 98765 43226',
                'designation' => 'Sales Manager',
                'joining_date' => '2021-10-01',
                'salary' => 115000,
                'address' => 'Gomti Nagar, Lucknow, Uttar Pradesh',
                'status' => EmployeeStatus::Active,
            ],
            [
                'code' => 'EMP-1018', 'dept' => 'SLS',
                'first' => 'Kavya',   'last' => 'Pillai',
                'email' => 'kavya.pillai@hrms.test',
                'phone' => '+91 98765 43227',
                'designation' => 'Sales Executive',
                'joining_date' => '2023-04-01',
                'salary' => 55000,
                'address' => 'Thrissur, Kerala',
                'status' => EmployeeStatus::Active,
            ],
            [
                'code' => 'EMP-1019', 'dept' => 'SLS',
                'first' => 'Nikhil',  'last' => 'Desai',
                'email' => 'nikhil.desai@hrms.test',
                'phone' => '+91 98765 43228',
                'designation' => 'Account Manager',
                'joining_date' => '2022-08-01',
                'salary' => 88000,
                'address' => 'Viman Nagar, Pune, Maharashtra',
                'status' => EmployeeStatus::Active,
            ],
            [
                'code' => 'EMP-1020', 'dept' => 'SLS',
                'first' => 'Ishaan',  'last' => 'Chaudhary',
                'email' => 'ishaan.chaudhary@hrms.test',
                'phone' => '+91 98765 43229',
                'designation' => 'Business Development Executive',
                'joining_date' => '2024-03-01',
                'salary' => 50000,
                'address' => 'Sector 17, Chandigarh',
                'status' => EmployeeStatus::Active,
            ],
        ];

        foreach ($employees as $emp) {
            Employee::query()->updateOrCreate(
                ['employee_code' => $emp['code']],
                [
                    'department_id' => $depts[$emp['dept']] ?? null,
                    'employee_code' => $emp['code'],
                    'first_name'    => $emp['first'],
                    'last_name'     => $emp['last'],
                    'email'         => $emp['email'],
                    'phone'         => $emp['phone'],
                    'designation'   => $emp['designation'],
                    'joining_date'  => $emp['joining_date'],
                    'salary'        => $emp['salary'],
                    'address'       => $emp['address'],
                    'status'        => $emp['status'],
                ]
            );
        }
    }
}
