<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Orchid\Attachment\File;
use Intervention\Image\Laravel\Facades\Image;
use Orchid\Attachment\Models\Attachment;

class AvatarService
{
    protected string $disk = 'local';
    protected string $directory = 'avatars';

    public function upload(User $user, UploadedFile $file)
    {

        $image = Image::read($file);
        $processed = $image->cover(200, 200)->toJpeg();
        // 2. Временный файл
        $tempPath = tempnam(sys_get_temp_dir(), 'avatar');

        file_put_contents($tempPath, $processed->toString());

        $uploadedFile = new UploadedFile(
            $tempPath,
            $file->getClientOriginalName(),
            'image/jpeg',
            null,
            true
        );

        // 3. Загрузка в Orchid в папку avatars
        $attachment = (new File($uploadedFile))->path('avatars')->load();

        $this->deleteUserAvatar($user);

        $user->avatar_id = $attachment->id;
        $user->save();

        unlink($tempPath);

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
