<?php

namespace App\Http\Resources\Institution;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InstitutionMembersResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return
        [
            'user_id' => $this->id,
            'fullname' => $this->fullname,
            'email' => $this->email,
            'role' => $this->pivot->role,
            'joined_at' => $this->pivot->joined_at,
        ];
    }
}
