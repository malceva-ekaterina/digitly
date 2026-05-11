<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Olympiad\StoreOlympiadRequest;
use App\Http\Requests\Olympiad\UpdateOlympiadRequest;
use App\Http\Requests\Olympiad\UpdateScheduleOlympiadRequest;
use App\Http\Resources\OlympiadResource;
use App\Models\Institution;
use App\Models\Olympiad;
use App\Models\OlympiadModerationLog;
use App\Models\User;
use App\Notifications\NewOlympiad;
use App\Notifications\OlympiadApproved;
use App\Notifications\OlympiadRejected;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class OlympiadController extends Controller
{
    /*
     * Summary of store
     * POST /api/v1/institutions/{id}/olympiads
     * @param StoreOlympiadRequest $request
     * @param mixed $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreOlympiadRequest $request, $id)
    {
        $institution = Institution::find($id);
        $creator = $request->user();
        $olympiad = Olympiad::create([
            'institution_id' => $id,
            'created_by' => $creator->id,
            'title' => $request->title,
            'description' => $request->description,
            'type' => $request->type,
            'price_minor' => $request->price_minor,
            'status' => 'draft',
        ]);
        $olympiad->categories()->attach($request->subject_id);
        return response()->json([
            'data' => $olympiad,
            'message' => 'Olympiad created successfully'
        ], 201);
    }
    /**
     * Summary of show
     * GET /api/v1/olympiads/{id}
     * @param mixed $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $olympiad = Olympiad::findOrFail($id);
        return response()->json(OlympiadResource::make($olympiad));
    }

    /**
     * GET /api/v1/institutions/{id}/olympiads
     * @param mixed $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getInstitutionOlympiads($id)
    {
        $institution = Institution::find($id);
        $olympiads = $institution->olympiads()->get();
        return response()->json(['data' => OlympiadResource::collection($olympiads)]);

    }
    /**
     * PUT /api/v1/olympiads/{id}
     * @param UpdateOlympiadRequest $request
     * @param mixed $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateOlympiadRequest $request, $id)
    {
        $olympiad = Olympiad::find($id);

        if (!$olympiad->status == 'draft' or !$olympiad->status == 'approved')
        {
            return response()->json(['message' => 'Olympics is not available for editing.']);
        }
        if ($olympiad->status == 'approved')
        {
            $olympiad->
        }
        $olympiad->update($request->all());
        return response()->json(['data' => OlympiadResource::make($olympiad)]);
    }
    /**
     * /
     * @param UpdateScheduleOlympiadRequest $request
     * @param mixed $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateSchedule(UpdateScheduleOlympiadRequest $request, $id)
    {
        $olympiad = Olympiad::find($id);
        if (!$olympiad->status == 'draft')
        {
            return response()->json(['message' => 'Olympics is not available for editing.']);
        }
        $olympiad->update($request->all());
        return response()->json(['data' => OlympiadResource::make($olympiad)]);
    }

    //
    /**
     * POST /api/v1/olympiads/{id}/submit-for-moderation
     * @param Olympiad $olympiad
     * @return \Illuminate\Http\JsonResponse
     */
    public function submitForModeration($id)
    {
        $olympiad = Olympiad::find($id);
        if ($olympiad->questions()->count() < 5)
        {
            return response()->json([
                'message' => 'The number of questions in the Olympiad must be more than 5',
            ], 422);
        }
        $olympiad->status = 'pending_moderation';
        $olympiad->save();

        $admins = User::admins()->get();

        Notification::send($admins, new NewOlympiad($olympiad));

        return response()->json([
                'message' => 'Olympiad sent for moderation',
            ]);
    }

    // PUT /api/v1/olympiads/{id}

    public function update()
    {

    }
}
