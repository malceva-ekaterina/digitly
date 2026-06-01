<?php

namespace App\Services;

use App\Models\AwardDocumentTemplate;
use Illuminate\Support\Facades\Storage;

class DocumentGeneratorService
{
    /**
     * Create a new class instance.
     */
    /**
     * Перевод занятого места словами.
     */
    public function placeToWords(int $place): string
    {
        return match ($place) {
            1       => 'Первое место',
            2       => 'Второе место',
            3       => 'Третье место',
            default => 'Участник',
        };
    }

    /**
     * Динамическая генерация диплома/сертификата.
     */
    public function generate(AwardDocumentTemplate $template, array $data): string
    {
        // Получаем объект файла Orchid из связи belongsTo
        $attachment = $template->background;

        if (!$attachment) {
            throw new \Exception("Для шаблона '{$template->name}' не загружен файл фона.");
        }
// 1. Получаем диск, куда Orchid сохранил файл
        $diskName = $attachment->disk; 

        // 2. Собираем точный относительный путь к файлу: папка + уникальное имя + расширение
        // Orchid хранит уникальное имя файла на диске в колонке 'name', а расширение в 'extension'
        $fileName = $attachment->name . '.' . $attachment->extension;
        $relativeKey = rtrim($attachment->path, '/') . '/' . $fileName;

        // Убираем возможный начальный слэш для корректной работы фасада Storage
        $relativeKey = ltrim($relativeKey, '/');

        // 3. Проверяем существование файла через Laravel Storage
        if (!Storage::disk($diskName)->exists($relativeKey)) {
            throw new \Exception("Файл фона не найден по пути: {$relativeKey} на диске {$diskName}");
        }

        // 4. Получаем абсолютный системный путь для GD библиотеки
        $bgPath = Storage::disk($diskName)->path($relativeKey);

        // Теперь getimagesize гарантированно получит файл, а не директорию
        $info = getimagesize($bgPath);

        if (!file_exists($bgPath)) {
            throw new \Exception("Файл фона физически отсутствует на диске сервера.");
        }

        // Создаем GD-ресурс изображения
        $info = getimagesize($bgPath);
        $image = match ($info['mime']) {
            'image/jpeg', 'image/jpg' => imagecreatefromjpeg($bgPath),
            'image/png' => imagecreatefrompng($bgPath),
            default => throw new \Exception('Неподдерживаемый формат фонового изображения (нужен PNG или JPG).'),
        };

        imagealphablending($image, true);
        imagesavealpha($image, true);

        // Путь к кириллическому шрифту в вашем проекте
        $fontPath = resource_path('fonts/Arial.ttf'); 
        if (!file_exists($fontPath)) {
            throw new \Exception('Шрифт Arial.ttf не найден. Скопируйте его в resources/fonts/.');
        }

        // Подготовка динамических параметров
        $dynamicValues = [
            'fullname' => $data['fullname'] ?? '',
            'place' => $this->placeToWords((int)($data['place'] ?? 0)),
            'olympiad' => $data['olympiad'] ?? '',
            'date' => $data['date'] ?? now()->format('d.m.Y'),
            'institution' => $data['institution_title'] ?? '',
        ];

        $configFields = $template->fields_config;

        if (is_string($configFields)) {
            $configFields = json_decode($configFields, true);
        }

        // Нанесение текста по координатам из fields_config
        if (is_array($configFields)) {
            foreach ($configFields as $fieldName => $config) {
                if (isset($dynamicValues[$fieldName]) && $dynamicValues[$fieldName] !== '') {
                    
                    $text = $this->prepareCyrillic($dynamicValues[$fieldName]);

                    $x = (int) ($config['x'] ?? 0);
                    $y = (int) ($config['y'] ?? 0);
                    $size = (int) ($config['size'] ?? 24);
                    
                    $hexColor = $config['color'] ?? '#000000';
                    list($r, $g, $b) = sscanf($hexColor, "#%02x%02x%02x");
                    // $color = imagecolorallocate($image, $r, $g, $b);
                    $color = imagecolorallocatealpha($image, $r, $g, $b, 0); 
                    imagettftext($image, $size, 0, $x, $y, $color, $fontPath, $text);
                }
            }
        }
       
        // Сохраняем в буфер памяти и возвращаем бинарные данные
        ob_start();
        imagepng($image);
        $imageData = ob_get_clean();

        imagedestroy($image);

        return $imageData;
    }

    private function prepareCyrillic(string $text): string
    {
        // Гарантируем, что строка находится в чистом UTF-8
        return mb_convert_encoding($text, 'UTF-8', 'auto');
    }
}
