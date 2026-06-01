<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Participation extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'olympiad_id',
        'access_grant_id',
        'role',
        'status',
        'participant_fullname',
        'participant_institution',
        'participant_grade',
        'started_at',
        'ended_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function olympiad()
    {
        return $this->belongsTo(Olympiad::class);
    }

    public function accessGrant()
    {
        return $this->belongsTo(AccessGrant::class);
    }

    public function attempt()
    {
        return $this->hasOne(OlympiadAttempt::class);
    }

    #[Scope]
    protected function hasAttempt(Builder $query, $olympiad_id, $access_grant_id)
    {
        $query->where('olympiad_id', $olympiad_id)->where('access_grant_id', $access_grant_id)->where('status', 'registered')->first();
    }
}
