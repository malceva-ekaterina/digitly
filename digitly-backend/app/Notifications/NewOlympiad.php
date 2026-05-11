<?php

namespace App\Notifications;

use App\Models\Olympiad;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Orchid\Platform\Notifications\DashboardChannel;
use Orchid\Platform\Notifications\DashboardMessage;

class NewOlympiad extends Notification implements ShouldQueue
{
    use Queueable;
    protected $olympiad;
    /**
     * Create a new notification instance.
     */
    public function __construct(Olympiad $olympiad)
    {
        $this->olympiad = $olympiad;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', DashboardChannel::class];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Олимпиада поступила на модерацию")
            ->line("Олимпиада {$this->olympiad->title} от организации {$this->olympiad->institution->fullname} поступила на модерацию");
    }

     public function toDashboard($notifiable)
    {
        return (new DashboardMessage())
            ->title("Олимпиада поступила на модерацию")
            ->message("Олимпиада {$this->olympiad->title} от организации {$this->olympiad->institution->fullname} поступила на модерацию");
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
