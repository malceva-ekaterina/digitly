<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuestionResource;
use App\Models\Olympiad;
use App\Models\OlympiadAttempt;
use App\Models\Participation;
use App\Services\AttemptService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ParticipationController extends Controller
{

    public function start($id)
    {
        $user = auth()->user();
        $access_grant_id = $user->accessToOlympiad($id)->first();

        $olympiad= Olympiad::find($id);
        if ($olympiad->status !== 'approved')
        {
            return response()->json(['message' => 'Olympiad is unavailable'], 400);
        }
        if (!$access_grant_id){
            return response()->json(['message' => 'У вас нет доступа'], 403);
        }
        if (!Participation::hasAttempt($id, $access_grant_id))
        {
            return response()->json(['message' => 'Вы уже прошли олимпиаду'], 400);
        }
        $time_limit_minutes = $olympiad->time_limit_minutes;

        $participation = Participation::create([
            'olympiad_id' => $id,
            'access_grant_id' => $access_grant_id->id,
            'role' => 'participant',
            'status' => 'in_progress',
            'participant_fullname' => $user->fullname,
            'participant_institution' => $user->study_place,
            'participant_grade' => $user->study_grade,
            'started_at' => now(),
            'ended_at' => $time_limit_minutes ? now()->addMinutes($time_limit_minutes) : null,
        ]);

        $attempt = OlympiadAttempt::create([
            'participation_id' => $participation->id,
            'started_at' => now(),
            'must_complete_by' => $time_limit_minutes ? now()->addMinutes($time_limit_minutes) : null,
            'olympiad_id' => $id,
            'status' => 'in_progress',
            'max_score' => $olympiad->countTotalScore()
        ]);

        return response()->json([
            'attempt_id' => $attempt->id,
            'questions' => QuestionResource::collection($olympiad->questions)
        ]);
    }

    public function saveAnswer($attemptId, Request $request)
    {
        $request->validate([
            'question_id' => ['required', 'exists:questions,id'],
            'answer_data' => ['required']
        ]);
        $attempt = OlympiadAttempt::find($attemptId);
       if (!$attempt) {
            return response()->json([
                'success' => false,
                'message' => 'Попытка не найдена',
            ], Response::HTTP_NOT_FOUND);
        }
        if (!$attempt->canAnswer()) {
            return response()->json([
                'success' => false,
                'message' => 'Нельзя отвечать на вопросы этой попытки (попытка завершена или время истекло)',
            ], Response::HTTP_FORBIDDEN);
        }
        
        $attempt->responses()->updateOrCreate(['olympiad_question_id' => $request->question_id], ['response_data' => $request->answer_data, 'saved_at' => now()]);
        
        return response()->json([ 'saved' => true ]);
        
    }

    // public function submit($attemptId)
    // {
    //     $attempt = OlympiadAttempt::find($attemptId);
    //     if ($attempt->status != 'in_progress')
    //     {
    //         return response()->json(['message' => 'Статус попытки не "in_progress"'], 400);
    //     }
    //     $result = $attempt->submit(false);

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Олимпиада завершена',
    //         'data' => $result,
    //     ]);
    // }

    public function submit(Request $request, $attemptId, AttemptService $attemptService)
    {

        $attempt = OlympiadAttempt::find($attemptId);

        if (!$attempt) {
            return response()->json([
                'success' => false,
                'message' => 'Попытка не найдена',
            ], Response::HTTP_NOT_FOUND);
        }

        if (!$attempt->canAnswer()) {
            return response()->json([
                'success' => false,
                'message' => 'Попытка уже завершена',
            ], Response::HTTP_BAD_REQUEST);
        }

        
        $result = $attemptService->completeAttempt($attempt);
        
        return response()->json([
            'success' => true,
            'message' => 'Олимпиада завершена',
            'data' => $result,
        ]);
    
    }
}

