<?php

namespace App\Services;

use App\Models\Institution;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Orchid\Attachment\File;
use Orchid\Attachment\Models\Attachment;
class InstitutionService
{
    protected string $disk = 'local';
    protected string $directory = 'institutions';

    public function upload(Institution $institution, UploadedFile $file, $path)
    {
        $attachment = (new File($file))->path('institutions/' . $path)->load();

        $institution->application_scan = $attachment->id;
        $institution->save();

        return $attachment;
    }

    public function deleteUserAvatar(User $user): void
    {
        if ($user->avatar_id) {
            Attachment::find($user->avatar_id)?->delete();
            $user->avatar_id = null;
            $user->save();
        }
    }
}
