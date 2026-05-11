<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AgeGroup extends Model
{
    protected $fillable = [
        'name'
    ];

    public function olympiads()
    {
        return $this->hasMany(Olympiad::class);
    }
}
