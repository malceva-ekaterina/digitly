<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CreateTemplateRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'background' => ['required', 'image', 'mimes:jpeg,png,jpg', 'max:10240'],
            'type' => ['required', 'in:diploma,certificate,gratitude_mentor,gratitude_org,protocol'],
            
            // 'fields_config'     => ['required', 'array'],
            // 'fields_config.fullname'       => ['required', 'array'],
            // 'fields_config.place'          => ['required', 'array'],
            // 'fields_config.olympiad' => ['required', 'array'],
            // 'fields_config.date'   => ['required', 'array'],
            // 'fields_config.institution'    => ['required', 'array'],
            // // Пример валидации вложенных полей конфигурации
            // 'fields_config.*.x'     => ['required', 'integer', 'min:0'],
            // 'fields_config.*.y'     => ['required', 'integer', 'min:0'],
            // 'fields_config.*.size'  => ['required', 'integer', 'min:8', 'max:120'],
            // 'fields_config.*.color' => ['nullable', 'string', 'regex:/^#([A-Fa-f0-9]{6})$/'], // HEX формат #000000
        ];
    }
}
