<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstitutionFinancial extends Model
{
    protected $fillable = [
        'institution_id',
        'bank_account',
        'bank_bik',
        'bank_name',
        'accumulated_minor',
        'last_payout_at'
    ];

    protected $casts = [
        'last_payout_at' => 'datetime',
        'created_at'  => 'datetime',
        'updated_at'  => 'datetime',
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }
}
