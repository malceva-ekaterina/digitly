<?php

namespace Database\Seeders;

use App\Models\AccessGrant;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Orchid\Platform\Models\Role;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        // Role::create([
        //     'slug' => 'admin',
        //     'name' => 'admin'
        // ]);
        // Role::create([
        //     'slug' => 'moderator',
        //     'name' => 'moderator'
        // ]);

        // User::factory()->create([
        //     'fullname' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        /*
         $user = App\Models\User::create([
    'fullname' => 'Admin Name',
    'email'    => 'admin@admin.com',
    'password' => Hash::make('password'), // установите свой пароль
    'permissions' => Orchid\Support\Facades\Dashboard::getAllowAllPermission(),
]);
    } 
*/
    AccessGrant::create([
        'recipient_user_id' => 1,
        'recipient_email' => 'test2@example.com',
        'product_type' => 'olympiad',
        'product_id' => 1,
        'order_item_id' => 1
     ]);
    }
}