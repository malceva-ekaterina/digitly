<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $fillable = [
        'shopping_cart_id',
        'product_type', 
        'product_id',   
        'version_id',   
        'unit_price_minor',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'price_minor' => 'integer',
    ];

    public function shoppingCart()
    {
        return $this->belongsTo(ShoppingCart::class);
    }

    public function product()
    {
        return $this->morphTo();
    }

    public function getProductNameAttribute(): string
{
    $product = $this->product;
    
    if (!$product) {
        return 'Товар недоступен';
    }

    return match($this->product_type) {
        'olympiad' => $product->title,
        'kiosk_item_version' => $product->kioskItem->title ?? 'Элемент киоска',
        'question_bank' => $product->name,
        default => 'Неизвестный товар',
    };
}

    #[Scope]
    protected function checkItem(Builder $query, $cartId, $product_type, $product_id, $version_id): void
    {
        $query->where('shopping_cart_id', $cartId)->where('product_type', $product_type)->where('product_id', $product_id)->where('version_id', $version_id);
    }

}
