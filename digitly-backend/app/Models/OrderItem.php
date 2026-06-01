<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'order_id',
        'product_type',
        'product_id',
        'version_id',
        'name',
        'quantity',
        'unit_price_minor',
        'gateway_fee_minor',
        'platform_fee_minor',
        'institution_earn_minor',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price_minor' => 'integer',
        'total_price_minor' => 'integer',
        'platform_fee_minor' => 'integer',
        'institution_earn_minor' => 'integer',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function recipients()
    {
        return $this->hasMany(OrderItemRecipient::class);
    }

    public function accessGrants()
    {
        return $this->hasMany(AccessGrant::class);
    }
}
