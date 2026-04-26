<?php

namespace App\Notifications;

use App\Models\Institution;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InstitutionRejected extends Notification implements ShouldQueue
{
    use Queueable;

    protected $institution;
    /**
     * Create a new notification instance.
     */
    public function __construct(Institution $institution)
    {
        $this->institution = $institution;
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
            ->subject("Заявка на регистрацию {$this->institution->fullname} отклонена")
            ->line("Здравствуйте, {$notifiable->fullname}!")
            ->line("Ваша заявка на регистрацию организации {$this->institution->fullname} была отклонена.")
            ->line("Причина отказа: {$this->institution->moderation_comment}");

    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Заведение отклонена',
            'message' => 'Ваша заявка не прошла модерацию.',
        ];
    }
}
