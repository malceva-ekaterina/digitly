<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\AvatarUploadRequest;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Http\Resources\Profile\LoginHistoryResource;
use App\Http\Resources\Profile\ProfileResource;
// use App\Models\User;
// use App\Models\UserLoginHistory;
use App\Services\AvatarService;
use Illuminate\Http\Request;
use Intervention\Image\Laravel\Facades\Image;
use Orchid\Attachment\File;
// use Symfony\Component\HttpFoundation\File\UploadedFile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Orchid\Attachment\Models\Attachment;

class ProfileController extends Controller
{
    public function __construct(
        protected AvatarService $avatarService
    ) {}

    public function show(Request $request)
    {
        return new ProfileResource($request->user());
    }

    public function update(UpdateProfileRequest $request)
    {
        $request->validated();
        $user = $request->user();

        $user->update($request->all());

        return response()->json(['message' => 'User updated successfully']);
    }

    public function uploadAvatar(AvatarUploadRequest $request)
    {

        $request->validated();

        $attachment = $this->avatarService->upload(
            $request->user(),
            $request->file('avatar')
        );

        return response()->json([
            'success' => true,
            'avatar_url' => $attachment->url(),
        ]);
    }

    public function deleteAvatar(Request $request)
    {
        $user = $request->user();
        if (!$user->avatar_id) {
            return response()->json(['message' => 'Avatar dont exist']);
        }
        $this->avatarService->deleteUserAvatar($user);

        return response()->json([
            'message' => 'Аватар успешно удален',
        ]);

    }

    public function delete(Request $request)
    {
        $user = $request->user();

        if (!Hash::check($request->password, $user->password))
        {
            return response()->json(['message' => 'Incorrect password']);
        }

        $user->tokens()->delete();
        $user->anonymize();

        $user->delete();

        return response()->json(['message'=>'User deleted successfully']);

    }

    public function loginHistory(Request $request)
    {
        $user = $request->user();
        $histories = $user->loginHistory()->latest('loggin_at')->paginate(20);

        return response()->json([
            'date' => LoginHistoryResource::collection($histories),
            'meta' => [
                'current_page' => $histories->currentPage(),
                'last_page' => $histories->lastPage(),
                'per_page' => $histories->perPage(),
                'total' => $histories->total(),
                ],
            ]);

    }
    public function terminateAllSessions(Request $request)
    {
        $user = $request->user();
        $currentTokenId = $user->currentAccessToken()->id;

        $user->tokens()
            ->where('id', '!=', $currentTokenId)
            ->delete();

        return response()->json([
            'message' => 'Все остальные сессии завершены',
        ]);
    }
}
