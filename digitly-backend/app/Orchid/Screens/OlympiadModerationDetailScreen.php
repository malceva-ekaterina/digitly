<?php

namespace App\Orchid\Screens;

use App\Models\Olympiad;
use App\Models\OlympiadModerationLog;
use App\Notifications\OlympiadApproved;
use App\Notifications\OlympiadRejected;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\ModalToggle;
use Orchid\Screen\Fields\TextArea;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Screen\Sight;
use Orchid\Screen\TD;

class OlympiadModerationDetailScreen extends Screen
{
    public $olympiad;

    /**
     * Fetch data to be displayed on the screen.
     *
     * @return array
     */
    public function query(Olympiad $olympiad): iterable
    {
        return [
            'olympiad' => $olympiad->load(['institution', 'questions']),
            // 'questions' => $olympiad->questions()->paginate(20)
        ];
    }

    /**
     * The name of the screen displayed in the header.
     *
     * @return string|null
     */
    public function name(): ?string
    {
        return 'Детальный просмотр';
    }

    /**
     * The screen's action buttons.
     *
     * @return \Orchid\Screen\Action[]
     */
    public function commandBar(): iterable
    {
        return [
            Button::make('Одобрить')
                ->icon('bs.check-circle')
                ->method('approve')
                ->confirm('Вы уверены, что хотите одобрить эту олимпиаду?'),
            ModalToggle::make('Отклонить')
                ->icon('bs.x-circle')
                ->method('reject')
                ->modal('rejectOlympiadModal'),
        ];
    }

    /**
     * The screen's layout elements.
     *
     * @return \Orchid\Screen\Layout[]|string[]
     */
    public function layout(): iterable
    {
        return [
            Layout::legend('olympiad', [
                Sight::make('id', 'ID'),
                Sight::make('title', 'Название'),
                Sight::make('type', 'Тип'),
                Sight::make('price_minor', 'Цена')
                    ->render( function () {
                        return "{$this->olympiad->price_minor} {$this->olympiad->currency}" ;
                    }),
                Sight::make('time_limit_minutes', 'Лимит по времени')
                    ->render( function () {
                        return $this->olympiad->time_limit_minutes ??  "-";
                    }),
                Sight::make('display_mode', 'Дисплей мод'),
                Sight::make('random_questions', 'Рандомность вопросов'),
                // Sight::make('tiebreak_rule', 'Рандомность вопросов'),
                Sight::make('show_public_rating', 'Просмотр публичных рейтингов')->render( function () {
                        return $this->olympiad->show_public_rating == 1 ?"Да" :  "-";
                    }),
                Sight::make('registration_start_at', 'Начало регистрации')
                ->render( function () {
                        return $this->olympiad->registration_start_at ?? "-";
                    }),
                Sight::make('registration_end_at', 'Конец регистрации')->render( function () {
                        return $this->olympiad->registration_end_at ?? "-";
                    }),
                Sight::make('participation_start_at', 'Начало олимпиады')
                ->render( function () {
                        return $this->olympiad->participation_start_at ?? "-";
                    }),
                Sight::make('participation_end_at', 'Конец регистрации')
                ->render( function () {
                        return $this->olympiad->participation_end_at ?? "-";
                    }),
                Sight::make('institution.fullname', 'Название ОО'),
                ]),

                Layout::table('olympiad.questions', [
                    TD::make('id', 'ID'),
                    TD::make('prompt', 'Текст вопроса'),
                    TD::make('type', 'Тип')
                    ->render(function ($question) {
                        return $this->getQuestionTypeLabel($question->type);
                    }),
                    TD::make('weight', 'Вес'),
                    TD::make('metadata', 'Данные')
                        ->render(function ($question) {
                            if (is_array($question->metadata)) {
                                return json_encode($question->metadata, JSON_UNESCAPED_UNICODE);
                            }
                            return (string) $question->metadata;
                        }),
                    ])
                    ->title('Вопросы'),
            Layout::modal('rejectOlympiadModal', [
                Layout::rows([
                    TextArea::make('rejection_reason')
                        ->title('Причина отклонения')
                        ->required()
                        ->rows(5)
                        ->placeholder('Опишите причину отклонения олимпиады...')
                        ->help('Причина будет отправлена организации и сохранена в журнале модерации'),
                ]),
            ])->title('Отклонение олимпиады')
              ->applyButton('Отклонить'),
        ];
    }

    private function getQuestionTypeLabel(string $type): string
    {
        $types = [
            'single_choice' => 'Одиночный выбор',
            'multiple_choice' => 'Множественный выбор',
            'true_false' => 'Верно/Неверно',
            'matching' => 'Сопоставление',
            'short_answer' => 'Короткий ответ',
            'numeric' => 'Числовой ответ',
            'fill_blank' => 'Заполнить пропуск',
            'ordering' => 'Упорядочивание',
            'essay' => 'Эссе',
        ];

        return $types[$type] ?? $type;
    }

    // POST /admin/olympiads/{id}/approve
    public function approve($olympiad)
    {
        $olympiad = Olympiad::find($olympiad);
        // dd($olympiad);

        $olympiad->update([
            'status' => 'approved',
            'moderated_by' => auth()->id(),
            'moderated_at' => now(),
        ]);

        OlympiadModerationLog::create([
            'olympiad_id' => $olympiad->id,
            'moderator_id' => auth()->id(),
            'action' => 'approve',
            'created_at' => now(),
        ]);

        $olympiad->save();

        $admins = $olympiad->institution->admins;
        Notification::send($admins, new OlympiadApproved($olympiad));

        return redirect()->route('platform.olympiads');
    }
    // POST /admin/olympiads/{id}/reject
    public function reject($olympiad, Request $request)
    {
        $request->validate(['rejection_reason' => 'required']);
        $olympiad = Olympiad::find($olympiad);

        $olympiad->update([
            'status' => 'rejected',
            'moderated_by' => auth()->id(),
            'moderated_at' => now(),
        ]);

        OlympiadModerationLog::create([
            'olympiad_id' => $olympiad->id,
            'moderator_id' => auth()->id(),
            'action' => 'reject',
            'comment' => $request->rejection_reason,
            'created_at' => now(),
        ]);

        $olympiad->save();

        $admins = $olympiad->institution->admins;

        Notification::send($admins, new OlympiadRejected($olympiad));

        return redirect()->route('platform.olympiads');

    }
}
