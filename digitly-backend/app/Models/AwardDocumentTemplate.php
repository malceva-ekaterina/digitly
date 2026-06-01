<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Orchid\Attachment\Attachable;
use Orchid\Attachment\Models\Attachment;

class AwardDocumentTemplate extends Model
{
    use Attachable;
    public $timestamps = false;
    protected $fillable = [
        'institution_id',
        'name',
        'doc_type',
        'background_id',
        'fields_config',
        'is_preset',
        'status',
        'created_at',
    ];

    protected function casts() {
        return [
        'is_preset' => 'boolean',
        'created_at' => 'datetime',
        'fields_config' => 'array',
        ];
    }

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    public function background()
    {
        return $this->belongsTo(Attachment::class, 'background_id');
    }

    public function awardDocuments()
    {
        return $this->hasMany(AwardDocument::class, 'template_id');
    }
}
