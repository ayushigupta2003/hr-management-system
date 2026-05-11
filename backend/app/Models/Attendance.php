<?php

namespace App\Models;

use App\Enums\AttendanceStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'attendance_date',
        'check_in',
        'check_out',
        'status',
        'remarks',
    ];

    protected $casts = [
        'attendance_date' => 'date',
        'status'          => AttendanceStatus::class,
    ];

    /**
     * check_in / check_out are stored as TIME (H:i:s) strings.
     * We return them as plain strings — no datetime cast needed.
     */
    public function getCheckInAttribute(?string $value): ?string
    {
        return $value ? substr($value, 0, 5) : null; // "09:15"
    }

    public function getCheckOutAttribute(?string $value): ?string
    {
        return $value ? substr($value, 0, 5) : null; // "17:45"
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
