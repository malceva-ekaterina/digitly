<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OlympiadCategory extends Model
{
    protected $fillable = [
        'name',
        'description',
        'parent_id',
    ];
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function olympiads()
    {
        return $this->belongsToMany(Olympiad::class, 'olympiad_olympiad_category');
    }

}
