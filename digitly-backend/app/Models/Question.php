<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'institution_id',
        'created_by',
        'prompt',
        'type',
        'weight',
        'random_options',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function questionBanks()
    {
        return $this->belongsToMany(QuestionBank::class, 'question_question_bank');
    }

    public function olympiads()
    {
        return $this->hasMany(OlympiadQuestion::class);
    }
}
