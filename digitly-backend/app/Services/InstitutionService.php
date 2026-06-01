<?php

namespace App\Services;

use App\Models\Institution;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Orchid\Attachment\File;
use Orchid\Attachment\Models\Attachment;
class InstitutionService
{
    public function upload(Institution $institution, UploadedFile $file, $path)
    {
        $attachment = (new File($file))->path('institutions/' . $path)->load();

        $institution->director_app_id = $attachment->id;
        $institution->save();

        return $attachment;
    }

}
