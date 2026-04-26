<?php

namespace App\Orchid\Screens;

use App\Models\Institution;
use App\Models\User;
use App\Notifications\InstitutionApproved;
use App\Notifications\InstitutionRejected;
use App\Orchid\Layouts\InstitutionModerationLayout;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Orchid\Screen\Actions\ModalToggle;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\TextArea;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class InstitutionModerationScreen extends Screen
{
    /**
     * Fetch data to be displayed on the screen.
     *
     * @return array
     */
    public function query(): iterable
    {
        return [
            'institutions' => Institution::with('attachment')->where('status', 'pending')->paginate(),
        ];
    }

    /**
     * The name of the screen displayed in the header.
     *
     * @return string|null
     */
    public function name(): ?string
    {
        return 'Заявки на регистрацию ОО';
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
            InstitutionModerationLayout::class,
            Layout::modal('rejectModal', [
                Layout::rows([
                    TextArea::make('moderation_comment')
                        ->title('Причина отклонения')
                        ->required()
                        ->rows(5)
                        ->placeholder('Укажите причину, по которой заявка отклоняется...')
                        ->help('Причина будет отправлена на email администратору организации'),

                    Input::make('institution_id')->type('hidden'),
                ]),
            ])->title('Отклонение заявки')
              ->applyButton('Отклонить')
              ->closeButton('Отмена'),
        ];
    }

    public function approve(Request $request): void
    {
        $id = $request->input('id');
        $institution = Institution::findOrFail($id);

        if (!$institution->status == 'approve') {
            Toast::error('Эта заявка уже обработана');
            return;
        }

        $institution->update([
            'status' => 'approved',
            'moderated_by' => auth()->id(),
            'moderated_at' => now(),
            'moderation_comment' => $request->moderation_comment,
        ]);

        $admin = $institution->admins()->first();
        if ($admin) {
            $admin->notify(new InstitutionApproved($institution));
        }

        Toast::success("Организация {$institution->name} успешно одобрена");
    }

    public function reject(Request $request): void
    {
        $id = $request->input('id');
        $reason = $request->input('moderation_comment');

        $request->validate([
            'moderation_comment' => 'required|string|min:10|max:1000',
        ]);

        $institution = Institution::findOrFail($id);

        $institution->update([
            'status' => 'reject',
            'moderated_by' => auth()->id(),
            'moderated_at' => now(),
            'moderation_comment' => $request->moderation_comment,
        ]);

        $admin = $institution->admins()->first();

        $admin->notify(new InstitutionRejected($institution));

        Toast::message("Организация отклонена");
    }


}
