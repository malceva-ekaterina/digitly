<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Orchid\Screen\AsSource;

class Question extends Model
{
    use AsSource;
    protected $fillable = [
        'institution_id',
        'created_by',
        'prompt',
        'type',
        'metadata',
        'weight',
        'random_options',
    ];

    protected $casts = [
        'metadata' => 'array',
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
        return $this->belongsToMany(Olympiad::class, 'olympiad_questions');
    }

    public function isAutoScorable(): bool
    {
        return !in_array($this->type, ['essay']);
    }
}
