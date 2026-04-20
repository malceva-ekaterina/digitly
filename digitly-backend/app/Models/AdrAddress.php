<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdrAddress extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'street',
        'building',
        'housing',
        'flat',
        'postal_code',
        'adr_city_id',
    ];

    public function city()
    {
        return $this->belongsTo(AdrCity::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
