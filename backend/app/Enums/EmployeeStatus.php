<?php

namespace App\Enums;

use App\Enums\Concerns\HasEnumValues;

enum EmployeeStatus: string
{
    use HasEnumValues;

    case Active   = 'active';
    case Inactive = 'inactive';
}
