<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'transaction_id',
        'invoice_id',
        'number',
        'status',
        'fiscal_provider',
        'external_receipt_id',
        'created_at',
    ];

    public function transaction()
    {
        return $this->belongsTo(PaymentTransaction::class, 'transaction_id');
    }
    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
