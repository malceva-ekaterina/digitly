<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OlympiadScoreBracket extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'olympiad_id',
        'min_percent',
        'max_percent',
        'place',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function olympiad()
    {
        return $this->belongsTo(Olympiad::class);
    }
}
