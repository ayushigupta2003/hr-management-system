<?php

namespace App\Enums\Concerns;

trait HasEnumValues
{
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
