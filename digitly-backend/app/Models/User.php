<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Orchid\Attachment\Attachable;
use Orchid\Attachment\Models\Attachment;
use Orchid\Filters\Types\Like;
use Orchid\Filters\Types\Where;
use Orchid\Filters\Types\WhereDateStartEnd;
use Orchid\Platform\Models\User as Authenticatable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, SoftDeletes, Attachable;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'fullname',
        'email',
        'password',
        'phone_number',
        'birth_date',
        'study_place',
        'study_grade',
        'adr_address_id',
        'avatar_id',
        'permissions',
        'accepted_terms_at',
        'accepted_privacy_at'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
        'permissions',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'permissions'          => 'array',
        'email_verified_at'    => 'datetime',
        'accepted_terms_at' => 'datetime',
        'accepted_privacy_at' => 'datetime',
    ];

    /**
     * The attributes for which you can use filters in url.
     *
     * @var array
     */
    protected $allowedFilters = [
           'id'         => Where::class,
           'fullname'       => Like::class,
           'email'      => Like::class,
           'updated_at' => WhereDateStartEnd::class,
           'created_at' => WhereDateStartEnd::class,
    ];

    /**
     * The attributes for which can use sort in url.
     *
     * @var array
     */
    protected $allowedSorts = [
        'id',
        'fullname',
        'email',
        'updated_at',
        'created_at',
    ];
    // связи
    public function address() {
        return $this->belongsTo(AdrAddress::class, 'adr_address_id');
    }

    public function loginHistory()
    {
        return $this->hasMany(UserLoginHistory::class);
    }

    public function institutions()
    {
        $this->belongsToMany(Institution::class, 'user_instutions');
    }

    public function userInstitutions()
    {
        $this->hasMany(UserInstitution::class);
    }

    public function invinter()
    {
        $this->hasMany(UserInstitution::class, 'invinter_by');
    }

    public function processedPayouts()
    {
        $this->hasMany(InstitutionPayout::class, 'processed_by');
    }

    public function avatar()
    {
    // Используем belongsTo, так как avatar_id находится в таблице users
    return $this->belongsTo(Attachment::class, 'avatar_id');
    }

    public function anonymize(): void
    {
        $this->update([
            'fullname' => "Удалённый пользователь {$this->id}",
            'email' => "deleted_{$this->id}@digitly.deleted",
            'phone_number' => null,
            'birth_date' => null,
            'adr_address_id' => null,
            'avatar_id' => null,
            'study_place' => null,
            'study_grade' => null,
            'remember_token' => null,
        ]);
    }
}
