<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdrRegion extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'fullname',
    ];

    public function cities()
    {
        return $this->hasMany(AdrCity::class);
    }

    public function county()
    {
        return $this->belongsTo(AdrCountry::class);
    }
}
