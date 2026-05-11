<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OlympiadResource extends JsonResource
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
            'title' => $this->title,
            'description' => $this->description,
            'type' => $this->type,
            'price_minor' => $this->price_minor,
            'currency' => $this->currency,
            'time_limit_minutes' => $this->time_limit_minutes,
            'registration_start_at' => $this->registration_start_at,
            'registration_end_at' => $this->registration_end_at,
            'participation_start_at' => $this->participation_start_at,
            'participation_end_at' => $this->participation_end_at,
            'status' => $this->status,
        ];
    }
}
