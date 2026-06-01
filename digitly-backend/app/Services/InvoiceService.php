<?php

namespace App\Services;


use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use App\Models\PaymentAttempt;
use App\Models\ShoppingCart;
use App\Services\PayKeeperService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InvoiceService
{
    protected PayKeeperService $payKeeperService;
    protected OrderService $orderService;
    protected AccessGrantService $accessGrantService;

    public function __construct(PayKeeperService $payKeeperService, OrderService $orderService, AccessGrantService $accessGrantService)
    {
        $this->payKeeperService = $payKeeperService;
        $this->orderService = $orderService;
        $this->accessGrantService = $accessGrantService;
    }

    /**
     * Оформить инвойс и подготовить платеж на основе корзины.
     */
    public function checkout(ShoppingCart $cart, string $clientEmail): array
    {
        // Оборачиваем всё в транзакцию БД. Если на каком-то шаге произойдет сбой,
        // база данных автоматически откатится к исходному состоянию (атомарность).
        return DB::transaction(function () use ($cart, $clientEmail) {
            
            // Жадная загрузка элементов корзины и полиморфных продуктов
            $cart->load('items.product');

            // 1. Считаем общую сумму корзины в копейках
            $totalMinor = $cart->items->sum('unit_price_minor');

            if ($totalMinor < 0) {
                throw new \Exception('Нельзя выставить счет для пустой корзины');
            }

            // 2. Создаем Счёт (invoices)
            $invoiceNumber = 'INV-' . strtoupper(Str::random(8)) . '-' . time();
            
            $invoice = Invoice::create([
                'user_id' => $cart->user_id,
                'shopping_cart_id' => $cart->id,
                'number' => $invoiceNumber,
                'currency' => $cart->currency ?? 'RUB',
                'total_minor' => $totalMinor,
                'status' => 'pending',
                'created_at' => now(),
                'due_at' => now()->addHours(24), // Счёт активен 24 часа
            ]);

            // 3. Создаем Снапшот товаров (invoice_items)
            foreach ($cart->items as $cartItem) {
                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'product_type' => $cartItem->product_type,
                    'product_id' => $cartItem->product_id,
                    'version_id' => $cartItem->version_id,
                    'name' => $cartItem->product?->title ?? 'Товар без названия', // Замораживаем название
                    'quantity' => 1, // Если у вас появится колонка quantity, подставьте её сюда
                    'unit_price_minor' => $cartItem->unit_price_minor,
                    'total_price_minor' => $cartItem->unit_price_minor * 1, // Цена * количество
                    
                ]);
            }

            if ($invoice->total_minor === 0)
            {
                $invoice->status = 'paid';
                $invoice->save();

                $order = $this->orderService->create($invoice);
                $this->accessGrantService->createAccessGrant($order);
                $cart->items()->delete();
                return [
                    'invoice_id'  => $invoice->id,
                    'message' => 'Доступ предоставлен',
                ];

            }

            // 4. Создаем Намерение оплаты (payments)
            // Идемпотентный ключ защищает от повторных случайных кликов/запросов
            $idempotencyKey = 'pay_' . $invoice->id . '_' . Str::random(10);

            $payment = Payment::create([
                'invoice_id'      => $invoice->id,
                'gateway'         => 'paykeeper',
                'amount_minor'    => $invoice->total_minor,
                'currency'        => $invoice->currency,
                'status'          => 'requires_action', // Ожидает действий пользователя
                'idempotency_key' => $idempotencyKey,
                'created_at' => now(),
            ]);

            // 5. Обращаемся к нашему PayKeeperService за реальной ссылкой
            // Передаем инвойс, в котором внутри уже лежат invoice_items (для ФЗ-54)
            try {
                $paymentUrl = $this->payKeeperService->createPaymentLink($invoice, $clientEmail);
                
                // В реальном API PayKeeper из ответа можно вытащить ID сессии, 
                // если демо-версия его не присылает — сгенерируем свой для логирования
                $gatewaySessionId = 'pk_sess_' . Str::random(16);
            } catch (\Exception $e) {
                // Если шлюз упал, обновляем статус намерения и пробрасываем ошибку дальше
                $payment->update(['status' => 'failed']);
                throw $e;
            }

            // 6. Записываем Попытку оплаты (payment_attempts)
            PaymentAttempt::create([
                'payment_id'         => $payment->id,
                'status'             => 'processing', // Попытка в процессе (пользователь вводит карту)
                'gateway_session_id' => $gatewaySessionId,
                'started_at'         => now(),
            ]);

            // 7. Очищаем корзину (удаляем только элементы, сама корзина бессрочная)
            $cart->items()->delete();

            // Возвращаем данные для контроллера
            return [
                'invoice_id'  => $invoice->id,
                'payment_url' => $paymentUrl,
            ];
        });
    }
}
