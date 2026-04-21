<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Institution\StoreInstitutionRequest;
use App\Http\Requests\Institution\UpdateInstitutionRequest;
use App\Http\Resources\InstitutionResource;
use App\Models\Institution;
use App\Services\InstitutionService;
use Symfony\Component\HttpFoundation\Request;

class InstitutionController extends Controller
{

    public function __construct(
        protected InstitutionService $institutionService
    ) {}
    public function apply(StoreInstitutionRequest $request)
    {
        $request->validated();

        $institution = Institution::create([
            'fullname' => $request->fullname,
            'shortname' => $request->shortname,
            'inn' => $request->inn,
            'website_url' =>$request->website_url,
            'status' => 'pending',
        ]);

        $attachment = $this->institutionService->upload(
            $institution,
            $request->file('application_scan'),
            'applications'
        );

        $institution->users()->attach($request->user()->id, [
            'role' => 'institution_admin',
            'joined_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Institution create successfully'
        ]);
    }


    public function my(Request $request)
    {
        $institutions = $request->user()->institutions;
        return InstitutionResource::collection($institutions);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function checkInn(Request $request)
    {
        $inn = $request->input('inn');

        $institution = Institution::where('inn', $inn )->first();
        if(!$institution)
        {
            return response()->json(['available' => true]);
        }
        return response()->json(['available' => false,
        'institution' => ['id' => $institution->id, 'fullname' => $institution->fullname]]);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInstitutionRequest $request, Institution $institution)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Institution $institution)
    {
        //
    }
}
