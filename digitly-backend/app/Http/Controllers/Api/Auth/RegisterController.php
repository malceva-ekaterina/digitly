<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Jobs\SendEmailVerificationNotification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class RegisterController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $request->validated();

        $user = User::create([
            'fullname' => $request->fullname,
            'password' => Hash::make($request->password),
            'email' => $request->email,
        ]);

        SendEmailVerificationNotification::dispatch($user);

        return response()->json(['message'=> 'User created successfully','user' => $user], 201);

    }
}
