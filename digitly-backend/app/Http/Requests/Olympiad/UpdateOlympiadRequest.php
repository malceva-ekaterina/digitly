<?php

namespace App\Http\Requests\Olympiad;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateOlympiadRequest extends FormRequest
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
            'title' => ['sometimes', 'max:255'],
            'description' => ['sometimes', 'max:5000'],
            'type' => ['sometimes', 'in:permanent,scheduled'],
            'price_minor' => ['sometimes', 'min:0'],
            // 'subject' => ['sometimes', 'exists:olympiad_categories,id'],
            // 'age_group' => ['sometimes', 'exists:age_groups,id'],
        ];
    }
}
