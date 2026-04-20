<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserInstitution extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'institution_id',
        'role',
        'invited_by',
        'joined_at',
    ];

    protected $casts = [
        'joined_at' => 'datetime',
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function inviter()
    {
        return $this->belongsTo(User::class, 'invited_by');
    }
}
