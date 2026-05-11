<?php

use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\ResetPasswordController;
use App\Http\Controllers\Api\Auth\VerifyEmailController;
use App\Http\Controllers\Api\InstitutionController;
use App\Http\Controllers\Api\OlympiadController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\QuestionController;
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
        Route::get('institutions', [ProfileController::class, 'getInstitutions']);
    });

    Route::prefix('institutions')->middleware(['auth:sanctum', 'verified'])->group(function() {
        Route::post('apply', [InstitutionController::class, 'apply']);
        Route::get('my', [InstitutionController::class, 'my']);
        Route::get('check-inn', [InstitutionController::class, 'checkInn'])->middleware('throttle:10,60');
        Route::post('join-request', [InstitutionController::class, 'joinRequest']);
        Route::get('{id}/status', [InstitutionController::class, 'checkStatus']);
        Route::get('institutions/{id}/members', [InstitutionController::class, 'getMembers']);
        Route::get('{id}/members', [InstitutionController::class, 'getMembers']);
        Route::post('{id}/members', [InstitutionController::class, 'addMember']);
        Route::delete('{id}/members/{userId}', [InstitutionController::class, 'deleteMember']);
        Route::put('{id}/members/{userId}', [InstitutionController::class, 'updateMember']);
        Route::get('{id}/dashboard', [InstitutionController::class, 'index']);

        // олимпиады
        Route::post('{id}/olympiads', [OlympiadController::class, 'store']);
        Route::get('{id}/olympiads', [OlympiadController::class, 'getInstitutionOlympiads']);

        // вопросы
        Route::get('{id}/questions', [QuestionController::class, 'getInstitutionQuestions']);
        Route::post('{id}/questions', [QuestionController::class, 'store']);
    });
    Route::prefix('olympiads')->group(function() {
        Route::get('{id}', [OlympiadController::class, 'show']);
        Route::put('{id}', [OlympiadController::class, 'update']);
        Route::put('{id}/schedule', [OlympiadController::class, 'updateSchedule']);

        Route::post('{id}/submit-for-moderation', [OlympiadController::class, 'submitForModeration']);

        Route::post('{id}/questions', [QuestionController::class, 'addQuestionToOlympiad']);
        Route::delete('{id}/questions/{questionId}', [QuestionController::class, 'destroy']);
        Route::put('{id}/questions/{questionId}', [QuestionController::class, 'update']);
    });

    Route::prefix('questions')->group(function() {

    });

});
