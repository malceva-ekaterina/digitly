<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdrCountry extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'fullname',
    ];

    public function regions()
    {
        return $this->hasMany(AdrRegion::class);
    }
}
