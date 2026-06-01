<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItemRecipient extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'cart_item_id',
        'recipient_user_id',
        'recipient_email',
        'recipient_fullname',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function cartItem()
    {
        return $this->belongsTo(CartItem::class);
    }

    public function recipientUser()
    {
        return $this->belongsTo(User::class, 'recipient_user_id');
    }
}
