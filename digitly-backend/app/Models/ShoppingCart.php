<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShoppingCart extends Model
{
    protected $fillable = [
        'user_id',
        'currency',
    ];

    protected $casts = [
        'user_id' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    public function getTotalMinor(): int
    {
        return (int) $this->items()->sum('unit_price_minor');
    }

    public function clean(): int
    {
        return $this->items()->delete();
    }

}
