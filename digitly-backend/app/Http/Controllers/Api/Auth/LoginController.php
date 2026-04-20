<?php

namespace App\Http\Controllers\Api\Auth;

use App\Events\LoginSuccessful;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        if (!Auth::attempt($credentials))
        {
            return response()->json([
                'message' => 'Invalid email or password.'
            ], 401);
        }

        $user = Auth::user();

        if (!$user->hasVerifiedEmail())
        {
            Auth::logout();
            return  response()->json(['message' => 'Users email is not verified'], 403);

        }

        event(new LoginSuccessful($user, $request));

        $token = $user ->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);

    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json(['user' => $request->user()]);

    }
}
