<?php

namespace App\Enums;

use App\Enums\Concerns\HasEnumValues;

enum AttendanceStatus: string
{
    use HasEnumValues;

    case Present = 'present';
    case Absent  = 'absent';
    case Late    = 'late';
    case Leave   = 'leave';
}
