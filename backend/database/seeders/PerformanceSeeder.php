<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\PerformanceReview;
use App\Models\User;
use Illuminate\Database\Seeder;

class PerformanceSeeder extends Seeder
{
    public function run(): void
    {
        // Use the admin/HR user as the reviewer
        $reviewer = User::query()->whereIn('email', [
            'admin@hrms.test',
            'hr@hrms.test',
        ])->first();

        if (! $reviewer) {
            $this->command->warn('No admin/HR user found. Skipping PerformanceSeeder.');
            return;
        }

        $employees = Employee::query()->pluck('id', 'employee_code');

        // Reviews keyed by employee_code
        $reviews = [
            // Engineering Lead – Rohan Mehta
            'EMP-1003' => [
                [
                    'period'       => 'Annual 2025',
                    'rating'       => 5,
                    'strengths'    => 'Exceptional technical leadership. Delivered the platform migration 2 weeks ahead of schedule. Mentors junior engineers effectively.',
                    'improvements' => 'Could improve cross-department communication and documentation practices.',
                    'goals'        => 'Lead the microservices transition in Q2 2026. Grow the engineering team by 3 hires.',
                    'comments'     => 'Rohan is a cornerstone of the engineering team. Highly recommended for a senior leadership role.',
                    'status'       => 'acknowledged',
                    'review_date'  => '2026-01-15',
                ],
                [
                    'period'       => 'Q1 2026',
                    'rating'       => 4,
                    'strengths'    => 'Successfully kicked off the microservices initiative. Strong stakeholder management.',
                    'improvements' => 'Sprint planning estimates have been off by ~20%. Needs better buffer planning.',
                    'goals'        => 'Complete Phase 1 of microservices by end of Q2. Reduce sprint carry-over to under 10%.',
                    'comments'     => 'Good quarter overall. On track for annual goals.',
                    'status'       => 'submitted',
                    'review_date'  => '2026-04-10',
                ],
            ],

            // Senior Software Engineer – Maya Iyer
            'EMP-1004' => [
                [
                    'period'       => 'Annual 2025',
                    'rating'       => 4,
                    'strengths'    => 'Deep expertise in distributed systems. Consistently delivers high-quality code with excellent test coverage.',
                    'improvements' => 'Should take more initiative in proposing architectural improvements proactively.',
                    'goals'        => 'Own the API gateway redesign in H1 2026. Complete AWS Solutions Architect certification.',
                    'comments'     => 'Maya is a reliable senior engineer. Ready for a tech lead role with some coaching.',
                    'status'       => 'acknowledged',
                    'review_date'  => '2026-01-20',
                ],
            ],

            // Software Engineer – Arjun Patel
            'EMP-1005' => [
                [
                    'period'       => 'Annual 2025',
                    'rating'       => 3,
                    'strengths'    => 'Good problem-solving skills. Eager to learn and takes feedback well.',
                    'improvements' => 'Code review participation needs improvement. Should write more comprehensive unit tests.',
                    'goals'        => 'Increase code review contributions to at least 5 per sprint. Complete internal backend training program.',
                    'comments'     => 'Arjun is progressing well for his experience level. Needs to be more proactive.',
                    'status'       => 'acknowledged',
                    'review_date'  => '2026-01-22',
                ],
                [
                    'period'       => 'Q1 2026',
                    'rating'       => 4,
                    'strengths'    => 'Significant improvement in code quality and test coverage. Actively participating in code reviews.',
                    'improvements' => 'Communication during blockers can be more timely.',
                    'goals'        => 'Lead a feature end-to-end in Q2. Mentor the new intern.',
                    'comments'     => 'Great improvement from last review. Keep it up.',
                    'status'       => 'submitted',
                    'review_date'  => '2026-04-12',
                ],
            ],

            // DevOps Engineer – Karan Singh
            'EMP-1007' => [
                [
                    'period'       => 'Annual 2025',
                    'rating'       => 5,
                    'strengths'    => 'Reduced deployment time by 60% through CI/CD pipeline improvements. Zero production incidents in Q3 and Q4.',
                    'improvements' => 'Should document runbooks more thoroughly for knowledge transfer.',
                    'goals'        => 'Implement full observability stack (metrics, logs, traces) by Q3 2026. Achieve Kubernetes CKA certification.',
                    'comments'     => 'Karan has been outstanding. His infrastructure work has directly impacted product velocity.',
                    'status'       => 'acknowledged',
                    'review_date'  => '2026-01-18',
                ],
            ],

            // Finance Manager – Vikram Joshi
            'EMP-1009' => [
                [
                    'period'       => 'Annual 2025',
                    'rating'       => 4,
                    'strengths'    => 'Delivered accurate quarterly forecasts within 3% variance. Successfully implemented new expense management system.',
                    'improvements' => 'Board presentation skills could be more polished. Consider executive communication training.',
                    'goals'        => 'Reduce month-end close cycle from 7 to 5 days. Implement automated financial reporting dashboard.',
                    'comments'     => 'Vikram is a strong finance leader. Valuable contributor to strategic planning.',
                    'status'       => 'acknowledged',
                    'review_date'  => '2026-01-25',
                ],
            ],

            // Accountant – Ananya Gupta
            'EMP-1010' => [
                [
                    'period'       => 'Annual 2025',
                    'rating'       => 3,
                    'strengths'    => 'Accurate and detail-oriented. No errors in payroll processing throughout the year.',
                    'improvements' => 'Should improve speed on month-end reconciliations. Excel skills need upgrading to handle larger datasets.',
                    'goals'        => 'Complete advanced Excel and Power BI training by Q2 2026. Reduce reconciliation time by 30%.',
                    'comments'     => 'Ananya is reliable and accurate. Growth in analytical skills will unlock the next level.',
                    'status'       => 'acknowledged',
                    'review_date'  => '2026-01-28',
                ],
            ],

            // Operations Manager – Neha Kapoor
            'EMP-1012' => [
                [
                    'period'       => 'Annual 2025',
                    'rating'       => 5,
                    'strengths'    => 'Streamlined vendor onboarding process, cutting time-to-contract by 40%. Excellent cross-functional collaboration.',
                    'improvements' => 'Delegation to team members could be improved to avoid bottlenecks.',
                    'goals'        => 'Implement SLA tracking for all vendor contracts. Build a succession plan for key operations roles.',
                    'comments'     => 'Neha is an exceptional operations leader. Her process improvements have had measurable business impact.',
                    'status'       => 'acknowledged',
                    'review_date'  => '2026-01-30',
                ],
            ],

            // Marketing Manager – Pooja Malhotra
            'EMP-1014' => [
                [
                    'period'       => 'Annual 2025',
                    'rating'       => 4,
                    'strengths'    => 'Grew organic traffic by 85% YoY. Successfully launched 3 major product campaigns on time and under budget.',
                    'improvements' => 'Data-driven decision making needs strengthening. Should leverage analytics more in campaign planning.',
                    'goals'        => 'Achieve 100K monthly website visitors by Q4 2026. Build a marketing analytics capability within the team.',
                    'comments'     => 'Pooja is a creative and driven marketing leader. Strong results in brand awareness.',
                    'status'       => 'acknowledged',
                    'review_date'  => '2026-02-01',
                ],
                [
                    'period'       => 'Q1 2026',
                    'rating'       => 4,
                    'strengths'    => 'Launched the new brand identity successfully. Positive media coverage and social engagement.',
                    'improvements' => 'Lead generation targets were missed by 15%. Need stronger alignment with sales on MQL criteria.',
                    'goals'        => 'Close the sales-marketing alignment gap. Hit Q2 lead generation targets.',
                    'comments'     => 'Good quarter on brand, needs focus on pipeline contribution.',
                    'status'       => 'draft',
                    'review_date'  => '2026-04-15',
                ],
            ],

            // Sales Manager – Amit Tiwari
            'EMP-1017' => [
                [
                    'period'       => 'Annual 2025',
                    'rating'       => 5,
                    'strengths'    => 'Exceeded annual revenue target by 22%. Built and scaled the enterprise sales team from 2 to 6 reps.',
                    'improvements' => 'CRM hygiene and pipeline forecasting accuracy need attention.',
                    'goals'        => 'Hit ₹5Cr ARR target for 2026. Implement structured sales methodology (MEDDIC) across the team.',
                    'comments'     => 'Amit is a top performer and a natural sales leader. Critical to our growth trajectory.',
                    'status'       => 'acknowledged',
                    'review_date'  => '2026-02-05',
                ],
            ],

            // HR Executive – Priya Nair
            'EMP-1002' => [
                [
                    'period'       => 'Annual 2025',
                    'rating'       => 4,
                    'strengths'    => 'Managed end-to-end recruitment for 15 positions with a 90% offer acceptance rate. Strong employee engagement initiatives.',
                    'improvements' => 'Should develop deeper knowledge of employment law and compliance requirements.',
                    'goals'        => 'Complete SHRM-CP certification by Q3 2026. Implement structured onboarding program.',
                    'comments'     => 'Priya is a valuable HR team member. Ready to take on more strategic responsibilities.',
                    'status'       => 'acknowledged',
                    'review_date'  => '2026-02-08',
                ],
            ],
        ];

        foreach ($reviews as $empCode => $empReviews) {
            $employeeId = $employees[$empCode] ?? null;

            if (! $employeeId) {
                continue;
            }

            foreach ($empReviews as $review) {
                PerformanceReview::query()->updateOrCreate(
                    [
                        'employee_id' => $employeeId,
                        'period'      => $review['period'],
                    ],
                    array_merge($review, [
                        'employee_id' => $employeeId,
                        'reviewer_id' => $reviewer->id,
                    ])
                );
            }
        }
    }
}
