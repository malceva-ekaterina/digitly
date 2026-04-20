<?php

namespace App\Http\Resources\Profile;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
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
            'fullname' => $this->fullname,
            'email' => $this->email,
            'birth_date' => $this->birth_date?->format('Y-m-d'),
            'study_place' => $this->study_place,
            'study_grade' => $this->study_grade,
            'avatar_url' => $this->avatar?->url ?? null,
        ];
    }
}
