<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'invoice_id',
        'gateway',
        'amount_minor',
        'currency',
        'status',
        'idempotency_key',
        'created_at',
    ];

    protected $casts = [
        'amount_minor' => 'integer',
        'created_at' => 'datetime',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function attempts()
    {
        return $this->hasMany(PaymentAttempt::class);
    }
}
