<?php

namespace App\Http\Controllers\Api;


use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\PaymentCallbackService;
use Illuminate\Support\Facades\Log;

class PayKeeperCallbackController extends Controller
{
    public function handle(Request $request, PaymentCallbackService $callbackService)
    {
        // Читаем параметры, которые прислал PayKeeper
        $paykeeperId = $request->input('id');       // ID транзакции в шлюзе
        $sum = $request->input('sum');      // Сумма в рублях
        $invoiceId = $request->input('orderid');  // ID нашего инвойса
        $bankKey = $request->input('key');      // Хэш подписи от банка

        // Проверяем, что все обязательные поля на месте
        if (!$paykeeperId || !$sum || !$invoiceId || !$bankKey) {
            return response('Неполные данные запроса', 400);
        }

        // ПРОВЕРКА ПОДПИСИ (Защита)
        $secret = config('services.paykeeper.secret');
        
        // Формула из документации: md5(id + sum + orderid + secret)
        // Важно: сумма должна быть строго отформатирована с точкой и 2 знаками (например, 150.00)
        $formattedSum = number_format((float)$sum, 2, '.', '');
        $myKey = md5($paykeeperId . $formattedSum . $invoiceId . $secret);

        if ($bankKey !== $myKey) {
            Log::warning("PayKeeper: Попытка подделки подписи для инвойса #{$invoiceId}");
            return response('Неверная цифровая подпись', 400);
        }

        try {
            // Передаем данные в сервис для безопасной записи в таблицы
            $callbackService->processSuccess((int)$invoiceId, $paykeeperId, (float)$sum, $request->all());
            
            // Если всё прошло успешно, возвращаем ответ, который требует PayKeeper
            return response("OK " . md5($paykeeperId . $secret));
            
        } catch (\Exception $e) {
            Log::error("PayKeeper Callback Error: " . $e->getMessage());
            return response('Внутренняя ошибка сервера', 500);
        }
    }
}

