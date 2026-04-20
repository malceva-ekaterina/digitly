<?php

use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\ResetPasswordController;
use App\Http\Controllers\Api\Auth\VerifyEmailController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function() {

    Route::prefix('auth')->group(function() {
        Route::post('register', [RegisterController::class, 'register']);
        Route::post('login', [LoginController::class, 'login'])->name('login');

        Route::middleware(['auth:sanctum', 'verified'])->group(function() {
            Route::post('logout', [LoginController::class, 'logout']);
            Route::get('me', [LoginController::class, 'me']);

            });

        Route::post('password/forgot', [ResetPasswordController::class, 'forgot']);
        Route::post('password/reset', [ResetPasswordController::class, 'reset']);

    });

    Route::get('email/verify/{id}/{hash}', [VerifyEmailController::class, 'verify'])
        ->name('verification.verify');

    Route::prefix('profile')->middleware(['auth:sanctum', 'verified'])->group(function(){
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
        Route::post('avatar', [ProfileController::class, 'uploadAvatar']);
        Route::delete('avatar', [ProfileController::class, 'deleteAvatar']);
        Route::get('login-history', [ProfileController::class, 'loginHistory']);
        Route::delete('terminate-all-sessions', [ProfileController::class, 'terminateAllSessions']);
        Route::delete('delete-account', [ProfileController::class, 'delete']);
    });
});
