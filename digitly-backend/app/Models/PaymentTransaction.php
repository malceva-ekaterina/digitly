<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentTransaction extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'payment_attempt_id',
        'transaction_type',
        'external_tx_id',
        'amount_minor',
        'status',
        'processed_at'
    ];

    public function paymentAttempt()
    {
        return $this->belongsTo(PaymentAttempt::class);
    }
}
