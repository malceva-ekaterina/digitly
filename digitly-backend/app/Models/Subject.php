<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = [
        'name'
    ];

    protected $casts = [
        'created_at',
        'updated_at',
    ];

    public function olympiads()
    {
        return $this->hasMany(Olympiad::class);
    }
}
