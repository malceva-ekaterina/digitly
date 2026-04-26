<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Olympiad extends Model
{
    protected $fillable = [
        'institution_id',
        'created_by',
        'title',
        'description',
        'type',
        'price_minor',
        'currency',
        'time_limit_minutes',
        'display_mode',
        'random_questions',
        'tiebreak_rule',
        'show_public_rating',
        'registration_start_at',
        'registration_end_at',
        'participation_start_at',
        'participation_end_at',
        'status',
        'moderated_by',
        'moderated_at',
        'first_purchase_at',
    ];
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'registration_start_at' => 'datetime',
        'registration_end_at' => 'datetime',
        'participation_start_at' => 'datetime',
        'participation_end_at' => 'datetime',
        'moderated_at' => 'datetime',
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function moderator()
    {
        return $this->belongsTo(User::class, 'moderated_by');
    }

    public function categories()
    {
        return $this->belongsToMany(OlympiadCategory::class, 'olympiad_olympiad_category');
    }

    public function moderationLogs()
    {
        return $this->hasMany(OlympiadModerationLog::class);
    }

    public function questions()
    {
        return $this->hasMany(OlympiadQuestion::class);
    }

    public function scoreBrackets()
    {
        return $this->hasMany(OlympiadScoreBracket::class);
    }

}
