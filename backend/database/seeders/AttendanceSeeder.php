<?php

namespace Database\Seeders;

use App\Enums\AttendanceStatus;
use App\Models\Attendance;
use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    /**
     * Per-employee behavior profiles.
     * Weights: present | late | absent | leave  (must sum to 100)
     */
    private const PROFILES = [
        'star'           => [82, 8,  5,  5],
        'regular'        => [72, 12, 8,  8],
        'late_bird'      => [55, 32, 7,  6],
        'frequent_leave' => [62, 6,  8,  24],
        'unreliable'     => [50, 18, 22, 10],
    ];

    /** Public holidays to skip (MM-DD) */
    private const HOLIDAYS = [
        '01-26', '03-25', '04-14', '04-18',
        '05-01', '08-15', '10-02', '10-24',
        '11-01', '12-25',
    ];

    public function run(): void
    {
        $employees = Employee::where('status', 'active')->get();

        if ($employees->isEmpty()) {
            $this->command->warn('No active employees found.');
            return;
        }

        // Assign profiles round-robin
        $profileKeys = array_keys(self::PROFILES);
        $employeeProfiles = $employees->mapWithKeys(
            fn ($emp, $i) => [$emp->id => $profileKeys[$i % count($profileKeys)]]
        );

        // 90 days ending yesterday (today is Sunday — last working day was Saturday)
        $endDate   = Carbon::yesterday();
        $startDate = $endDate->copy()->subDays(89);

        $records = [];

        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
            if ($date->isWeekend() || $this->isHoliday($date)) {
                continue;
            }

            foreach ($employees as $emp) {
                $profile = $employeeProfiles[$emp->id];
                $status  = $this->pickStatus($profile);

                [$checkIn, $checkOut] = $this->timesForStatus($status, $profile);

                $records[] = [
                    'employee_id'     => $emp->id,
                    'attendance_date' => $date->toDateString(),
                    'check_in'        => $checkIn,
                    'check_out'       => $checkOut,
                    'status'          => $status->value,
                    'remarks'         => $this->remark($status),
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ];
            }
        }

        // Clear old data and insert fresh
        Attendance::query()->truncate();

        foreach (array_chunk($records, 300) as $chunk) {
            Attendance::query()->insert($chunk);
        }

        // Summary
        $byStatus = collect($records)->groupBy('status')->map->count();
        $this->command->info('');
        $this->command->info('✓ Attendance seeded successfully');
        $this->command->table(
            ['Metric', 'Value'],
            [
                ['Total records',   count($records)],
                ['Date range',      $startDate->toDateString().' → '.$endDate->toDateString()],
                ['Active employees', $employees->count()],
                ['Present',         $byStatus['present'] ?? 0],
                ['Late',            $byStatus['late']    ?? 0],
                ['Absent',          $byStatus['absent']  ?? 0],
                ['Leave',           $byStatus['leave']   ?? 0],
            ]
        );
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private function isHoliday(Carbon $date): bool
    {
        return in_array($date->format('m-d'), self::HOLIDAYS, true);
    }

    private function pickStatus(string $profile): AttendanceStatus
    {
        [$p, $l, $a, $lv] = self::PROFILES[$profile];
        $rand = rand(1, 100);

        if ($rand <= $p)           return AttendanceStatus::Present;
        if ($rand <= $p + $l)      return AttendanceStatus::Late;
        if ($rand <= $p + $l + $a) return AttendanceStatus::Absent;
        return AttendanceStatus::Leave;
    }

    private function timesForStatus(AttendanceStatus $status, string $profile): array
    {
        return match ($status) {
            AttendanceStatus::Present => [
                $this->time('08:45', '09:20'),
                $this->time('17:15', '18:45'),
            ],
            AttendanceStatus::Late => match ($profile) {
                'late_bird' => [
                    $this->time('10:30', '12:30'),
                    $this->time('19:00', '21:00'),
                ],
                default => [
                    $this->time('09:45', '11:15'),
                    $this->time('18:00', '19:30'),
                ],
            },
            default => [null, null],
        };
    }

    /** Returns a random time string "HH:MM:SS" between two "HH:MM" bounds */
    private function time(string $from, string $to): string
    {
        [$fh, $fm] = explode(':', $from);
        [$th, $tm] = explode(':', $to);
        $min = rand((int)$fh * 60 + (int)$fm, (int)$th * 60 + (int)$tm);
        return sprintf('%02d:%02d:00', intdiv($min, 60), $min % 60);
    }

    private function remark(AttendanceStatus $status): ?string
    {
        return match ($status) {
            AttendanceStatus::Present => collect([
                null, null, null, null, 'WFH', 'Client visit', 'Remote',
            ])->random(),
            AttendanceStatus::Late => collect([
                'Traffic delay', 'Public transport issue', 'Doctor appointment',
                'Personal errand', 'Power outage', null, null,
            ])->random(),
            AttendanceStatus::Absent => collect([
                'Sick leave', 'Personal emergency', 'Medical appointment',
                'Family emergency', 'Fever', 'Migraine', null,
            ])->random(),
            AttendanceStatus::Leave => collect([
                'Annual leave', 'Casual leave', 'Medical leave',
                'Family function', 'Wedding', 'Bereavement leave', null,
            ])->random(),
        };
    }
}
