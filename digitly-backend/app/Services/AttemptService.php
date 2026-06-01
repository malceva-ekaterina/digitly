<?php

namespace App\Services;

use App\Models\OlympiadAttempt;

class AttemptService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function completeAttempt(OlympiadAttempt $attempt)
    {
        if ($attempt->status !== 'in_progress') {
            throw new \Exception('Попытка уже завершена');
        }
        
        $attempt->calculateAllScores();
        $attempt->determinePlace();
        
        $attempt->update([
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);
        
        if ($attempt->participation) {
            $attempt->participation->update([
                'status' => 'completed',
                'ended_at' => now(),
            ]);
        }
        $percent_score =  $attempt->total_score / $attempt->max_score * 100;

        return [
            'earned_score' => $attempt->total_score,
            'total_score' => $attempt->max_score,
            'percent_score' => $attempt->percent_score,
            'place_text' => $attempt->place,
        ];
    }
}
