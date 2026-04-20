<?php

namespace App\Http\Resources\Profile;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoginHistoryResource extends JsonResource
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
            'ip_address' => $this->ip_address,
            'user_agent' => $this->user_agent,
            'device_type' => $this->device_type,
            'logged_in_at' => $this->logged_in_at->format('Y-m-d H:i:s')
        ];
    }
}
