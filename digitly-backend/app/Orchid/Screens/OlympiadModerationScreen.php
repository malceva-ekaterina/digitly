<?php

namespace App\Orchid\Screens;

use App\Models\Olympiad;
use App\Models\OlympiadModerationLog;
use App\Notifications\OlympiadApproved;
use App\Notifications\OlympiadRejected;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Actions\ModalToggle;
use Orchid\Screen\Fields\Group;
use Orchid\Screen\Fields\TextArea;
use Orchid\Screen\Screen;
use Orchid\Screen\TD;
use Orchid\Support\Facades\Layout;

class OlympiadModerationScreen extends Screen
{
    /**
     * Fetch data to be displayed on the screen.
     *
     * @return array
     */
    public function query(): iterable
    {
        return [
            'olympiads' => Olympiad::where('status', 'pending_moderation')->paginate(),
        ];
    }

    /**
     * The name of the screen displayed in the header.
     *
     * @return string|null
     */
    public function name(): ?string
    {
        return 'Модерация олимпиад';
    }

    /**
     * The screen's action buttons.
     *
     * @return \Orchid\Screen\Action[]
     */
    public function commandBar(): iterable
    {
        return [


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
              Layout::table('olympiads', [
                TD::make('id', 'ID')
                    ->sort()
                    ->filter(TD::FILTER_NUMERIC)
                    ->width('80px'),

                TD::make('title', 'Название')
                    ->render(fn (Olympiad $olympiad) => Link::make($olympiad->title)
                    ->route('platform.olympiads.detail', $olympiad->id)),

                TD::make('institution_id', 'ОО')
                    ->render(function (Olympiad $olympiad) {
                        return $olympiad->institution?->shortname ?? '—';
                    }),

                TD::make('questions_count', 'Количество вопросов')
                    ->render(function (Olympiad $olympiad) {
                        return $olympiad->questions()->count();
                    })
                    ->alignCenter(),

                TD::make('updated_at', 'Дата отправки')
                    ->render(function (Olympiad $olympiad) {
                        return $olympiad->updated_at?->format('d.m.Y H:i') ?? '—';
                    })
                    ->sort(),

                TD::make('actions', 'Действия')
                    ->alignCenter()
                    ->render(function (Olympiad $olympiad) {
                        return Group::make([
                            Button::make('Одобрить')
                                ->icon('bs.check-circle')
                                ->method('approve', ['id' => $olympiad->id])
                                ->confirm('Вы уверены, что хотите одобрить эту олимпиаду?'),
                            ModalToggle::make('Отклонить')
                                ->icon('bs.x-circle')
                                ->method('reject', ['id' => $olympiad->id])
                                ->modal('rejectOlympiadModal'),
                        ]);
                    }),
            ]),

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

    // POST /admin/olympiads/{id}/approve
    public function approve(Request $request)
    {
        $olympiad = Olympiad::find($request->id);
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

        return redirect()->back();
    }
    // POST /admin/olympiads/{id}/reject
    public function reject($id, Request $request)
    {
        $request->validate(['rejection_reason' => 'required']);
        $olympiad = Olympiad::find($id);

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

        return redirect()->back();
    }
}
