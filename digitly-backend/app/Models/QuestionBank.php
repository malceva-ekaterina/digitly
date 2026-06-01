<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuestionBank extends Model
{
    protected $fillable = [
        'name',
        'description',
        'is_public',
        'institution_id',
        'created_by',
        'price_minor',
        'status',
    ];

    protected $casts = [
        'created_at',
        'updated_at',
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function questionBanks()
    {
        return $this->belongsToMany(Question::class, 'question_question_bank');
    }

    public function cartItems()
    {
        return $this->morphMany(CartItem::class, 'product');
    }
}
