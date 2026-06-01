<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        
        return [
            'id' => $this->id,
            'product_type' => $this->product_type,
            'product_id' => $this->product_id,
            'version_id' => $this->version_id,
            'title' => $this->product_name ?? "Null",
            'unit_price_minor' => $this->unit_price_minor,
        ];
    }
}
