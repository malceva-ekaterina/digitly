<?php

namespace App\Orchid\Layouts;

use App\Models\Institution;
use Orchid\Screen\Layouts\Table;
use Orchid\Screen\TD;
use Orchid\Attachment\Models\Attachment;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\DropDown;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Actions\ModalToggle;
use Orchid\Screen\Fields\Group;

class InstitutionModerationLayout extends Table
{
    /**
     * Data source.
     *
     * The name of the key to fetch it from the query.
     * The results of which will be elements of the table.
     *
     * @var string
     */
    protected $target = 'institutions';

    /**
     * Get the table cells to be displayed.
     *
     * @return TD[]
     */
    protected function columns(): iterable
    {
        return [
            TD::make('id', 'ID'),
            TD::make('fullname', 'Полное название'),
            TD::make('shortname', 'Короткое название'),
            TD::make('website_url', 'Вебсайт'),
            TD::make('created_at', 'Дата заявки'),
            TD::make('file', 'Скан заявления')
                ->render(function (Institution $institution)
                {
                    $file = $institution->applicationScan()->first();
                    return $file ? $file->url : 'Нет файла';
                }),
            TD::make('Actions', 'Действия')
                ->align(TD::ALIGN_CENTER)
                ->render(function (Institution $institution) { // Только один аргумент!
                    return Group::make([
                        Button::make('Одобрить')
                            ->icon('bs.check-circle')
                            ->method('approve')
                            ->parameters(['id' => $institution->id])
                            ->class('btn btn-link text-success'),

                        ModalToggle::make('Отклонить')
                                ->icon('bs.x-circle')
                                ->modal('rejectModal')
                                ->modalTitle("Отклонение заявки: {$institution->name}")
                                ->method('reject')
                                ->parameters(['id' => $institution->id]),
                    ]);
                }),

        ];
    }
}
