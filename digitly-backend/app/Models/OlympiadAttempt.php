<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class OlympiadAttempt extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'participation_id',
        'olympiad_id',
        'started_at',
        'submitted_at',
        'must_complete_by',
        'total_score',
        'max_score',
        'percent_score',
        'place',
        'status',
        'results_published_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'must_complete_by' => 'datetime',
        'submitted_at' => 'datetime',
        'results_published_at' => 'datetime',
        'total_score' => 'decimal:2',
        'max_score' => 'decimal:2',
        'percent_score' => 'decimal:2',
    ];

    public function participation()
    {
        return $this->belongsTo(Participation::class);
    }

    public function olympiad()
    {
        return $this->belongsTo(Olympiad::class);
    }

    public function responses()
    {
        return $this->hasMany(AttemptResponse::class);
    }
    public function canAnswer(): bool
    {
        if ($this->status !== 'in_progress') {
            return false;
        }

        if ($this->must_complete_by && now()->gt($this->must_complete_by)) {
            return false;
        }

        return true;
    }
    public function calculateAllScores(): void
    {
        
        foreach ($this->responses as $response) {
            if ($response->score === null) {
                $score = $response->calculateScore();
                $response->update(['score' => $score]);
            }
        }
        
        $this->recalculateTotalScore();
    }

    /**
     * Пересчитать общий балл
     */
    public function recalculateTotalScore(): void
    {
        $totalScore = (float) $this->responses()->sum('score');
        $maxScore = $this->olympiad->countTotalScore();
        $percent_score =  $totalScore / $maxScore * 100;
        
        $this->update([
            'total_score' => round($totalScore, 2),
            'max_score' => round($maxScore, 2),
            'percent_score' => round($percent_score, 2),
        ]);
    }

    /**
     * Определить место
     */
    public function determinePlace(): void
    {
        $bracket = $this->olympiad->scoreBrackets()
            ->where('min_percent', '<=', $this->percent_score)
            ->where('max_percent', '>=', $this->percent_score)
            ->first();
        
        $place = $bracket?->place ?? 'participant';
        
        Log::info('determinePlace', [
            'attempt_id' => $this->id,
            'percent_score' => $this->percent_score,
            'place' => $place
        ]);
        
        $this->update(['place' => $place]);
    }   
    
}
