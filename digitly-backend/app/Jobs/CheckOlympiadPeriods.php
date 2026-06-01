<?php

namespace App\Jobs;

use App\Models\Olympiad;
use App\Notifications\AutoAttemptCompletion;
use App\Services\AttemptService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class CheckOlympiadPeriods implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(AttemptService $attemptService): void
    {
        $olympiads = Olympiad::where('type', 'scheduled')
            ->where('participation_end_at', '<', now())
            ->get();
        
        foreach ($olympiads as $olympiad) {
            // Завершаем все in_progress попытки
            $attempts = $olympiad->attempts()
                ->where('status', 'in_progress')
                ->get();
            
            foreach ($attempts as $attempt) {
                $attemptService->completeAttempt($attempt);
                $user = $attempt->participation->accessGrant->recipientUser; 
                
                $user->notify(new AutoAttemptCompletion($attempt));  
            }
    }   
    }
}