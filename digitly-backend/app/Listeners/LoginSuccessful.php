<?php

namespace App\Listeners;

use App\Events\LoginSuccessful as EventsLoginSuccessful;
use App\Models\UserLoginHistory;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Jenssegers\Agent\Agent;

class LoginSuccessful
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {

    }

    /**
     * Handle the event.
     */
    public function handle(EventsLoginSuccessful $event): void
    {
        $agent = new Agent();
        UserLoginHistory::create([
            'user_id'     => $event->user->id,
            'ip_address'  => request()->ip(),
            'user_agent'  => request()->userAgent(),
            'device_type' => $this->getDeviceType($agent),
            'logged_in_at' => now(),
        ]);
    }

    private function getDeviceType(Agent $agent): string
    {
        if ($agent->isTablet()) return 'tablet';
        if ($agent->isMobile()) return 'mobile';
        return 'desktop';
    }
}
