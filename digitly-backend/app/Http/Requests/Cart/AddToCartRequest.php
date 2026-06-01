<?php

namespace App\Http\Requests\Cart;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class AddToCartRequest extends FormRequest
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
        $productType = $this->input('product_type');
        $modelClass = Relation::getMorphedModel($productType);

        return [
            
            'product_type' => ['required', 'string', Rule::in(['olympiad', 'kiosk_item', 'question_bank'])],
            
            // Защита ID: ищет запись именно в той таблице, класс которой скрывается за product_type
            'product_id'   => ['required', 'integer', $modelClass ?  Rule::exists((new $modelClass)->getTable(), 'id'): 'string'],
            
            'version_id'   => ['nullable', 'integer'],
        ];
    }
}
