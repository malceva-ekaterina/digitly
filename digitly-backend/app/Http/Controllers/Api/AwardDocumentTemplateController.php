<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateTemplateRequest;
use App\Models\AwardDocumentTemplate;
use App\Models\Institution;
use App\Services\AwardDocumentTemplateService;
use App\Services\DocumentGeneratorService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AwardDocumentTemplateController extends Controller
{
    public function createTemplates(CreateTemplateRequest $request, $id, AwardDocumentTemplateService  $awardDocumentTemplateService)
    {
        $institution = Institution::find($id);
        if (!$institution) {
            return response()->json(['message' => 'Institution not found'], 404);
        }
        $doc = AwardDocumentTemplate::create([
            'institution_id' => $id,
            'name' => $request->name,
            'doc_type' => $request->type,
            'fields_config' => $request->fields_config,
            'created_at' => now(),
        ]);

        $awardDocumentTemplateService->upload($doc, $request->file('background'));

        return response()->json(['message' => 'Templates creates successfully'], 201);

    }
    public function get( DocumentGeneratorService $generator)
    {
        $template = AwardDocumentTemplate::find(2);
        // Собираем динамические данные участника
        $data = [
            'fullname' => 'Иванов Иван Иванович',
            'place' => 1, // Превратится в "Первое место"
            'olympiad_title' => 'Всероссийская олимпиада по Laravel 2026',
            'date' => '31.05.2026',
            'institution_title' => 'МАОУ СОШ №32',
        ];

        // Генерируем бинарник картинки
        $fileContent = $generator->generate($template, $data);

        // Отдаем файл в браузер как скачиваемый PNG-документ
        return response($fileContent)
            ->header('Content-Type', 'image/png')
            ->header('Content-Disposition', 'attachment; filename="diploma.png"');
    }
}
