<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Str;


class OrderService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function create(Invoice $invoice)
    {
        $orderNumber = 'ORD-' . strtoupper(Str::random(8)) . '-' . time();
            
        $order = Order::create([
            'customer_id' => $invoice->user_id, // Плательщик
            'invoice_id'  => $invoice->id,
            'number'      => $orderNumber,
            'total_minor' => $invoice->total_minor,
            'created_at' => now(),
        ]);

        foreach ($invoice->items as $item)
        {
            
            $price = $item->unit_price_minor;
            $gatewayFee = $price * 0.025; // 2.5% PayKeeper
            if ($item->product_type === 'olympiad') {
                $platformFee = $price * 0.15; // 15% для олимпиад
            } elseif ($item->product_type === 'kiosk_item') {
                $platformFee = $price * 0.22; // 22% для киоска
            } else {
                $platformFee = $price * 0.02; 

            }
            $institutionEarn = $price - $platformFee - $gatewayFee; 

            OrderItem::create([
                'order_id' => $order->id,
                'product_type' => $item->product_type,
                'product_id' => $item->product_id,
                'version_id' => $item->version_id,
                'name' => $item->name,
                'quantity' => $item->quantity,
                'unit_price_minor' => $price,
                'gateway_fee_minor' => $gatewayFee,
                'platform_fee_minor' => $platformFee,
                'institution_earn_minor' => $institutionEarn,
            ]);
        }

        return $order;

    }
}
