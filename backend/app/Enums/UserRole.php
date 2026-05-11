<?php

namespace App\Enums;

use App\Enums\Concerns\HasEnumValues;

enum UserRole: string
{
    use HasEnumValues;

    case Admin    = 'admin';
    case HR       = 'hr';
    case Employee = 'employee';
}
