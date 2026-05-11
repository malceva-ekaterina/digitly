<?php

namespace App\Http\Requests\Question;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreQuestionRequest extends FormRequest
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
            'prompt' => ['required'],
            'type' => ['required', 'in:single_choice,multiple_choice,true_false,matching,short_answer,numeric,fill_blanks,ordering,essay'],
            'weight' => ['required', 'decimal:2', 'min:1'],
            'metadata' => ['required', 'array'],
            // 'metadata.correct' => ['']
        ];
    }
}
