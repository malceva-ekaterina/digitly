<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Orchid\Attachment\Attachable;
use Orchid\Attachment\Models\Attachment;
use Orchid\Screen\AsSource;

class Institution extends Model
{
    use AsSource, Attachable;
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
        'application_scan',
        'logotype_id',
        'signature_id',
        'seal_id',
        'director_app_id',
        'status',
        'moderated_by',
        'moderated_at',
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

    public function members()
    {
        return $this->belongsToMany(User::class, 'user_institutions', 'institution_id', 'user_id')->withPivot('role', 'joined_at');
    }

    public function hasMember($userId)
    {
        return $this->members()->where('user_id', $userId)->exists();
    }

    public function isAdmin(User $user)
    {
        return $this->members()
                    ->where('user_id', $user->id)
                    ->wherePivot('role', 'admin')
                    ->exists();
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

    public function applicationScan()
    {
        return $this->belongsTo(Attachment::class, 'application_scan');
    }

    public function admins()
    {
        return $this->users()
                    ->withPivot('role') // Обязательно для работы с pivot
                    ->wherePivot('role', 'institution_admin');
    }

    public function methodist()
    {
        return $this->users()
                    ->withPivot('role')
                    ->wherePivot('role', 'institution_methodist');
    }

    public function getUserRole(User $user)
    {
        $member = $this->members()
                       ->where('user_id', $user->id)
                       ->first();

        return $member ? $member->pivot->role : null;
    }

    public function olympiads()
    {
        return $this->hasMany(Olympiad::class);
    }
    public function questionBanks()
    {
        return $this->hasMany(QuestionBank::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
    }
}
