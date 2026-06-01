<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'user_id',
        'shopping_cart_id',
        'number',
        'currency',
        'total_minor',
        'status',
        'due_at',
        'created_at',
    ];

    protected $casts = [
        'due_at' => 'datetime',
        'created_at' => 'datetime',
        'total_minor' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function shoppingCart()
    {
        return $this->belongsTo(ShoppingCart::class);
    }

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function receipts()
    {
        return $this->hasMany(Receipt::class);
    }
}
