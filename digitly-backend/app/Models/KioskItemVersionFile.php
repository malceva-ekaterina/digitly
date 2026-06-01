<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Orchid\Attachment\Models\Attachment;

class KioskItemVersionFile extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'kiosk_item_version_id',
        'attachment_id',
        'sort_order',
        'allow_download',
        'introduced_in_version',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'allow_download' => 'boolean',
        'introduced_in_version' => 'integer',
    ];

    public function kioskItemVersion()
    {
        return $this->belongsTo(KioskItemVersion::class);
    }

    public function attachment()
    {
        return $this->belongsTo(Attachment::class);
    }
}
