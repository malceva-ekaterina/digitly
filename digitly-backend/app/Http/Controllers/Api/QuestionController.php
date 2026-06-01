<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Question\StoreQuestionRequest;
use App\Http\Requests\Question\UpdateQuestionRequest;
use App\Http\Resources\QuestionResource;
use App\Models\Institution;
use App\Models\Olympiad;
use App\Models\Question;
use App\Models\User;
use App\Notifications\OlympiadApproved;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

// use Symfony\Component\HttpFoundation\Request;

class QuestionController extends Controller
{
    /**
     * /GET /api/v1/institutions/{id}/questions — список вопросов ОО (банк вопросов)
     * @param mixed $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getInstitutionQuestions($id)
    {
        $institution = Institution::findOrFail($id);
        $questions = $institution->questions()->get();

        return response()->json([
            'data' => QuestionResource::collection($questions)
        ]);
    }

    /**
     * POST /api/v1/questions — создание нового вопросаПоля: type, text, metadata (JSON с вариантами ответов)
     * @param StoreQuestionRequest $request
     * @param mixed $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreQuestionRequest $request, $id)
    {
        if (!Institution::find($id))
        {
            return response()->json(['message' => "Institution don't found"], 404);
        }

        $question = Question::create([
            'institution_id' => $id,
            'created_by' => $request->user()->id,
            'prompt' => $request->prompt,
            'type' => $request->type,
            'metadata' => $request->metadata,
            'weight' => $request->weight,
            'random_options' => 0,
        ]);

        return response()->json([
            'data' => QuestionResource::make($question)
        ]);
    }


    public function addQuestionToOlympiad($id,  Request $request)
    {
        $request->validate([
            'question_id' => ['required', 'exists:questions,id']
        ]);

        $olympiad = Olympiad::find($id);
        $question = $request->question_id;

        if ($olympiad->HasQuestion($question))
        {
            return response()->json([
            'message' => 'Question already exists'
            ], 422);
        }
        $olympiad->questions()->attach($request->question_id, [
            'added_at' => now(),
        ]);

        return response()->json([
            'message' => 'Question added successfully'
        ]);
    }

    /**
     * /PUT /api/v1/olympiads/{id}/questions/{questionId}
     * @param UpdateQuestionRequest $request
     * @param Question $question
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateQuestionRequest $request, $questionId)
    {
        $question = Question::find($questionId);
        $question->update([$request->weight]);

        return response()->json(['message' => 'Weight updated successfully']);
    }

    // DELETE /api/v1/olympiads/{id}/questions/{questionId} — удаление вопроса из олимпиады
    public function destroy($id, $questionId)
    {
        $olympiad = Olympiad::find($id);
        $olympiad->questions()->detach($questionId);
        return response()->json([
                'success' => true,
                'message' => 'Question successfully deleted from olympiad',
        ]);
    }
    
}
