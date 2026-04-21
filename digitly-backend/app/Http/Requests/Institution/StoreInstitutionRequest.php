<?php

namespace App\Http\Requests\Institution;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreInstitutionRequest extends FormRequest
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
            'fullname' => ['required'],
            'shortname' => ['required'],
            'inn' => ['required', 'between:10,12', 'unique:institutions,inn'],
            'website_url' => ['required', 'url'],
            'application_scan' => ['required', 'file', 'mimes:pdf,jpg,png', 'max:10240'],
        ];
    }
}
