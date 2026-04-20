<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserLoginHistory extends Model
{
    protected $table = 'user_login_history';
    public $timestamps = false;
    protected $fillable = [
        'user_id',
        'ip_address',
        'user_agent',
        'device_type',
        'logged_in_at'
    ];

    protected $casts = [
        'logged_in_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
