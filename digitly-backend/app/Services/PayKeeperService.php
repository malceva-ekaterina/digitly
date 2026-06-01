<?php
namespace App\Services;

use App\Models\Invoice;
use Illuminate\Support\Facades\Http;

class PayKeeperService
{
    protected string $server;
    protected string $login;
    protected string $password;

    public function __construct()
    {
        
        $this->server = config('services.paykeeper.server');
        $this->login = config('services.paykeeper.login');
        $this->password = config('services.paykeeper.password');
    }

    /**
     * Сгенерировать ссылку на оплату в PayKeeper с фискальными данными для чека ОФД.
     */
    public function createPaymentLink(Invoice $invoice, string $clientEmail): string
    {
        // 1. ШАГ А: Запрашиваем временный токен (пропуск) у PayKeeper
        // Используем Basic-авторизацию (передаем логин и пароль)
        $tokenResponse = Http::withBasicAuth($this->login, $this->password)
            ->get("{$this->server}/info/settings/token/");

        $token = $tokenResponse->json()['token'] ?? null;

        if (!$token) {
            throw new \Exception('Не удалось получить токен авторизации от сервера PayKeeper.');
        }

        // 2. ШАГ Б: Формируем корзину товаров для налоговой (54-ФЗ)
        // Мы берем сохраненные invoice_items и переводим копейки в рубли (делением на 100)
        $paykeeperCart = [];
        foreach ($invoice->items as $item) {
            $paykeeperCart[] = [
                'name' => $item->name,                                 // Название товара из снапшота
                'price' => (float) ($item->unit_price_minor / 100),     // Цена за 1 шт в рублях (например, 150.00)
                'quantity' => (int) $item->quantity,                       // Количество
                'sum' => (float) ($item->total_price_minor / 100),    // Общая сумма по этой позиции
                'tax'  => 'none',                                      // НДС (none — без НДС, vat0, vat10, vat20)
                'item_type' => $this->getFiscalItemType($item->product_type) 
            ];
        }

        // 3. ШАГ В: Отправляем анкету заказа и получаем ссылку на оплату
        $invoiceResponse = Http::withBasicAuth($this->login, $this->password)
            ->asForm() // Передаем данные как обычную форму (x-www-form-urlencoded)
            ->post("{$this->server}/change/invoice/preview/", [
                'pay_amount' => (float) ($invoice->total_minor / 100), 
                'client_email' => $clientEmail,                          // Email покупателя (туда ОФД пришлет чек)
                'orderid' => $invoice->id,                          // ID нашего инвойса
                'service_name' => "Оплата счета №{$invoice->number}",     // Краткое описание платежа
                'token'  => $token,                                // Временный токен из Шага А
                'cart' => json_encode($paykeeperCart),           // Готовый JSON-список товаров для чека
            ]);

        // Извлекаем готовую ссылку из ответа банка
        $invoiceUrl = $invoiceResponse->json()['invoice_url'] ?? null;

        // Если банк не вернул готовую ссылку, но вернул ID счета, собираем ссылку вручную
        if (!$invoiceUrl) {
            $invoiceId = $invoiceResponse->json()['invoice_id'] ?? null;
            if ($invoiceId) {
                return "{$this->server}/bill/{$invoiceId}/";
            }
            throw new \Exception('Ошибка создания счета: PayKeeper не вернул ссылку на оплату.');
        }

        return $invoiceUrl;
    }

    /**
     * Помощник для определения признака предмета расчета (для ОФД)
     */
    private function getFiscalItemType(string $productType): string
    {
        // По твоей структуре: олимпиады — это услуга (service), а товары из киоска — товар (commodity)
        return match ($productType) {
            'olympiad' => 'service',
            default    => 'commodity',
        };
    }
}
