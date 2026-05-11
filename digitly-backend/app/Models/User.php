<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Orchid\Attachment\Attachable;
use Orchid\Attachment\Models\Attachment;
use Orchid\Filters\Types\Like;
use Orchid\Filters\Types\Where;
use Orchid\Filters\Types\WhereDateStartEnd;
use Orchid\Platform\Models\Role;
use Orchid\Platform\Models\User as Authenticatable;
use Orchid\Screen\AsSource;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, SoftDeletes, Attachable, AsSource;
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
           'deleted_at' => WhereDateStartEnd::class,
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

    public function scopeAdmins(Builder $query): Builder
    {
        return $query->whereHas('roles', function($query) {
            $query->where('slug', 'admin');
        });
    }

    public function scopeInstitutionAdmins(Builder $query): Builder
    {
        return $query->whereHas('roles', function($query) {
            $query->where('slug', 'institution_admin');
        });
    }

    // связи
    public function address() {
        return $this->belongsTo(AdrAddress::class, 'adr_address_id');
    }

    public function loginHistory()
    {
        return $this->hasMany(UserLoginHistory::class);
    }
    // ОО
    public function institutions()
    {
        return $this->belongsToMany(Institution::class, 'user_institutions')->withPivot('role');
    }

    public function userInstitutions()
    {
        $this->hasMany(UserInstitution::class);
    }

    public function inviter()
    {
        $this->hasMany(UserInstitution::class, 'invited_by');
    }

    public function processedPayouts()
    {
        $this->hasMany(InstitutionPayout::class, 'processed_by');
    }
    // аватарка
    public function avatar()
    {
        return $this->belongsTo(Attachment::class, 'avatar_id');
    }
    // анонимизация пользователя
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

    public function isInstitutionAdmin($institution)
    {
        return $this->institutions()
                    ->where('institution_id', $institution->id)
                    ->wherePivot('role', 'institution_admin')
                    ->exists();
    }

    //олимпиады
    public function creatorOlympiads()
    {
        return $this->hasMany(Olympiad::class, 'created_by');
    }

    public function moderatorOlympiads()
    {
        return $this->hasMany(Olympiad::class, 'moderated_by');
    }

    public function creatorQuestions()
    {
        return $this->hasMany(Question::class, 'created_by');
    }

    public function moderatorOlympiadModerationLogs()
    {
        return $this->hasMany(OlympiadModerationLog::class, 'moderator_id');
    }

    public function creatorQuestionBanks()
    {
        return $this->hasMany(QuestionBank::class, 'created_by');
    }

}
