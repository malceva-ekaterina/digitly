<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Jobs\SendEmailVerificationNotification;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $request->validated();

        $user = User::create([
            'fullname' => $request->fullname,
            'password' => Hash::make($request->password),
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'accepted_terms_at' => now(),
            'accepted_privacy_at' => now()
        ]);

        SendEmailVerificationNotification::dispatch($user);

        return response()->json(['message'=> 'User created successfully','user' => $user], 201);

    }
}
