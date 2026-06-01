<?php
namespace App\Services;

use App\Models\AccessGrant;
use App\Models\Invoice;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\PaymentAttempt;
use App\Models\PaymentTransaction;
use App\Models\Receipt;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentCallbackService
{
    protected OrderService $orderService;
    protected AccessGrantService $accessGrantService;
    public function __construct(OrderService $orderService, AccessGrantService $accessGrantService)
    {
        $this->orderService = $orderService;
        $this->accessGrantService = $accessGrantService;
    }

    /**
     * Обработать успешный платеж от шлюза.
     */
    public function processSuccess(int $invoiceId, string $externalTxId, float $sum, array $rawData): void
    {
        DB::transaction(function () use ($invoiceId, $externalTxId, $sum, $rawData) {
            
            // 1. Находим инвойс. Используем lockForUpdate(), чтобы защититься от одновременных запросов
            $invoice = Invoice::where('id', $invoiceId)->lockForUpdate()->firstOrFail();

            // Если инвойс уже оплачен, ничего не делаем (защита от повторных вебхуков)
            if ($invoice->status === 'paid') {
                return;
            }

            // 2. Находим связанное намерение платежа (payments)
            $payment = Payment::where('invoice_id', $invoice->id)
                ->where('gateway', 'paykeeper')
                ->firstOrFail();
            
            // 3. Находим последнюю запущенную попытку (payment_attempts)
            $attempt = PaymentAttempt::where('payment_id', $payment->id)
                ->latest()
                ->firstOrFail();

            // 4. Фиксируем успешную транзакцию в таблице `payment_transactions`
            $transaction = PaymentTransaction::create([
                'payment_attempt_id' => $attempt->id,
                'transaction_type'   => 'charge',
                'external_tx_id'     => $externalTxId, // ID операции в PayKeeper
                'amount_minor'       => (int) ($sum * 100), // Переводим рубли обратно в копейки
                'status'             => 'succeeded',
                'processed_at'       => now(),
            ]);
            
            // 5. Создаем запись о чеке ОФД в таблице `receipts`
            // Номер чека (fspd) вытаскиваем из данных, если банк его прислал
            $receiptNumber = $rawData['fspd'] ?? $rawData['receipt_id'] ?? 'OFD-' . $externalTxId;
            
            $Receipt = Receipt::create([
                'transaction_id' => $transaction->id,
                'invoice_id' => $invoice->id,
                'number' => $receiptNumber,
                'status' => 'issued', // Выставлен
                'fiscal_provider' => 'paykeeper',
                'created_at' => now(),
                'external_receipt_id' => $rawData['invoice_id'] ?? null, // Внутренний ID счета в PayKeeper
            ]);
            

            // 6. Создаем Успешный заказ в таблице `orders`
            
            // 7. Обновляем статусы во всей цепочке на успешные
            $attempt->update(['status' => 'succeeded']);
            $payment->update(['status' => 'succeeded']);
            $invoice->update(['status' => 'paid']);
            
            $order = $this->orderService->create($invoice);
            
            $accessGrantService = $this->accessGrantService->createAccessGrant($order);
            return $accessGrantService;
        });
    }
}

