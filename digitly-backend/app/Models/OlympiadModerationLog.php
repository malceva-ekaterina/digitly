<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OlympiadModerationLog extends Model
{
    public $table = 'olympiad_moderation_log';
    protected $fillable = [
        'olympiad_id',
        'moderator_id',
        'action',
        'comment',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function olympiads()
    {
        return $this->belongsTo(Olympiad::class);
    }

     public function moderator()
    {
        return $this->belongsTo(User::class, 'moderator_id');
    }
}
