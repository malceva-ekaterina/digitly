<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Institution extends Model
{
    protected $fillable = [
        'fullname',
        'shortname',
        'inn',
        'kpp',
        'website_url',
        'legal_address_id',
        'actual_address_id',
        'contact_email',
        'contact_phone',
        'logotype_id',
        'signature_id',
        'seal_id',
        'director_app_id',
        'status',
        'moderated_by',
        'moderation_comment',
        'is_requisites_pending',
    ];

    protected $casts = [
        'moderated_at' => 'datetime',
        'is_requisites_pending' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_institutions');
    }

    public function institutionUsers()
    {
        return $this->hasMany(UserInstitution::class);
    }

    public function financials()
    {
        return $this->hasOne(InstitutionFinancial::class);
    }

    public function payouts()
    {
        return $this->hasMany(InstitutionPayout::class);
    }

    public function moderator()
    {
        return $this->belongsTo(User::class, 'moderated_by');
    }

    public function legalAddress()
    {
        return $this->belongsTo(AdrAddress::class, 'legal_address_id');
    }

    public function actualAddress()
    {
        return $this->belongsTo(AdrAddress::class, 'actual_address_id');
    }

}
