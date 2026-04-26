<?php

namespace App\Http\Resources\Institution;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InstitutionResource extends JsonResource
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
            'full_name' => $this->fullname,
            'short_name' => $this->shortname,
            'inn' => $this->inn,
            'status' => $this->stutus, // ваша опечатка из базы
            'role' => $this->whenPivotLoaded('user_institutions', function () {
                return $this->pivot->role;
            }),
        ];
    }
}
