<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Institution\StoreInstitutionRequest;
use App\Http\Requests\Institution\UpdateMemberRoleRequest;
use App\Http\Resources\Institution\InstitutionMembersResource;
use App\Http\Resources\Institution\InstitutionResource;
use App\Models\Institution;
use App\Models\User;
use App\Notifications\InstitutionApproved;
use App\Notifications\InstitutionRejected;
use App\Notifications\UserAddedToInstitution;
use App\Services\InstitutionService;
use Illuminate\Http\Request;
use Orchid\Support\Facades\Toast;


class InstitutionController extends Controller
{

    public function __construct(
        protected InstitutionService $institutionService
    ) {}
    public function apply(StoreInstitutionRequest $request)
    {

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

    public function approve(Request $request)
    {
        $id = $request->input('id');
        $institution = Institution::findOrFail($id);
        dd($institution);
        if (!$institution->status == 'approve') {
            Toast::error('Эта заявка уже обработана');
        }

        $institution->update([
            'status' => 'approved',
            'moderated_by' => auth()->id(),
            'moderated_at' => now(),
        ]);

        $admin = $institution->admins()->first();
        if ($admin) {
            $admin->notify(new InstitutionApproved($institution));
        }

        Toast::success("Организация {$institution->name} успешно одобрена");

        return redirect()->back();
    }

    public function reject(Request $request)
    {
        $id = $request->input('id');
        $reason = $request->input('moderation_comment');

        $request->validate([
            'moderation_comment' => 'required|string|min:10|max:1000',
        ]);

        $institution = Institution::findOrFail($id);

        $institution->update([
            'status' => 'reject',
            'moderated_by' => auth()->id(),
            'moderated_at' => now(),
            'moderation_comment' => $request->moderation_comment,
        ]);

        $admin = $institution->admins()->first();

        $admin->notify(new InstitutionRejected($institution));

        Toast::message("Организация отклонена");
        return redirect()->back();

    }

    public function checkStatus($id)
    {
        $institution = Institution::find($id);
        return response()->json([
            'status' => $institution->status
        ]);
    }

    public function getMembers($id)
    {
        $institution = Institution::find($id);
        $members = $institution->members()->get();
        return response()->json(['data' =>InstitutionMembersResource::collection($members)]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function addMember($id, Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
            'role' => ['required', 'in:institution_methodist,institution_admin']
        ]);

        $institution = Institution::find($id);
        $currentUser = $request->user();

        $userToAdd = User::where('email', $request->email)->first();

        if ($institution->hasMember($userToAdd->id)) {
            return response()->json([
                'message' => 'Пользователь уже является членом этой организации'
            ], 409);
        }

        $institution->members()->attach($userToAdd->id, [
                'role' => $request->role,
                'joined_at' => now(),
                'invited_by' => $currentUser->id
            ]);

        $pivot = new \Illuminate\Database\Eloquent\Relations\Pivot([
            'role' => $request->role,
            'joined_at' => now(),
        ]);

        $userToAdd->setRelation('pivot', $pivot);

        $userToAdd->notify(new UserAddedToInstitution($institution, $request->role));

        return response()->json([
            'message' => 'Member added successfully',
            'data' => InstitutionMembersResource::make($userToAdd)
        ]);
    }

    public function deleteMember($id, $userId)
    {
        $institution = Institution::findOrFail($id);
        $userToRemove = User::findOrFail($userId);

        if (!$institution->hasMember($userToRemove->id)) {
            return response()->json([
                'message' => 'Пользователь не является членом этой организации'
            ], 404);
        }

        $userRole = $institution->getUserRole($userToRemove);

        if ($userRole === 'institution_admin') {
            $adminsCount = $institution->admins()->count();

            if ($adminsCount <= 1) {
                return response()->json([
                    'message' => 'Нельзя удалить последнего администратора организации'
                ], 400);
            }
        }

        $institution->members()->detach($userToRemove->id);

        return response()->json([
            'message' => 'Пользователь успешно удален из организации'
        ]);
    }

    public function updateMember(UpdateMemberRoleRequest $request, $id, $userId)
    {
        $institution = Institution::findOrFail($id);
        $user = User::findOrFail($userId);

        // Проверяем, является ли пользователь членом организации
        if (!$institution->hasMember($user->id)) {
            return response()->json([
                'message' => 'Пользователь не является членом этой организации'
            ], 404);
        }

        $oldRole = $institution->getUserRole($user);
        $newRole = $request->role;

        // Если роль не меняется
        if ($oldRole === $newRole) {
            return response()->json([
                'message' => 'Роль пользователя уже является ' . $newRole
            ], 400);
        }

        // Проверка: нельзя изменить роль последнего администратора
        if ($oldRole === 'institution_admin' && $newRole === 'institution_methodist') {
            $adminsCount = $institution->admins()->count();
            if ($adminsCount <= 1) {
                return response()->json([
                    'message' => 'Нельзя изменить роль последнего администратора'
                ], 400);
            }
        }

        // Обновляем роль
        $institution->members()->updateExistingPivot($user->id, [
            'role' => $newRole
        ]);

        return response()->json([
            'message' => 'Роль пользователя успешно изменена',
            'data' => [
                'user_id' => $user->id,
                'fullname' => $user->fullname,
                'role' => $newRole,
            ]
        ]);
    }

    public function index($id)
    {
        $institution = Institution::findOrFail($id);
        return response()->json(['data' => [
            'status' => $institution->status,
            'accumulated_minor' => $institution->financials()->get()->accumulated_minor
        ]]);
    }
}
