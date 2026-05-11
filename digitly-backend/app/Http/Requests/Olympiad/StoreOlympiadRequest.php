<?php

namespace App\Http\Requests\Olympiad;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreOlympiadRequest extends FormRequest
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
            'title' => ['required', 'max:255'],
            'description' => ['required', 'max:5000'],
            'type' => ['required', 'in:permanent,scheduled'],
            'price_minor' => ['required', 'min:0'],
            // 'subject' => ['required', 'exists:olympiad_categories,id'],
            // 'age_group' => ['required', 'exists:age_groups,id'],
        ];
    }
}
