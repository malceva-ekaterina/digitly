<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'invoice_id',
        'product_type',
        'product_id',
        'version_id',
        'name',
        'quantity',
        'unit_price_minor',
        'total_price_minor',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price_minor' => 'integer',
        'total_price_minor' => 'integer',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
