<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;
    public function test_register_new_user(): void
    {
        $user = [
            'fullname' => 'Elena Alena',
            'email' => 'elena123@example.com',
            'password' => '123456qwe'
        ];

        $response = $this->postJson('/api/v1/auth/register', $user);

        $response->assertStatus(201)
        ->assertJsonStructure([
                'message',
                'user' => ['id', 'fullname', 'email']
            ]);
    }

    public function test_registration_validates_required_fields()
    {
        $response = $this->postJson('/api/v1/auth/register', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['fullname', 'email', 'password']);
    }

    public function test_registration_validates_unique_email()
    {
        User::factory()->create(['email' => 'alena@example.com']);

        $response = $this->postJson('/api/v1/auth/register', [
            'fullname' => 'Jane Doe',
            'email' => 'alena@example.com',
            'password' => 'Password123'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }
}
