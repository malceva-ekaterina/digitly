<?php

namespace App\Notifications;

use App\Models\OlympiadAttempt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AutoAttemptCompletion extends Notification implements ShouldQueue
{
    use Queueable;
    protected $attempt;
    /**
     * Create a new notification instance.
     */
    public function __construct(OlympiadAttempt $attempt)
    {
        $this->attempt = $attempt;
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
            ->line('Олимпиада была завершена')
            ->line("Олимпиада {$this->attempt->olympiad->title} была завершена")
            ->line('Ваш итоговый балл: ' . $this->attempt->score);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Олимпиада была завершена',
            'message' => "Олимпиада {$this->attempt->olympiad->title} была завершена",
        ];
    }
}
