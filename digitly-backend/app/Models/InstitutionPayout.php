<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstitutionPayout extends Model
{
     protected $fillable = [
        'institution_id',
        'amount_minor',
        'period_from',
        'period_to',
        'status',
        'processed_by',
        'processed_at',
        'notes',
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

    public function processor()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}
