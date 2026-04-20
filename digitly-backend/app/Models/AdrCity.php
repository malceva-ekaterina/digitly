<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdrCity extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'fullname',
        'adr_region_id',
    ];

    public function addresses()
    {
        return $this->hasMany(AdrAddress::class);
    }

    public function region()
    {
        $this->belongsTo(AdrRegion::class);
    }
}
