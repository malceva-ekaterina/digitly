<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Orchid\Attachment\Models\Attachment;

class AwardDocument extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'olympiad_id',
        'attempt_id',
        'recipient_user_id',
        'doc_type',
        'template_id',
        'place',
        'issued_date',
        'uuid',
        'file_id',
        'generated_at',
        'created_at',
    ];

    protected function casts()  {
        return [
        'issued_date' => 'date',
        'generated_at' => 'datetime',
        'created_at' => 'datetime',
        ]; 
    }

    public function olympiad()
    {
        return $this->belongsTo(Olympiad::class);
    }

    public function attempt()
    {
        return $this->belongsTo(OlympiadAttempt::class, 'attempt_id');
    }

    public function recipientUser()
    {
        return $this->belongsTo(User::class, 'recipient_user_id');
    }

    public function template()
    {
        return $this->belongsTo(AwardDocumentTemplate::class, 'template_id');
    }

    public function file()
    {
        return $this->belongsTo(Attachment::class, 'file_id');
    }
}
