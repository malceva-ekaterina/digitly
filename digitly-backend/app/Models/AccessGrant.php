<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccessGrant extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'recipient_user_id',
        'recipient_email',
        'product_type',
        'product_id',
        'version_id',
        'order_item_id',
        'status',
        'activated_at',
        'expires_at',
    ];

    protected $casts = [
        'activated_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function recipientUser()
    {
        return $this->belongsTo(User::class, 'recipient_user_id');
    }

    public function orderItem()
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function participation()
    {
        return $this->hasOne(Participation::class);
    }

    public function product()
    {
        return $this->morphTo();
    }
}
