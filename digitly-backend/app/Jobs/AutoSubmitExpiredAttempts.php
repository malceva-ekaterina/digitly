<?php

namespace App\Jobs;

use App\Models\OlympiadAttempt;
use App\Services\AttemptService;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class AutoSubmitExpiredAttempts
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
        $now = Carbon::now();


        // Ищем незавершенные попытки, у которых истек дедлайн
        $attempts = OlympiadAttempt::where('status', 'in_progress')
            ->whereNotNull('must_complete_by')
            ->where('must_complete_by', '<', $now)
            ->get();

            foreach ($attempts as $attempt) 
            {
                $attemptService->completeAttempt($attempt);
            }
    }
    
}
