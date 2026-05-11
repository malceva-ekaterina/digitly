<?php

namespace App\Http\Requests\Olympiad;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateScheduleOlympiadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'registration_start_at' => ['date'],
            'registration_end_at' => ['date', 'after:registration_start_at'],
            'participation_start_at' => ['date', 'after:participation_start_at'],
            'participation_end_at' => ['date', 'after:participation_start_at'],
            // 'review_start_at' => ['date', 'after:participation_end_at '],
            // 'review_end_at' => ['date', 'after:review_start_at'],
        ];
    }
}
