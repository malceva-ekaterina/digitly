<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class LoginTest extends TestCase
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

    public function test_login_user_successfully()
    {
        User::factory()->create([
            'email' => 'elena@example.com',
            'password' => '123456qwe',
        ]);

        $response = $this->postJson('api/v1/auth/login', [
            'email' => 'elena@example.com',
            'password' => '123456qwe',
        ]);

        $response->assertStatus(200);
    }

    public function test_login_user_with_invalid_password()
    {
        User::factory()->create([
            'email' => 'elena@example.com',
            'password' => '123456qwe',
        ]);

        $response = $this->postJson('api/v1/auth/login', [
            'email' => 'elena@example.com',
            'password' => '123456qe',
        ]);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Invalid email or password.']);
    }

    public function test_login_user_with_unverified_email()
    {
        User::factory()->create([
            'email' => 'elena@example.com',
            'password' => '123456qwe',
            'email_verified_at' => null
        ]);

        $response = $this->postJson('api/v1/auth/login', [
            'email' => 'elena@example.com',
            'password' => '123456qwe',
        ]);

        $response->assertStatus(403);
    }
}
