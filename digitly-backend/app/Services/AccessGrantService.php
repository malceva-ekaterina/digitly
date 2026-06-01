<?php

namespace App\Services;

use App\Models\AccessGrant;
use App\Models\Invoice;
use App\Models\Order;
use App\Notifications\AccessGrantNotification;

class AccessGrantService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function createAccessGrant(Order $order)
    {
        $invoice = $order->invoice;
        $user = $invoice->user;

        foreach ($order->items as $item) {
            $access = AccessGrant::create([
                'recipient_user_id' => $user->id,
                'recipient_email' => $user->email,
                'product_type' => $item->product_type,
                'product_id' => $item->product_id,
                'version_id' => $item->version_id,
                'order_item_id' => $item->id,
                'status' => 'active',
                'activated_at' => now(),
            ]);
            $user->notify(new AccessGrantNotification($access));
        }
        
        return true;
    }
}
