<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Models\User;
use App\Notifications\MailResetPasswordNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class ResetPasswordController extends Controller
{
    public function forgot(Request $request)
    {
        $request->validate([
            'email' => ['required', 'exists:users,email']
        ]);

        $user = User::where('email', $request->email)->first();

        $token = Password::broker()->createToken($user);
        $user->notify(new MailResetPasswordNotification($token));

        return response()->json(['message' => 'Link send in your email']);
    }

    public function reset(ResetPasswordRequest $request)
    {

        $user = User::where('email', $request->email)->first();
        $token = $request->token;

        if (!Password::broker()->tokenExists($user, $token))
        {
            return response()->json(['message' => '']);
        }

        $newPassword = $request->password;
        $user->password = Hash::make($newPassword);
        $user->save();

        $user->tokens()->delete();
        Password::broker()->deleteToken($user);

        return response()->json([
            'success' => true,
            'message' => 'Пароль успешно изменен',
            'data' => [
                'user' => $user
            ]
        ]);
    }
}
