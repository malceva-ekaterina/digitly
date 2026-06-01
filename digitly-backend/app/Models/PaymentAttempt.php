<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentAttempt extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'payment_id',
        'started_at',
        'status',
        'error_message',
        'gateway_session_id',
    ];

    protected $casts = [
        'started_at' => 'datetime',
    ];

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    public function transactions()
    {
        return $this->hasMany(PaymentTransaction::class);
    }
}
