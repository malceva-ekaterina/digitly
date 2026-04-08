<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class ResetPasswordTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;

    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_reset_password_link_get()
    {
        $user = User::factory()->create(['email' => 'test@example.com']);

        $response = $this->postJson('/api/v1/auth/password/forgot', [
            'email' => 'test@example.com'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('password_reset_tokens', [
            'email' => 'test@example.com'
        ]);

    }

    public function test_can_reset_password_with_valid_token()
    {
        $user = User::factory()->create(['email' => 'test@example.com']);

        $token = Password::broker()->createToken($user);

        $response = $this->postJson('/api/v1/auth/password/reset', [
            'token' => $token,
            'email' => 'test@example.com',
            'password' => 'new-password-123',
            'password_confirmation' => 'new-password-123',
        ]);

        $response->assertStatus(200);

        // Проверяем, что пароль изменился (проверка хэша)
        $this->assertTrue(Hash::check('new-password-123', $user->fresh()->password));
    }

    public function test_can_reset_password_with_unvalid_token()
    {
        $user = User::factory()->create(['email' => 'test@example.com']);

        $token = Password::broker()->createToken($user);

        $response = $this->postJson('/api/v1/auth/password/reset', [
            'token' => $token,
            'email' => 'test@example.com',
            'password' => 'new-password-123',
            'password_confirmation' => 'new-password-123',
        ]);

        $response->assertStatus(200);

        // Проверяем, что пароль изменился (проверка хэша)
        $this->assertTrue(Hash::check('new-password-123', $user->fresh()->password));
    }
}
