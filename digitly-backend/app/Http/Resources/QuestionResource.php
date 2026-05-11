<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'created_by' => $this->creator->fullname,
            'prompt' => $this->prompt,
            'type' => $this->type,
            'weight' => $this->weight,
            'random_options' => $this->random_options,
        ];
    }
}
