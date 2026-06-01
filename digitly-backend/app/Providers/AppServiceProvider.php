<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
            return (new MailMessage)
                ->subject('Подтвердите ваш Email')
                ->greeting('Здравствуйте!')
                ->line('Пожалуйста, нажмите кнопку ниже, чтобы подтвердить свой адрес электронной почты.')
                ->action('Подтвердить Email', $url)
                ->line('Если вы не создавали аккаунт, игнорируйте это письмо.');
        });
        ResetPassword::createUrlUsing(function (User $user, string $token) {
            return config('app.frontend_url') . '/password/reset?' . http_build_query([
                'token' => $token,
                'email' => $user->email,
            ]);
        });

        Relation::morphMap([
            'olympiad' => \App\Models\Olympiad::class,
            'kiosk_item'  => \App\Models\KioskItem::class,
            'question_bank'  => \App\Models\Question::class,
        ]);
    }
}
