<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItemRecipient extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'order_item_id',
        'recipient_user_id',
        'recipient_email',
        'recipient_fullname',
        'invite_token',
        'invite_expires_at',
        'invite_sent_at',
        'registered_at',
    ];

    protected $casts = [
        'invite_expires_at' => 'datetime',
        'invite_sent_at' => 'datetime',
        'registered_at' => 'datetime',
    ];

    public function orderItem()
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function recipientUser()
    {
        return $this->belongsTo(User::class, 'recipient_user_id');
    }
}
