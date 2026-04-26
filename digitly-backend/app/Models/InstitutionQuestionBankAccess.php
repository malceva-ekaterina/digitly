<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstitutionQuestionBankAccess extends Model
{
    public $table = 'institution_question_bank_access';
    protected $fillable = [
        'institution_id',
        'question_bank_id',
        'order_item_id',
        'purchased_at',
        'price_minor'
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }
    public function questionBank()
    {
        return $this->belongsTo(QuestionBank::class);
    }
}
