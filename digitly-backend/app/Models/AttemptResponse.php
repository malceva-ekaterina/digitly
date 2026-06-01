<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Log;

class AttemptResponse extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'olympiad_attempt_id',
        'olympiad_question_id',
        'response_data',
        'score',
        'reviewer_id',
        'reviewer_comment',
        'reviewed_at',
        'saved_at',
    ];
    
    
    protected function casts()  {
        return [
        'response_data' => 'array',
        'score' => 'decimal:2',
        'reviewed_at' => 'datetime',
        'saved_at' => 'datetime',
    ];
    }
    public function olympiadAttempt()
    {
        return $this->belongsTo(OlympiadAttempt::class);
    }

    public function olympiadQuestion()
    {
        return $this->belongsTo(OlympiadQuestion::class);
    }

    public function question()
    {
        return $this->olympiadQuestion?->question();
    }

    /**
     * Получить вопрос (упрощённый метод)
     */
    public function getQuestionAttribute()
    {
        return $this->olympiadQuestion?->question;
    }

    /**
     * Проверить, правильный ли ответ
     */
    public function isCorrect(): bool
    {
        $olympiadQuestion = $this->olympiadQuestion;
        
        if (!$olympiadQuestion) {
            Log::warning('AttemptResponse: olympiadQuestion not found', ['id' => $this->id]);
            return false;
        }
        
        $question = $olympiadQuestion->question;
        
        if (!$question) {
            Log::warning('AttemptResponse: question not found', ['olympiad_question_id' => $olympiadQuestion->id]);
            return false;
        }
        
        $correctAnswer = $question->metadata['correct'] ?? null;
        $userAnswer = $this->response_data;
        
        if (!$correctAnswer) {
            Log::warning('AttemptResponse: correct answer not found', [
                'question_id' => $question->id,
                'metadata' => $question->metadata
            ]);
            return false;
        }
        
        if (!$userAnswer) {
            Log::info('AttemptResponse: user answer is empty', ['id' => $this->id]);
            return false;
        }
        
        Log::info('AttemptResponse: comparing', [
            'type' => $question->type,
            'user_answer' => json_encode($userAnswer),
            'correct_answer' => json_encode($correctAnswer)
        ]);
        
        return match($question->type) {
            'single_choice' => $this->compareSingleChoice($userAnswer, $correctAnswer),
            'multiple_choice' => $this->compareMultipleChoice($userAnswer, $correctAnswer),
            'true_false' => $this->compareTrueFalse($userAnswer, $correctAnswer),
            'short_answer' => $this->compareShortAnswer($userAnswer, $correctAnswer),
            'numeric' => $this->compareNumeric($userAnswer, $correctAnswer),
            'fill_blanks' => $this->compareFillBlanks($userAnswer, $correctAnswer),
            'ordering' => $this->compareOrdering($userAnswer, $correctAnswer),
            'matching' => $this->compareMatching($userAnswer, $correctAnswer),
            default => false,
        };
    }

    /**
     * Рассчитать балл за ответ
     */
    public function calculateScore(): float
    {
        $olympiadQuestion = $this->olympiadQuestion;
        
        if (!$olympiadQuestion) {
            return 0;
        }
        
        $question = $olympiadQuestion->question;
        
        if (!$question) {
            return 0;
        }
        
        // Если уже есть оценка (для эссе)
        if ($this->score !== null && $question->type === 'essay') {
            return (float) $this->score;
        }
        
        // Для эссе без оценки
        if ($question->type === 'essay') {
            return 0;
        }
        
        // Автоматическая проверка
        $isCorrect = $this->isCorrect();
        $score = $isCorrect ? (float) $question->weight : 0;
        
        Log::info('AttemptResponse: score calculated', [
            'response_id' => $this->id,
            'is_correct' => $isCorrect,
            'weight' => $question->weight,
            'score' => $score
        ]);
        
        return $score;
    }

    // ========== Приватные методы сравнения ==========

    private function compareSingleChoice(array $answer, $correct): bool
    {
        $userAnswer = $answer['answer'] ?? null;
        $correctAnswer = is_array($correct) ? $correct[0] : $correct;
        
        // Приводим к строке для безопасного сравнения
        return (string) $userAnswer === (string) $correctAnswer;
    }

    private function compareMultipleChoice(array $answer, $correct): bool
    {
        $userAnswers = $answer['answers'] ?? [];
        $correctAnswers = is_array($correct) ? $correct : json_decode($correct, true);
        
        if (!is_array($correctAnswers)) {
            $correctAnswers = [$correctAnswers];
        }
        
        sort($userAnswers);
        sort($correctAnswers);
        
        return $userAnswers == $correctAnswers;
    }

    private function compareTrueFalse(array $answer, $correct): bool
    {
        $userAnswer = $answer['answer'] ?? null;
        
        // Приводим к boolean
        if (is_string($userAnswer)) {
            $userAnswer = filter_var($userAnswer, FILTER_VALIDATE_BOOLEAN);
        }
        
        $correctAnswer = is_bool($correct) ? $correct : (bool) $correct;
        
        return $userAnswer === $correctAnswer;
    }

    private function compareShortAnswer(array $answer, $correct): bool
    {
        $userAnswer = trim($answer['answer'] ?? '');
        $userAnswer = mb_strtolower($userAnswer);
        
        if (is_array($correct)) {
            $correctAnswers = array_map(function($c) {
                return mb_strtolower(trim($c));
            }, $correct);
            return in_array($userAnswer, $correctAnswers);
        }
        
        $correctAnswer = mb_strtolower(trim($correct));
        return $userAnswer === $correctAnswer;
    }

    private function compareNumeric(array $answer, $correct): bool
    {
        $userAnswer = $answer['answer'] ?? null;
        
        if (!is_numeric($userAnswer)) {
            return false;
        }
        
        $userAnswer = (float) $userAnswer;
        
        if (is_array($correct) && isset($correct['value'])) {
            $correctValue = (float) $correct['value'];
            $tolerance = (float) ($correct['tolerance'] ?? 0.0001);
            return abs($userAnswer - $correctValue) <= $tolerance;
        }
        
        $correctValue = (float) $correct;
        return abs($userAnswer - $correctValue) < 0.0001;
    }

    private function compareFillBlanks(array $answer, $correct): bool
    {
        $userAnswers = $answer['answers'] ?? [];
        $correctAnswers = is_array($correct) ? $correct : [$correct];
        
        if (count($userAnswers) !== count($correctAnswers)) {
            return false;
        }
        
        foreach ($correctAnswers as $index => $correctBlank) {
            $userBlank = trim($userAnswers[$index] ?? '');
            $userBlank = mb_strtolower($userBlank);
            $correctBlank = mb_strtolower(trim($correctBlank));
            
            if ($userBlank !== $correctBlank) {
                return false;
            }
        }
        
        return true;
    }

    private function compareOrdering(array $answer, $correct): bool
    {
        $userOrder = $answer['order'] ?? [];
        $correctOrder = is_array($correct) ? $correct : json_decode($correct, true);
        
        if (count($userOrder) !== count($correctOrder)) {
            return false;
        }
        
        foreach ($correctOrder as $index => $value) {
            if (!isset($userOrder[$index]) || $userOrder[$index] != $value) {
                return false;
            }
        }
        
        return true;
    }

    private function compareMatching(array $answer, $correct): bool
    {
        $userMatches = $answer['matches'] ?? [];
        $correctMatches = is_array($correct) ? $correct : json_decode($correct, true);
        
        foreach ($correctMatches as $left => $right) {
            if (!isset($userMatches[$left]) || $userMatches[$left] != $right) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Сохранить ответ (upsert)
     */
    public static function saveAnswer(int $attemptId, int $questionId, array $answerData): self
    {
        return self::updateOrCreate(
            [
                'olympiad_attempt_id' => $attemptId,
                'olympiad_question_id' => $questionId,
            ],
            [
                'response_data' => $answerData,
                'saved_at' => now(),
            ]
        );
    }

    
}
