<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
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
            'user_id' => $this->user_id,
            'currency' => $this->currency,
            'items' => CartItemResource::collection($this->whenLoaded('items')),
            'items_count' => $this->when(
                $this->relationLoaded('items'),
                fn() => $this->items->count()
            ),
            'total_minor' => $this->getTotalMinor(),
        ];
    }
}
