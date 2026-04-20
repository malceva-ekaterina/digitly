<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
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
            'fullname' => ['required', 'max:150'],
            'password' => ['required', Password::min(8)->letters()->numbers()],
            'email' => ['required', 'email', 'unique:users,email'],
            'accepted_terms_at' => ['required'],
            'accepted_privacy_at' => ['required'],
        ];
    }

    public function messages()
    {
        return [
            'accepted_terms_at.required' => 'Необходимо принять условия',
            'accepted_privacy_at.required' => 'Необходимо принять условия политики конфиденциальности',
        ];
    }
}
