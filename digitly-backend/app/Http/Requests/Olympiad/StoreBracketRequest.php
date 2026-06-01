<?php

namespace App\Http\Requests\Olympiad;

use App\Models\Olympiad;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Validator;

class StoreBracketRequest extends FormRequest
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
            'min_percent' => ['required', 'integer', 'min:0', 'max:100'],
            'max_percent' => ['required', 'integer', 'min:0', 'max:100'],
            'place_text' => ['required', 'string'],
            'award_document_type' => ['required', 'in:diploma,certificate,none']
        ];
    }
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $olympiadId = $this->route('id');
            $min = (float) $this->input('min_percent');
            $max = (float) $this->input('max_percent');

            if ($min >= $max) {
                $validator->errors()->add('min_percent', 'min_percent должен быть меньше max_percent');
            }
            $olympiad = Olympiad::find($olympiadId);
            $existingBrackets = $olympiad->scoreBrackets()
                ->where(function($query) use ($min, $max) {
                    $query->whereBetween('min_percent', [$min, $max])
                          ->orWhereBetween('max_percent', [$min, $max])
                          ->orWhere(function($q) use ($min, $max) {
                              $q->where('min_percent', '<=', $min)
                                ->where('max_percent', '>=', $max);
                          });
                })
                ->exists();

            if ($existingBrackets) {
                $validator->errors()->add('brackets', 'Диапазон пересекается с существующими скобками');
            }
        });
    }
}
