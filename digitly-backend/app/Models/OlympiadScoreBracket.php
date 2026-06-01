<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;

class OlympiadScoreBracket extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'olympiad_id',
        'min_percent',
        'max_percent',
        'place',
        'award_document_type',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function olympiad()
    {
        return $this->belongsTo(Olympiad::class);
    }

    public static function validateBrackets(int $olympiadId, array $brackets): void
    {
        if (empty($brackets)) {
            throw ValidationException::withMessages([
                'brackets' => 'Необходимо добавить хотя бы одну процентную скобку',
            ]);
        }

        // Сортируем по min_percent
        usort($brackets, fn($a, $b) => $a['min_percent'] <=> $b['min_percent']);

        $previousMax = null;
        $covered = 0;

        foreach ($brackets as $index => $bracket) {
            $min = (float) $bracket['min_percent'];
            $max = (float) $bracket['max_percent'];

            // Проверка min < max
            if ($min >= $max) {
                throw ValidationException::withMessages([
                    "brackets.{$index}.min_percent" => "min_percent должен быть меньше max_percent",
                ]);
            }

            // Проверка границ 0-100
            if ($min < 0 || $min > 100) {
                throw ValidationException::withMessages([
                    "brackets.{$index}.min_percent" => "min_percent должен быть в диапазоне 0-100",
                ]);
            }

            if ($max < 0 || $max > 100) {
                throw ValidationException::withMessages([
                    "brackets.{$index}.max_percent" => "max_percent должен быть в диапазоне 0-100",
                ]);
            }

            // Проверка на пересечение
            if ($previousMax !== null && $min > $previousMax) {
                throw ValidationException::withMessages([
                    "brackets" => "Процентные диапазоны не должны иметь пропусков. Между " .
                        number_format($previousMax, 2) . "% и " . number_format($min, 2) . "% есть разрыв",
                ]);
            }

            if ($previousMax !== null && $min < $previousMax) {
                throw ValidationException::withMessages([
                    "brackets.{$index}.min_percent" => "Диапазоны не должны пересекаться",
                ]);
            }

            $previousMax = $max;
            $covered = $max;
        }

        // Проверка покрытия до 100%
        if ($covered < 100) {
            throw ValidationException::withMessages([
                'brackets' => "Процентные диапазоны должны покрывать до 100%. Последний max_percent = {$covered}%",
            ]);
        }

        // Проверка начала с 0
        $firstMin = (float) $brackets[0]['min_percent'];
        if ($firstMin > 0) {
            throw ValidationException::withMessages([
                'brackets.0.min_percent' => "Первый диапазон должен начинаться с 0%",
            ]);
        }
    }
}
