<?php

namespace App\Notifications;

use App\Models\Institution;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Orchid\Platform\Notifications\DashboardChannel;
use Orchid\Platform\Notifications\DashboardMessage;

class NewInstitution extends Notification implements ShouldQueue
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
        return ['mail', DashboardChannel::class];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Новая заявка на вступление')
            ->line("{$this->institution->fullname} подала заявку на регистрацию");
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toDashboard($notifiable)
    {
        return (new DashboardMessage)
            ->title('Новая заявка')
            ->message("{$this->institution->fullname} подала заявку на регистрацию");
    }
    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Ваша заявка не прошла модерацию.',

        ];
    }
}
