<?php

namespace App\Services;

use App\Models\AwardDocumentTemplate;
use App\Models\Institution;
use Illuminate\Http\UploadedFile;
use Orchid\Attachment\File;
use Intervention\Image\Laravel\Facades\Image;
use Orchid\Attachment\Models\Attachment;


class AwardDocumentTemplateService
{
    /**
     * Create a new class instance.
     */
    public function upload(AwardDocumentTemplate $awardDocumentTemplate, UploadedFile $file)
    {
        $attachment = (new File($file))->path('institutions/documentTemplate/')->load();

        $awardDocumentTemplate->background_id = $attachment->id;
        $awardDocumentTemplate->save();

        return $attachment;
    }
}

