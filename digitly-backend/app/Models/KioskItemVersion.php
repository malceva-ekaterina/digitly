<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KioskItemVersion extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'kiosk_item_id',
        'version_number',
        'changelog',
        'price_minor',
        'status',
        'moderated_by',
        'moderated_at',
        'moderation_comment',
        'published_at',
        'created_at',
    ];

    protected $casts = [
        'price_minor' => 'integer',
        'version_number' => 'integer',
        'moderated_at' => 'datetime',
        'published_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function kioskItem()
    {
        return $this->belongsTo(KioskItem::class);
    }

    public function moderatedBy()
    {
        return $this->belongsTo(User::class, 'moderated_by');
    }

    public function files()
    {
        return $this->hasMany(KioskItemVersionFile::class);
    }

}
