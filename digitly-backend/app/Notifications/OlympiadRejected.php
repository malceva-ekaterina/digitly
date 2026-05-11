<?php

namespace App\Notifications;

use App\Models\Olympiad;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OlympiadRejected extends Notification implements ShouldQueue
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
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Ваша олимпиада отклонена')
            ->line("Олимпиада {$this->olympiad->prompt} отклонена")
            ->line("Причина отказа: {$this->olympiad->moderationLogsReject()->comment}");
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Ваша олимпиада отклонена',
            'message' => "Олимпиада {$this->olympiad->prompt} отклонена, причина отказа: {$this->olympiad->moderationLogsReject()->comment}",
        ];
    }
}
