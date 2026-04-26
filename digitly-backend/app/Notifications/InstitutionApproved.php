<?php

namespace App\Notifications;

use App\Models\Institution;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InstitutionApproved extends Notification implements ShouldQueue
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
            ->subject('Статус вашего заведения обновлен')
            ->line("Здравствуйте, {$notifiable->fullname}!")
            ->line("Ваша организация \"{$this->institution->fullname}\" успешно прошла модерацию.");
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Заведение одобрено',
            'message' => 'Ваша заявка прошла модерацию.',
        ];
    }
}
