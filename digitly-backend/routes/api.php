<?php

use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\ResetPasswordController;
use App\Http\Controllers\Api\Auth\VerifyEmailController;
use App\Http\Controllers\Api\AwardDocumentTemplateController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\InstitutionController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\OlympiadController;
use App\Http\Controllers\Api\ParticipationController;
use App\Http\Controllers\Api\PayKeeperCallbackController;
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
    Route::get('user', [LoginController::class, 'me']);


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
        Route::get('institutions/{id}/members', [InstitutionController::class, 'getMembers'])->middleware(['institution.context']);
        Route::get('{id}/members', [InstitutionController::class, 'getMembers'])->middleware(['institution.context']);
        Route::post('{id}/members', [InstitutionController::class, 'addMember'])->middleware(['institution.context']);
        Route::delete('{id}/members/{userId}', [InstitutionController::class, 'deleteMember'])->middleware(['institution.context']);
        Route::put('{id}/members/{userId}', [InstitutionController::class, 'updateMember'])->middleware(['institution.context']);
        Route::get('{id}/dashboard', [InstitutionController::class, 'index'])->middleware(['institution.context']);

        // олимпиады
        Route::post('{id}/olympiads', [OlympiadController::class, 'store'])->middleware(['institution.context']);
        Route::get('{id}/olympiads', [OlympiadController::class, 'getInstitutionOlympiads'])->middleware(['institution.context']);

        // вопросы
        Route::get('{id}/questions', [QuestionController::class, 'getInstitutionQuestions'])->middleware(['institution.context']);
        Route::post('{id}/questions', [QuestionController::class, 'store'])->middleware(['institution.context']);

        Route::post('{id}/document-templates', [AwardDocumentTemplateController::class, 'createTemplates'])->middleware(['institution.context']);
        Route::get('{id}/get', [AwardDocumentTemplateController::class, 'get'])->middleware(['institution.context']);
    });
    Route::prefix('olympiads')->middleware(['auth:sanctum', 'verified'])->group(function() {
        Route::get('{id}', [OlympiadController::class, 'show']);
        Route::put('{id}', [OlympiadController::class, 'update'])->middleware(['olympiad.editable']);
        Route::put('{id}/schedule', [OlympiadController::class, 'updateSchedule'])->middleware(['olympiad.editable']);

        Route::post('{id}/submit-for-moderation', [OlympiadController::class, 'submitForModeration'])->middleware(['olympiad.editable']);

        Route::post('{id}/questions', [QuestionController::class, 'addQuestionToOlympiad'])->middleware(['olympiad.editable']);
        Route::delete('{id}/questions/{questionId}', [QuestionController::class, 'destroy'])->middleware(['olympiad.editable']);
        Route::put('{id}/questions/{questionId}', [QuestionController::class, 'update'])->middleware(['olympiad.editable']);

        Route::get('{id}/brackets', [OlympiadController::class, 'getBracket']);
        Route::post('{id}/brackets', [OlympiadController::class, 'createBracket'])->middleware(['olympiad.editable']);

        Route::post('{id}/hide', [OlympiadController::class, 'hide']);
        Route::post('{id}/unhide', [OlympiadController::class, 'unhide']);


        Route::post('{id}/start', [ParticipationController::class, 'start']);

        });

    Route::prefix('attempts')->middleware(['auth:sanctum', 'verified'])->group(function() {
        Route::post('{attemptId}/answer', [ParticipationController::class, 'saveAnswer']);
        Route::post('{attemptId}/submit', [ParticipationController::class, 'submit']);
        });


    Route::prefix('cart')->middleware(['auth:sanctum', 'verified'])->group(function() {
        Route::get('/', [CartController::class, 'showCart']);
        Route::post('items', [CartController::class, 'addItem']);
        Route::post('items/{itemId}', [CartController::class, 'deleteItem']);
    });
    
    Route::post('/checkout', [InvoiceController::class, 'checkout'])->middleware('auth:sanctum');

    Route::post('/payments/paykeeper/callback', [PayKeeperCallbackController::class, 'handle']);
//  https://demo.paykeeper.ru/testgw/result/?payment_id=222159052&result=success&PAN=510047XXXXXX3333&RRN=17802402621137&uuid=c9feb2f4-886b-41f7-b6f5-7a811b8306ed
});
