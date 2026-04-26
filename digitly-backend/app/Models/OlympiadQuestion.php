<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OlympiadQuestion extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'olympiad_id',
        'question_id',
        'sort_order',
        'added_at',
    ];

    protected $casts = [
        'added_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function olympiad()
    {
        return $this->belongsTo(Olympiad::class);
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
