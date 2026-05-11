<?php

namespace Database\Seeders;

use App\Models\Applicant;
use App\Models\Department;
use App\Models\JobPosting;
use Illuminate\Database\Seeder;

class RecruitmentSeeder extends Seeder
{
    public function run(): void
    {
        $depts = Department::query()->pluck('id', 'code');

        $postings = [
            [
                'dept'        => 'ENG',
                'title'       => 'Senior Backend Engineer',
                'description' => 'We are looking for an experienced backend engineer to join our growing engineering team. You will design and build scalable APIs, mentor junior developers, and contribute to architectural decisions.',
                'location'    => 'Bengaluru, Karnataka (Hybrid)',
                'type'        => 'full_time',
                'status'      => 'open',
                'deadline'    => '2026-06-30',
                'vacancies'   => 2,
                'applicants'  => [
                    ['name' => 'Siddharth Rao',      'email' => 'siddharth.rao@example.com',      'phone' => '+91 99001 11001', 'status' => 'interview',  'notes' => 'Strong system design skills. Schedule technical round 2.'],
                    ['name' => 'Meera Nambiar',       'email' => 'meera.nambiar@example.com',       'phone' => '+91 99001 11002', 'status' => 'screening',  'notes' => 'Good resume. Awaiting coding assessment results.'],
                    ['name' => 'Tarun Bhatt',         'email' => 'tarun.bhatt@example.com',         'phone' => '+91 99001 11003', 'status' => 'applied',    'notes' => null],
                    ['name' => 'Lakshmi Venkatesh',   'email' => 'lakshmi.venkatesh@example.com',   'phone' => '+91 99001 11004', 'status' => 'offered',    'notes' => 'Offer letter sent on 2026-05-08. Awaiting acceptance.'],
                    ['name' => 'Farhan Qureshi',      'email' => 'farhan.qureshi@example.com',      'phone' => '+91 99001 11005', 'status' => 'rejected',   'notes' => 'Did not meet minimum experience requirement.'],
                ],
            ],
            [
                'dept'        => 'ENG',
                'title'       => 'React Frontend Developer',
                'description' => 'Join our product team to build beautiful, performant user interfaces. You will work closely with designers and backend engineers to deliver exceptional user experiences.',
                'location'    => 'Remote',
                'type'        => 'full_time',
                'status'      => 'open',
                'deadline'    => '2026-07-15',
                'vacancies'   => 1,
                'applicants'  => [
                    ['name' => 'Anushka Tripathi',    'email' => 'anushka.tripathi@example.com',    'phone' => '+91 99001 11006', 'status' => 'interview',  'notes' => 'Excellent portfolio. Final round scheduled.'],
                    ['name' => 'Gaurav Mishra',       'email' => 'gaurav.mishra@example.com',       'phone' => '+91 99001 11007', 'status' => 'screening',  'notes' => 'Reviewing take-home assignment.'],
                    ['name' => 'Preethi Subramaniam', 'email' => 'preethi.subramaniam@example.com', 'phone' => '+91 99001 11008', 'status' => 'applied',    'notes' => null],
                ],
            ],
            [
                'dept'        => 'HR',
                'title'       => 'HR Business Partner',
                'description' => 'We need a strategic HR Business Partner to align HR initiatives with business objectives, manage employee relations, and drive talent development programs.',
                'location'    => 'Mumbai, Maharashtra',
                'type'        => 'full_time',
                'status'      => 'open',
                'deadline'    => '2026-06-15',
                'vacancies'   => 1,
                'applicants'  => [
                    ['name' => 'Deepika Agarwal',     'email' => 'deepika.agarwal@example.com',     'phone' => '+91 99001 11009', 'status' => 'hired',      'notes' => 'Joining date confirmed: 2026-06-01.'],
                    ['name' => 'Rajesh Pandey',       'email' => 'rajesh.pandey@example.com',       'phone' => '+91 99001 11010', 'status' => 'rejected',   'notes' => 'Insufficient HRBP experience.'],
                ],
            ],
            [
                'dept'        => 'MKT',
                'title'       => 'Performance Marketing Manager',
                'description' => 'Lead our paid acquisition strategy across Google, Meta, and LinkedIn. You will own campaign budgets, optimize for CAC and ROAS, and build a high-performing marketing team.',
                'location'    => 'New Delhi (On-site)',
                'type'        => 'full_time',
                'status'      => 'open',
                'deadline'    => '2026-07-01',
                'vacancies'   => 1,
                'applicants'  => [
                    ['name' => 'Shruti Bansal',       'email' => 'shruti.bansal@example.com',       'phone' => '+91 99001 11011', 'status' => 'interview',  'notes' => 'Strong paid media background. Culture fit round pending.'],
                    ['name' => 'Vivek Choudhary',     'email' => 'vivek.choudhary@example.com',     'phone' => '+91 99001 11012', 'status' => 'applied',    'notes' => null],
                    ['name' => 'Nandini Pillai',      'email' => 'nandini.pillai@example.com',      'phone' => '+91 99001 11013', 'status' => 'screening',  'notes' => 'Reviewing portfolio and case study.'],
                ],
            ],
            [
                'dept'        => 'FIN',
                'title'       => 'Senior Financial Analyst',
                'description' => 'Drive financial planning, forecasting, and analysis to support strategic decision-making. You will build financial models, prepare board-level reports, and partner with business units.',
                'location'    => 'Pune, Maharashtra',
                'type'        => 'full_time',
                'status'      => 'on_hold',
                'deadline'    => '2026-08-31',
                'vacancies'   => 1,
                'applicants'  => [
                    ['name' => 'Abhishek Saxena',     'email' => 'abhishek.saxena@example.com',     'phone' => '+91 99001 11014', 'status' => 'applied',    'notes' => 'Position on hold pending budget approval.'],
                ],
            ],
            [
                'dept'        => 'SLS',
                'title'       => 'Enterprise Sales Executive',
                'description' => 'Own the full sales cycle for enterprise accounts. You will prospect, qualify, demo, negotiate, and close deals with C-suite stakeholders across target verticals.',
                'location'    => 'Hyderabad, Telangana',
                'type'        => 'full_time',
                'status'      => 'closed',
                'deadline'    => '2026-04-30',
                'vacancies'   => 2,
                'applicants'  => [
                    ['name' => 'Manish Khanna',       'email' => 'manish.khanna@example.com',       'phone' => '+91 99001 11015', 'status' => 'hired',      'notes' => 'Joined 2026-05-01.'],
                    ['name' => 'Swati Jain',          'email' => 'swati.jain@example.com',          'phone' => '+91 99001 11016', 'status' => 'hired',      'notes' => 'Joined 2026-05-01.'],
                    ['name' => 'Rohit Srivastava',    'email' => 'rohit.srivastava@example.com',    'phone' => '+91 99001 11017', 'status' => 'rejected',   'notes' => 'Salary expectations above band.'],
                ],
            ],
            [
                'dept'        => 'OPS',
                'title'       => 'Operations Analyst (Intern)',
                'description' => 'A 6-month internship opportunity to support our operations team with process documentation, data analysis, and vendor coordination.',
                'location'    => 'Bengaluru, Karnataka',
                'type'        => 'internship',
                'status'      => 'open',
                'deadline'    => '2026-06-01',
                'vacancies'   => 2,
                'applicants'  => [
                    ['name' => 'Tanvi Kulkarni',      'email' => 'tanvi.kulkarni@example.com',      'phone' => '+91 99001 11018', 'status' => 'interview',  'notes' => 'Final year student. Good analytical skills.'],
                    ['name' => 'Harsh Vardhan',       'email' => 'harsh.vardhan@example.com',       'phone' => '+91 99001 11019', 'status' => 'applied',    'notes' => null],
                    ['name' => 'Poornima Rao',        'email' => 'poornima.rao@example.com',        'phone' => '+91 99001 11020', 'status' => 'screening',  'notes' => 'Reviewing academic transcripts.'],
                    ['name' => 'Akash Dubey',         'email' => 'akash.dubey@example.com',         'phone' => '+91 99001 11021', 'status' => 'offered',    'notes' => 'Internship offer sent. Start date: 2026-06-15.'],
                ],
            ],
        ];

        foreach ($postings as $data) {
            $applicants = $data['applicants'];
            unset($data['applicants']);

            $dept = $data['dept'];
            unset($data['dept']);

            $posting = JobPosting::query()->updateOrCreate(
                [
                    'department_id' => $depts[$dept],
                    'title'         => $data['title'],
                ],
                array_merge($data, ['department_id' => $depts[$dept]])
            );

            foreach ($applicants as $applicant) {
                Applicant::query()->updateOrCreate(
                    [
                        'job_posting_id' => $posting->id,
                        'email'          => $applicant['email'],
                    ],
                    array_merge($applicant, ['job_posting_id' => $posting->id])
                );
            }
        }
    }
}
