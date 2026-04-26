<?php

namespace App\Notifications;

use App\Models\Institution;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserAddedToInstitution extends Notification implements ShouldQueue
{
    use Queueable;
    protected $institution;
    protected $role;
    /**
     * Create a new notification instance.
     */
    public function __construct(Institution $institution, $role)
    {
        $this->institution = $institution;
        $this->role = $role;

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
    public function UserRole()
    {
        return $this->role === 'institution_admin' ? 'адмнинистратор' : 'методист';
    }
    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Вы добавлены в ОО {$this->institution->fullname} как {$this->UserRole()}")
            ->greeting("Здравствуйте {$notifiable->fullname}!")
            ->line("Вы добавлены в ОО {$this->institution->fullname} как {$this->UserRole()}");
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => "Вы добавлены в ОО {$this->institution->fullname} как {$this->UserRole()}",
            'message' => "Вы добавлены в ОО {$this->institution->fullname} как {$this->UserRole()}",
        ];
    }
}
