<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KioskItem extends Model
{
    protected $fillable = [
        'institution_id',
        'created_by',
        'title',
        'description',
        'price_minor',
        'currency',
        'status',
    ];

    protected $casts = [
        'price_minor' => 'integer',
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function versions()
    {
        return $this->hasMany(KioskItemVersion::class);
    }

    public function latestVersion()
    {
        return $this->hasMany(KioskItemVersion::class)->latest('version_number');
    }

    public function approvedVersion()
    {
        return $this->hasMany(KioskItemVersion::class)
            ->where('status', 'approved');
    }

    public function accessGrants()
    {
        return $this->morphMany(AccessGrant::class, 'product');
    }

    public function cartItems()
    {
        return $this->morphMany(CartItem::class, 'product');
    }
}
